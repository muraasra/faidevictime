// Régénère assets/data/services-snapshot.json à partir de l'API des services.
// Les services changent rarement : ce script n'a pas besoin d'être lancé à chaque
// build, seulement quand la base de services a été mise à jour (nouveau service,
// changement de téléphone/horaires, etc.) — par exemple manuellement après une
// campagne de collecte, ou via une tâche planifiée hebdomadaire/mensuelle.
//
// Usage :
//   node tools/update_services_snapshot.mjs
//   node tools/update_services_snapshot.mjs --url http://localhost:8010/api/question-transversale/
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const DEFAULT_URL = "https://wilfriedtayou.pythonanywhere.com/api/question-transversale/";

const urlArgIndex = process.argv.indexOf("--url");
const API_URL = urlArgIndex !== -1 ? process.argv[urlArgIndex + 1] : DEFAULT_URL;

const OUTPUT_PATH = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "assets",
  "data",
  "services-snapshot.json"
);

async function main() {
  console.log(`Récupération des services depuis ${API_URL} ...`);
  const response = await fetch(API_URL, { headers: { Accept: "application/json" } });
  if (!response.ok) {
    throw new Error(`Échec HTTP ${response.status} en interrogeant ${API_URL}`);
  }
  const data = await response.json();
  if (!Array.isArray(data)) {
    throw new Error("Réponse inattendue : un tableau de services était attendu.");
  }
  writeFileSync(OUTPUT_PATH, JSON.stringify(data), "utf-8");
  console.log(`${data.length} services écrits dans ${OUTPUT_PATH}`);
}

main().catch((err) => {
  console.error("Échec de la mise à jour de l'instantané :", err.message);
  process.exitCode = 1;
});
