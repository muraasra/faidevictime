# -*- coding: utf-8 -*-
"""
Audit et ré-indexation des services par arrondissement.

Usage :
    python tools/reindex_services.py                  # audit + inférence k-NN (hors ligne)
    python tools/reindex_services.py --geocode        # + reverse-geocoding Nominatim (précis,
                                                      #   nécessaire pour distinguer Ngaoundéré 1/2/3)

Produit dans tools/output/ :
    - corrections_arrondissement.csv : id, nom, arrondissement proposé, méthode, confiance
    - doublons.csv                   : paires de doublons détectés (même nom + <500 m)
    - a_purger.csv                   : entrées de test / données invalides
"""
import argparse
import csv
import json
import math
import os
import sys
import time
import unicodedata
import urllib.request

API_URL = "https://wilfriedtayou.pythonanywhere.com/api/question-transversale/"
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "output")
NOMINATIM_URL = "https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat={lat}&lon={lon}&zoom=14&accept-language=fr"

# Conversion des chiffres romains OSM ("Ngaoundéré II") vers la convention de la base ("Ngaoundere 2")
ROMAN_SUFFIXES = [(" iii", " 3"), (" ii", " 2"), (" i", " 1"), (" 3e", " 3"), (" 2e", " 2"), (" 1er", " 1")]


def canonical_arrondissement(name):
    if not name:
        return name
    normalized = normalize(name)
    for roman, digit in ROMAN_SUFFIXES:
        if normalized.endswith(roman):
            normalized = normalized[: -len(roman)] + digit
            break
    # Restitue une capitalisation propre ("ngaoundere 2" -> "Ngaoundere 2")
    return " ".join(w.capitalize() if not w.isdigit() else w for w in normalized.split())

# Seuil : un service à plus de cette distance (km) de son plus proche voisin étiqueté
# est marqué "à vérifier manuellement" plutôt que corrigé automatiquement.
KNN_MAX_DISTANCE_KM = 15
DUPLICATE_RADIUS_KM = 0.5


def normalize(text):
    text = unicodedata.normalize("NFKD", text or "").encode("ascii", "ignore").decode()
    return " ".join(text.lower().split())


def haversine(lat1, lon1, lat2, lon2):
    R = 6371
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2) ** 2
         + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2) ** 2)
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))


def coords(service):
    try:
        return float(service["latitude"]), float(service["longitude"])
    except (TypeError, ValueError, KeyError):
        return None


def fetch_services():
    with urllib.request.urlopen(API_URL, timeout=60) as response:
        return json.load(response)


def knn_infer(target, labeled, k=5):
    """Arrondissement majoritaire parmi les k voisins étiquetés les plus proches."""
    point = coords(target)
    if not point:
        return None, None
    distances = []
    for service in labeled:
        other = coords(service)
        if not other:
            continue
        distances.append((haversine(point[0], point[1], other[0], other[1]),
                          service["arrondissement"].strip()))
    distances.sort()
    nearest = distances[:k]
    if not nearest:
        return None, None
    votes = {}
    for d, arr in nearest:
        votes[arr] = votes.get(arr, 0) + 1
    best = max(votes, key=votes.get)
    return best, nearest[0][0]  # arrondissement, distance au plus proche voisin


