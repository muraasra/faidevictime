# 📚 Guide des Formations PADUPAC

## 🎯 Vue d'ensemble

La page des formations PADUPAC permet aux utilisateurs de découvrir et d'accéder à du contenu éducatif structuré sur la prévention des violences. Le système est conçu pour être extensible et facilement maintenable.

## 📁 Structure des ressources

### Fichier de données
- **Emplacement** : `public/formations.json`
- **Format** : JSON structuré
- **Accès** : Via HTTP à l'URL `/formations.json`

### Structure du JSON

```json
{
  "formations": [
    {
      "id": "identifiant-unique",
      "title": "Titre de la formation",
      "description": "Description courte",
      "icon": "🛡️",
      "category": "Catégorie",
      "duration": "15 min",
      "sections": [
        {
          "id": "section-id",
          "title": "Titre de la section",
          "content": "Contenu de la section avec \\n pour les retours à la ligne"
        }
      ]
    }
  ]
}
```

## 🏗️ Architecture de la page

### Composants principaux

1. **Vue liste** : Affichage des formations avec filtres
2. **Vue détaillée** : Contenu d'une formation avec navigation par sections
3. **Navigation** : Système de navigation entre sections

### Fonctionnalités

- ✅ **Filtrage par catégorie**
- ✅ **Recherche et navigation**
- ✅ **Mode sombre/clair**
- ✅ **Design responsive**
- ✅ **Indicateurs de chargement**
- ✅ **Gestion d'erreurs**

## 📝 Comment ajouter une nouvelle formation

### 1. Modifier le fichier JSON

Ajoutez un nouvel objet dans le tableau `formations` :

```json
{
  "id": "nouvelle-formation",
  "title": "Titre de la nouvelle formation",
  "description": "Description de la formation",
  "icon": "🎯",
  "category": "Nouvelle Catégorie",
  "duration": "20 min",
  "sections": [
    {
      "id": "introduction",
      "title": "Introduction",
      "content": "Contenu de l'introduction..."
    },
    {
      "id": "contenu-principal",
      "title": "Contenu principal",
      "content": "Contenu détaillé..."
    }
  ]
}
```

### 2. Structure recommandée des sections

Pour chaque formation, organisez le contenu en sections logiques :

- **Introduction** : Présentation du sujet
- **Définition** : Qu'est-ce que c'est ?
- **Signes/Indicateurs** : Comment identifier ?
- **Prévention** : Comment prévenir ?
- **Conseils pratiques** : Actions concrètes
- **Ressources** : Aide disponible
- **Message d'espoir** : Encouragement

### 3. Formatage du contenu

- Utilisez `\n` pour les retours à la ligne
- Utilisez `•` pour les listes à puces
- Structurez le contenu avec des sous-titres clairs
- Gardez les paragraphes courts et lisibles

## 🎨 Personnalisation

### Icônes disponibles
- 🛡️ Protection
- 🏠 Domestique
- 👶 Enfance
- 🚫 Interdiction
- 🎓 Éducation
- 🌍 Culture
- 🤝 Prévention
- ⚖️ Droits

### Catégories existantes
- Protection
- Protection de l'enfance
- Santé
- Éducation
- Droits humains
- Prévention
- Droits

## 🔧 Maintenance

### Vérifications régulières

1. **Format JSON** : Vérifiez la validité du JSON
2. **Contenu** : Mettez à jour les informations
3. **Liens** : Vérifiez les liens vers les services
4. **Responsive** : Testez sur mobile

### Gestion des erreurs

Le système inclut une gestion d'erreurs robuste :
- Chargement asynchrone avec indicateurs
- Fallback en cas d'erreur de chargement
- Messages d'erreur informatifs
- Validation des données

## 📱 Responsive Design

La page est optimisée pour :
- **Desktop** : Grille 3 colonnes
- **Tablet** : Grille 2 colonnes
- **Mobile** : Grille 1 colonne

## 🚀 Performance

- Chargement asynchrone des données
- Indicateurs de chargement
- Optimisation des images et icônes
- Code TypeScript pour la sécurité

## 🔗 Intégration

La page s'intègre avec :
- Système de navigation principal
- Mode sombre/clair global
- Services PADUPAC
- Carte interactive des services

## 📞 Support

Pour toute question ou problème :
1. Vérifiez la console du navigateur pour les erreurs
2. Validez le format JSON
3. Testez l'accès au fichier `/formations.json`
4. Contactez l'équipe de développement

---

*Dernière mise à jour : Janvier 2025*
