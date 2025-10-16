# Guide pour ajouter des documents PDF

## Comment ajouter un nouveau document PDF

### 1. Placer le fichier PDF
Placez votre fichier PDF dans le dossier : `public/pdf/`

**Exemple :**
```
public/pdf/mon-nouveau-document.pdf
```

### 2. Ajouter les informations dans le fichier JSON
Ouvrez le fichier `public/documents.json` et ajoutez une nouvelle entrée dans le tableau `documents` :

```json
{
  "id": "identifiant-unique",
  "title": "Titre du document",
  "description": "Description courte du document",
  "filename": "nom-du-fichier.pdf",
  "category": "Catégorie",
  "size": "Taille du fichier"
}
```

### 3. Exemple complet
```json
{
  "documents": [
    {
      "id": "guide-nouveau",
      "title": "Mon nouveau guide",
      "description": "Description de mon nouveau guide",
      "filename": "mon-nouveau-document.pdf",
      "category": "Protection",
      "size": "2.1 MB"
    }
  ]
}
```

### 4. Catégories disponibles
- Protection
- Protection de l'enfance
- Droits
- Professionnels
- Communauté
- Santé
- Juridique

### 5. Fonctionnalités automatiques
- **Visualisation** : Le bouton "Voir" ouvre le PDF dans un nouvel onglet
- **Téléchargement** : Le bouton "Télécharger" permet de sauvegarder le PDF
- **Affichage** : Les 4 premiers documents apparaissent sur la page d'accueil
- **Responsive** : L'affichage s'adapte automatiquement aux différentes tailles d'écran

### 6. Notes importantes
- Le nom du fichier dans `filename` doit correspondre exactement au nom du fichier PDF
- Utilisez des identifiants uniques pour `id`
- La taille est affichée à titre informatif
- Les documents sont triés par ordre d'apparition dans le JSON