def nominatim_reverse(lat, lon):
    request = urllib.request.Request(
        NOMINATIM_URL.format(lat=lat, lon=lon),
        headers={"User-Agent": "faidevictime-reindex/1.0 (audit interne)"}
    )
    with urllib.request.urlopen(request, timeout=30) as response:
        data = json.load(response)
    address = data.get("address", {})
    # À zoom 14, l'arrondissement sort dans "city" ("Ngaoundéré II", "Bafoussam Ier"...) ;
    # "municipality" ne donne que la communauté urbaine (trop grossier).
    raw = (address.get("city") or address.get("town")
           or address.get("village") or address.get("municipality"))
    return canonical_arrondissement(raw)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--geocode", action="store_true",
                        help="Utiliser Nominatim pour les cas ambigus (1 req/s, ~4 min)")
    parser.add_argument("--input", help="Fichier JSON local au lieu de l'API")
    args = parser.parse_args()

    os.makedirs(OUTPUT_DIR, exist_ok=True)

    if args.input:
        with open(args.input, encoding="utf-8") as f:
            services = json.load(f)
    else:
        print("Telechargement des services depuis l'API...")
        services = fetch_services()
    print(f"{len(services)} services charges")

    labeled = [s for s in services if (s.get("arrondissement") or "").strip()]
    unlabeled = [s for s in services if not (s.get("arrondissement") or "").strip()]
    print(f"{len(labeled)} etiquetes / {len(unlabeled)} sans arrondissement")

    # --- 1. Corrections d'arrondissement ---
    corrections = []
    for service in unlabeled:
        arr, dist_km = knn_infer(service, labeled)
        method, confidence = "knn", "haute"
        if arr is None:
            method, confidence = "aucune", "nulle"
        elif dist_km > KNN_MAX_DISTANCE_KM:
            confidence = "faible - a verifier"

        if args.geocode:
            point = coords(service)
            if point:
                try:
                    geo = nominatim_reverse(*point)
                    if geo:
                        arr, method, confidence = geo, "nominatim", "haute"
                except Exception as exc:
                    print(f"  geocode KO pour id {service['id']}: {exc}")
                time.sleep(1.1)  # politique d'usage Nominatim : 1 req/s max

        corrections.append({
            "id": service["id"],
            "nom_structure": service["nom_structure"],
            "latitude": service.get("latitude"),
            "longitude": service.get("longitude"),
            "arrondissement_propose": arr or "",
            "methode": method,
            "confiance": confidence,
        })

    with open(os.path.join(OUTPUT_DIR, "corrections_arrondissement.csv"), "w",
              newline="", encoding="utf-8-sig") as f:
        writer = csv.DictWriter(f, fieldnames=list(corrections[0].keys()))
        writer.writeheader()
        writer.writerows(corrections)
    print(f"-> corrections_arrondissement.csv ({len(corrections)} lignes)")

    # --- 2. Doublons : même nom normalisé + < 500 m ---
    by_name = {}
    for service in services:
        by_name.setdefault(normalize(service["nom_structure"]), []).append(service)

    duplicates = []
    for name, group in by_name.items():
        if len(group) < 2:
            continue
        for i in range(len(group)):
            for j in range(i + 1, len(group)):
                a, b = coords(group[i]), coords(group[j])
                if a and b and haversine(a[0], a[1], b[0], b[1]) < DUPLICATE_RADIUS_KM:
                    keep, remove = sorted((group[i], group[j]), key=lambda s: s["id"])
                    duplicates.append({
                        "nom": name,
                        "id_a_garder": keep["id"],
                        "id_a_supprimer": remove["id"],
                        "distance_m": round(haversine(a[0], a[1], b[0], b[1]) * 1000),
                    })

    with open(os.path.join(OUTPUT_DIR, "doublons.csv"), "w", newline="", encoding="utf-8-sig") as f:
        writer = csv.DictWriter(f, fieldnames=["nom", "id_a_garder", "id_a_supprimer", "distance_m"])
        writer.writeheader()
        writer.writerows(duplicates)
    print(f"-> doublons.csv ({len(duplicates)} paires)")

    # --- 3. Entrées à purger (données de test) ---
    to_purge = [
        {"id": s["id"], "nom_structure": s["nom_structure"], "raison": "entree de test"}
        for s in services if "test" in normalize(s["nom_structure"])
    ]
    with open(os.path.join(OUTPUT_DIR, "a_purger.csv"), "w", newline="", encoding="utf-8-sig") as f:
        writer = csv.DictWriter(f, fieldnames=["id", "nom_structure", "raison"])
        writer.writeheader()
        writer.writerows(to_purge)
    print(f"-> a_purger.csv ({len(to_purge)} entrees)")

    print("\nTermine. Fichiers dans tools/output/")


if __name__ == "__main__":
    sys.exit(main())
