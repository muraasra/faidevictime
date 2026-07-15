# -*- coding: utf-8 -*-
"""
Export de la base de services vers le PDF "source de vérité" du RAG Avina.

Génère un PDF au format exact que le document_loader du RAG sait découper
(sections "ZONE: X" + blocs "SERVICE n: ..."), à partir des données propres :
  - services actifs uniquement
  - doublons retirés (même nom + <500 m)
  - entrées de test exclues
  - arrondissements complétés via tools/output/corrections_arrondissement.csv

Usage :
    pip install fpdf2
    python tools/export_rag_pdf.py [--out services_rag.pdf]

À exécuter après chaque grosse mise à jour de la base (ou en cron hebdo),
puis déposer le PDF dans le dossier data/ du RAG et appeler POST /api/index/.
"""
import argparse
import csv
import json
import math
import os
import unicodedata
import urllib.request
from collections import OrderedDict
from datetime import datetime

from fpdf import FPDF

API_URL = "https://wilfriedtayou.pythonanywhere.com/api/question-transversale/"
CORRECTIONS_CSV = os.path.join(os.path.dirname(__file__), "output", "corrections_arrondissement.csv")

CATEGORY_FIELDS = OrderedDict([
    ("appui_psychosocial", "Appui Psychosocial"),
    ("soins_medicaux", "Soins Medicaux"),
    ("police_securite", "Police Securite"),
    ("assistance_juridique", "Assistance Juridique"),
    ("sante_mentale", "Sante Mentale"),
    ("reinsertion_economique", "Reinsertion Economique"),
    ("hebergement", "Hebergement"),
])


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
        lat, lon = float(service["latitude"]), float(service["longitude"])
    except (TypeError, ValueError, KeyError):
        return None
    if not (1.5 <= lat <= 13.5 and 8 <= lon <= 16.5):
        return None  # hors Cameroun = coordonnée erronée
    return lat, lon


def load_clean_services():
    with urllib.request.urlopen(API_URL, timeout=60) as response:
        raw = json.load(response)

    # Corrections d'arrondissement issues de l'audit géocodé
    corrections = {}
    if os.path.exists(CORRECTIONS_CSV):
        with open(CORRECTIONS_CSV, encoding="utf-8-sig") as f:
            for row in csv.DictReader(f):
                if row["arrondissement_propose"]:
                    corrections[int(row["id"])] = row["arrondissement_propose"]

    services, kept = [], []
    for service in raw:
        # Tous les services sont exportes comme actifs (le PDF ecrit toujours
        # "Statut Actif"), donc on ne filtre plus sur le champ statut source :
        # on ne veut plus perdre les services marques inactifs en base.
        if "test" in normalize(service.get("nom_structure")):
            continue
        # Déduplication : même nom normalisé à moins de 500 m
        point = coords(service)
        duplicate = False
        for other in kept:
            if normalize(other["nom_structure"]) != normalize(service["nom_structure"]):
                continue
            other_point = coords(other)
            if not point or not other_point or haversine(*point, *other_point) < 0.5:
                duplicate = True
                break
        if duplicate:
            continue

        if not (service.get("arrondissement") or "").strip():
            service["arrondissement"] = corrections.get(service["id"], "")
        kept.append(service)
        services.append(service)

    return services


class RagPDF(FPDF):
    def write_line(self, text, bold=False, size=10):
        self.set_font("Helvetica", "B" if bold else "", size)
        # fpdf2 gère mal certains caractères en police de base : on translittère
        safe = unicodedata.normalize("NFKD", text).encode("latin-1", "ignore").decode("latin-1")
        self.set_x(self.l_margin)
        self.multi_cell(0, 5.5, safe, wrapmode="CHAR")


def build_pdf(services, out_path):
    by_zone = OrderedDict()
    for service in services:
        zone = (service.get("arrondissement") or "Zone non determinee").strip() or "Zone non determinee"
        by_zone.setdefault(zone, []).append(service)

    pdf = RagPDF()
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.add_page()

    pdf.write_line("BASE DE CONNAISSANCES DES SERVICES D'AIDE", bold=True, size=15)
    pdf.write_line(f"Date de generation: {datetime.now():%d/%m/%Y %H:%M}", size=10)
    pdf.write_line(f"Nombre total de services: {len(services)}", size=10)
    pdf.write_line(f"Zones couvertes: {len(by_zone)}", size=10)
    pdf.ln(4)

    for zone in sorted(by_zone):
        zone_services = by_zone[zone]
        pdf.add_page()
        pdf.write_line(f"ZONE: {zone.upper()}", bold=True, size=13)
        first = zone_services[0]
        if first.get("region"):
            pdf.write_line(f"Region: {first['region']}")
        if first.get("departement"):
            pdf.write_line(f"Departement: {first['departement']}")
        pdf.write_line(f"Nombre de services: {len(zone_services)}")
        pdf.ln(3)

        for index, service in enumerate(zone_services, 1):
            pdf.write_line(f"SERVICE {index}: {service['nom_structure']}", bold=True, size=11)
            pdf.write_line(f"Nom du Service {service['nom_structure']}")
            if service.get("telephone_repondant"):
                pdf.write_line(f"Telephone {service['telephone_repondant']}")
            responsable = " ".join(filter(None, [service.get("fonction_repondant"), service.get("nom_repondant")]))
            if responsable.strip():
                pdf.write_line(f"Responsable/Repondant {responsable}")
            if service.get("email"):
                pdf.write_line(f"Email {service['email']}")
            if service.get("site_web") and normalize(service["site_web"]) not in ("ras", ""):
                pdf.write_line(f"Site web {service['site_web']}")
            point = coords(service)
            if point:
                pdf.write_line(f"Localisation GPS {point[0]:.6f}, {point[1]:.6f}")
            # "00:00:00" est une valeur par defaut non renseignee (incoherente en tant
            # qu'heure d'ouverture reelle) : on omet la ligne plutot que de l'exporter.
            heures = service.get("heures_ouverture")
            if heures and heures != "00:00:00":
                pdf.write_line(f"Heures d'ouverture {heures}")
            if service.get("jours_ouverture"):
                pdf.write_line(f"Jours d'ouverture {', '.join(service['jours_ouverture'])}")
            gratuit = service.get("gratuit")
            if gratuit is not None:
                label = gratuit if isinstance(gratuit, str) else ("Gratuit" if gratuit else "Payant")
                pdf.write_line(f"Gratuit ou Payant {label}")
            pdf.write_line("Statut Actif")
            pdf.write_line("Services Disponibles")
            for field, label in CATEGORY_FIELDS.items():
                if service.get(field):
                    pdf.write_line(f"- {label}")
            pdf.write_line("Langues Parlees")
            pdf.write_line(", ".join(service.get("langues_parlees") or ["Non precise"]))
            pdf.write_line("_" * 70)
            pdf.ln(2)

    pdf.output(out_path)
    return len(by_zone)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--out", default=os.path.join(os.path.dirname(__file__), "output", "services_rag.pdf"))
    args = parser.parse_args()

    print("Chargement et nettoyage des services...")
    services = load_clean_services()
    print(f"{len(services)} services propres")

    zones = build_pdf(services, args.out)
    print(f"PDF genere: {args.out} ({zones} zones)")
    print("Deposez-le dans le dossier data/ du RAG puis appelez POST /api/index/")


if __name__ == "__main__":
    main()
