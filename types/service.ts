// Définition des catégories possibles
export type Categorie = 'sante' | 'police' | 'juridique';

// Champs spécifiques pour les services de santé
export interface ServiceSanteFields {
  nbDocteurs?: number;
  equipement?: string;
}

// Champs spécifiques pour les services de police
export interface ServicePoliceFields {
  typeSecurite?: string;
  nbAgents?: number;
}

// Champs spécifiques pour les services d’assistance juridique
export interface ServiceJuridiqueFields {
  nbJuristes?: number;
  nbPsy?: number;
}

// Union des champs spécifiques selon la catégorie
export type ServiceExtra =
  | ServiceSanteFields
  | ServicePoliceFields
  | ServiceJuridiqueFields
  | Record<string, never>; // Utilisation de Record pour un objet vide.

// Modèle principal du service
export interface Service {
  id?: number;
  nom: string;
  latitude: string;
  longitude: string;
  categorie: Categorie;
  extra: ServiceExtra;
}
