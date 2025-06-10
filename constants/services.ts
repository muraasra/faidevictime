export const generalQuestions = [
  { key: 'nom_structure', label: 'Nom de la structure', type: 'text', required: true },
  { key: 'fonction_repondant', label: 'Fonction du répondant', type: 'text', required: true },
  { key: 'nom_repondant', label: 'Nom du répondant', type: 'text', required: true },
  { key: 'telephone_repondant', label: 'Téléphone du répondant', type: 'tel', required: true },
  { key: 'latitude', label: 'Latitude', type: 'latitude' },
  { key: 'longitude', label: 'Longitude', type: 'longitude' },
  { key: 'email', label: 'Adresse email', type: 'email', required: true },
  { key: 'site_web', label: 'Site web', type: 'url' },
  { 
    key: 'langues_parlees',
    label: 'Langues parlées',
    type: 'checkbox',
    options: ['Français', 'Anglais', 'Espagnol', 'Autres']
  },
  { 
    key: 'jours_ouverture',
    label: 'Jours d\'ouverture',
    type: 'checkbox',
    options: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']
  },
  { key: 'heures_ouverture', label: 'Heure d\'ouverture', type: 'time', required: true },
  { 
    key: 'gratuit',
    label: 'Type de prise en charge',
    type: 'radio',
    options: ['Gratuit', 'Payant partiellement', 'Payant totalement'],
    required: true
  },
];
// Données spécifiques selon la catégorie
export const specificQuestions = {
    'Soins médicaux': [
    { key: 'protocole_viol', label: 'Disposez-vous d\'un protocole de prise en charge médicale des cas de viol ?' , type:'radioBol' },
    { key: 'infirmiers', label: 'Nombre d\'infirmiers ', type:'homme_femme' },
    { key: 'matrones', label: 'Nombre de matrones ', type:'homme_femme' },
    { key: 'sagefemmes', label: 'Nombre de sages-femmes ', type:'homme_femme' },
    { key: 'medecins', label: 'Nombre de médecins ', type:'homme_femme' },
    { key: 'gyn', label: 'Nombre de gynécologues', type:'homme_femme' },
    { key: 'autres_agents', label: 'Autres agents de santé (préciser)' },
  
    // Infrastructures disponibles
    { key: 'salle_privee', label: 'Salle privée avec rideau et accès toilette disponible ?', type:'radioBol' },
    { key: 'table_examen', label: 'Table d\'examen disponible ?',type:'radioBol' },
    { key: 'eclairage_fixe', label: 'Éclairage fixe disponible ?',type:'radioBol' },
    { key: 'autoclave', label: 'Autoclave disponible ?',type:'radioBol' },
    { key: 'aucun_meuble', label: 'Aucun meuble disponible ?',type:'radioBol' },
  
    // Médicaments disponibles
    { key: 'kit_ist', label: 'Kit IST disponible ?',type:'radioBol' },
    { key: 'pep_vih', label: 'PEP VIH disponible ?',type:'radioBol' },
    { key: 'contraceptifs_urgence', label: 'Contraceptifs d\'urgence disponibles ?',type:'radioBol' },
    { key: 'anatoxine', label: 'Anatoxine tétanique / Immunoglobuline disponible ?',type:'radioBol' },
    { key: 'vaccin_hepatiteb', label: 'Vaccin hépatite B disponible ?',type:'radioBol' },
    { key: 'antalgiques', label: 'Antalgiques disponibles ?',type:'radioBol' },
    { key: 'anesthesiques', label: 'Anesthésiques locaux disponibles ?',type:'radioBol' },
    { key: 'antibiotiques', label: 'Antibiotiques / Antiseptiques disponibles ?',type:'radioBol' },
  
    // Matériel disponible
    { key: 'speculums', label: 'Spéculums disponibles ?',type:'radioBol' },
    { key: 'rubans', label: 'Rubans à mesurer disponibles ?',type:'radioBol' },
    { key: 'seringues', label: 'Seringues / Aiguilles papillon disponibles ?',type:'radioBol' },
    { key: 'kit_suture', label: 'Kit de suture disponible ?',type:'radioBol' },
    { key: 'couvertures', label: 'Couvertures / Draps disponibles ?',type:'radioBol' },
    { key: 'fournitures_sanitaires', label: 'Fournitures sanitaires disponibles ?',type:'radioBol' },
    { key: 'fournitures_protection', label: 'Fournitures de protection disponibles ?',type:'radioBol' },
  
    // Fournitures administratives
    { key: 'fiche_examen', label: 'Fiche d\'examen avec pictogrammes disponible ?',type:'radioBol' },
    { key: 'fiche_suivi', label: 'Fiche de suivi médical disponible ?',type:'radioBol' },
    { key: 'fiche_consentement', label: 'Fiche de consentement disponible ?',type:'radioBol' },
    { key: 'fiche_referencement', label: 'Fiche de référencement disponible ?',type:'radioBol' },
    { key: 'classement_securise', label: 'Espace de classement sécurisé / Ordinateur protégé ?',type:'radioBol' },
  
    // Services SRMNE
    { key: 'planning_familial', label: 'Planification familiale disponible ?',type:'radioBol' },
    { key: 'soins_prenataux', label: 'Soins prénataux disponibles ?',type:'radioBol' },
    { key: 'accouchement', label: 'Accouchement avec partogramme disponible ?',type:'radioBol' },
    { key: 'soins_postpartum', label: 'Soins post-partum disponibles ?',type:'radioBol' },
    { key: 'suivi_croissance', label: 'Suivi croissance nourrissons disponible ?',type:'radioBol' },
    { key: 'vaccination', label: 'Vaccination disponible ?',type:'radioBol' },
    { key: 'pcime', label: 'PCIME disponible ?',type:'radioBol' },
    { key: 'depistage_cancer', label: 'Dépistage cancer col utérus disponible ?',type:'radioBol' },
    { key: 'sante_adolescents', label: 'Santé des adolescents disponible ?',type:'radioBol' },
    { key: 'autres_services_srmne', label: 'Autres services SRMNE (préciser)',type:'radioBol' },
  
    // Capacités
    { key: 'salle_lits_travail', label: 'Salle et lits de travail disponibles ?',type:'radioBol' },
    { key: 'salle_accouchement', label: 'Salle d\'accouchement disponible ?',type:'radioBol' },
    { key: 'salle_lits_postpartum', label: 'Salle et lits de post-partum disponibles ?',type:'radioBol' },
    { key: 'equipement_accouchement', label: 'Équipement minimum pour accouchements disponible ?',type:'radioBol' },
    { key: 'laboratoire', label: 'Laboratoire avec examens standards disponible ?',type:'radioBol' },
    { key: 'bloc_operatoire', label: 'Bloc opératoire fonctionnel ?',type:'radioBol' },
    { key: 'autres_equipements', label: 'Autres équipements (préciser)' },
  
    // Formations
    { key: 'formation_viol', label: 'Formation sur la gestion clinique du viol ?',type:'radioBol' },
    { key: 'formation_conjugale', label: 'Formation sur la prise en charge des violences conjugales ?',type:'radioBol' },
    { key: 'formation_enfants', label: 'Formation sur la prise en charge des enfants survivants ?',type:'radioBol' },
    { key: 'principes_directeurs', label: 'Formation sur les principes directeurs ?',type:'radioBol' },
    { key: 'cadre_normatif', label: 'Formation sur le cadre normatif ?',type:'radioBol' },
    { key: 'formation_eas', label: 'Formation sur la prévention EAS/HS ?',type:'radioBol' },
    { key: 'autres_formations', label: 'Autres formations (préciser)' },
  
    // Kit médico-légal
    { key: 'kit_preuve_medico', label: 'Existe-t-il un kit de collecte des preuves médico-légales ?',type:'radioBol' },
  
    // Difficultés
    { key: 'difficultes_service', label: 'Quelles sont les principales difficultés rencontrées dans ce service ?',type:'radioBol' }
  ],
    'Appui psychosocial': [
    // Types de soutien
    { key: 'soutien_psy_base', label: 'Apportez-vous un soutien émotionnel de base / premiers secours psychologique ?',type:'radioBol' },
    { key: 'appui_individuel', label: 'Apportez-vous un appui psychosocial individuel ?',type:'radioBol' },
    { key: 'appui_groupe', label: 'Apportez-vous un appui psychosocial de groupe ?',type:'radioBol' },
  
    // Types d\'activités
    { key: 'gestion_enfants', label: 'Gestion des cas de violences pour les survivants enfants ?',type:'radioBol' },
    { key: 'gestion_adultes', label: 'Gestion des cas de VBG/EAS pour les survivants adultes ?' ,type:'radioBol' },
  
    // Appui matériel et financier
    { key: 'kits_dignite', label: 'Kits de dignité disponibles ?' ,type:'radioBol' },
    { key: 'aide_financiere', label: 'Assistance financière ponctuelle pour besoins immédiats ?' ,type:'radioBol' },
    { key: 'autres_appuis', label: 'Autres appuis pour la gestion de cas ? (si oui, précisez)' },
  
    // Coût
    { key: 'service_gratuit', label: 'Le service est-il gratuit ?' ,type:'radioBol' },
    { key: 'cout_service', label: 'Coût estimatif du service (en FCFA)', type:"number"},
  
    // Personnel impliqué
    { key: 'gest_enfant', label: 'Gestionnaires des cas de violences envers enfants ', type:'homme_femme' },
    { key: 'gest_vbg', label: 'Gestionnaires des cas de VBG/EAS ', type:'homme_femme' },
    { key: 'superviseurs', label: 'Superviseurs de gestion des cas de VBG ', type:'homme_femme' },
    { key: 'aps', label: 'Agents psychosociaux ', type:'homme_femme' },
    { key: 'autres_pers', label: 'Autres personnes travaillant dans le service ', type:'homme_femme' },
  
    // Formation du personnel
    { key: 'form_gest_enfant', label: 'Agents formés en gestion des cas de violences envers enfants ', type:'homme_femme' },
    { key: 'form_gest_vbg', label: 'Agents formés en gestion des cas de VBG/EAS ', type:'homme_femme' },
    { key: 'form_eas', label: 'Agents formés à la prévention des EAS ', type:'homme_femme' },
    { key: 'form_psychosocial', label: 'Agents formés à l\'accompagnement psychosocial des survivantes de VBG ', type:'homme_femme' },
  
    // Infrastructures et outils
    { key: 'salle_ecoute', label: 'Salle d\'écoute confidentielle et confortable disponible ?' ,type:'radioBol' },
    { key: 'espace_enfants', label: 'Espace sûr adapté pour les enfants disponible ?' ,type:'radioBol' },
    { key: 'outils_gestion_cas', label: 'Outils de gestion de cas existants (admission, consentement, plan, etc.) ?' ,type:'radioBol' },
    { key: 'securite_dossiers', label: 'Équipements pour la sécurité des dossiers (armoires, codes, clés...) ?' ,type:'radioBol' },
    { key: 'bien_etre_staff', label: 'Activités de bien-être pour le staff de gestion de cas ?' ,type:'radioBol' },
    { key: 'protocole_gestion', label: 'Protocole de prise en charge psychosociale et de gestion de cas disponible ?' ,type:'radioBol' },
    { key: 'referencement', label: 'Circuit de référencement vers d\'autres services ?' ,type:'radioBol' },
    { key: 'mecanisme_eas', label: 'Mécanisme de réponse aux cas d\'EAS / harcèlement sexuel ?' ,type:'radioBol' },
    { key: 'autres_infrastructures', label: 'Autres infrastructures pour la gestion des cas de VBG (préciser)' },
  
    // Difficultés
    { key: 'difficultes_service', label: 'Quelles sont les difficultés rencontrées dans ce service ?' }
  ],
    'Police / Sécurité': [
        {
            key: 'medicaments_disponibles',
            label: 'Médicaments disponibles',
            type: 'checkbox',
            options: [
              { label: 'Kit IST', value: 'kit_ist' },
              { label: 'PEP VIH', value: 'pep_vih' },
              { label: 'Contraceptifs d\'urgence', value: 'contraceptifs_urgence' },
              { label: 'Anatoxine tétanique', value: 'anatoxine' },
              { label: 'Vaccin hépatite B', value: 'vaccin_hepatiteb' },
              { label: 'Antalgiques', value: 'antalgiques' },
              { label: 'Anesthésiques locaux', value: 'anesthesiques' },
              { label: 'Antibiotiques / Antiseptiques', value: 'antibiotiques' }
            ]
          },
    // Type d\'appui
    { key: 'reception_plainte', label: 'Réception et traitement des plaintes, y compris pour les VBG ?', type:'radioBol' },
    { key: 'enquete_arrestation', label: 'Enquête sur et arrestation des bourreaux ?', type:'radioBol' },
    { key: 'autres_appuis', label: 'Autres types d\'appui (préciser)'},
  
    // Infrastructures, outils, politiques
    { key: 'salle_confidentielle', label: 'Salle/pratique d\'écoute confidentielle des cas de VBG disponible ?' ,type:'radioBol'},
    { key: 'classement_securise', label: 'Espace de classement sécurisé et verrouillé pour garder les dossiers ?' ,type:'radioBol' },
    { key: 'ordinateur_protege', label: 'Ordinateur protégé par mot de passe disponible ?' ,type:'radioBol' },
    { key: 'fournitures_admin', label: 'Fournitures administratives disponibles ? (imprimante, papier, etc.)' ,type:'radioBol' },
    { key: 'autres_infrastructures', label: 'Autres infrastructures ou équipements (préciser)' },
  
    // Effectifs
    { key: 'effectif', label: 'Nombre total d\'agents dans l\'unité', type:'homme_femme' },
    { key: 'opj', label: 'Nombre d\'OPJ Hommes', type:'homme_femme' },
  
    // Formations du personnel
    { key: 'form_enfants', label: 'Personnel formé sur les violences envers les enfants et la gestion judiciaire des cas' },
    { key: 'form_vbg', label: 'Personnel formé sur les VBG / EAS et la gestion judiciaire des cas ', type:'homme_femme' },
  
    // Coût
    { key: 'service_gratuit', label: 'Le service est-il gratuit ?' ,type:'radioBol' },
    { key: 'items_payants', label: 'Quels sont les items payants pour les bénéficiaires ?' },
  
    // Difficultés
    { key: 'difficultes_service', label: 'Quelles sont les difficultés rencontrées dans ce service ?' }
  ],
    'Assistance juridique': [
    // Types d\'appui
    { key: 'conseils_juridiques', label: 'Conseils juridiques disponibles ?' ,type:'radioBol' },
    { key: 'assistance_juridique', label: 'Assistance pour les services juridiques disponible ?' ,type:'radioBol' },
    { key: 'representation_legale', label: 'Représentation légale disponible ?' ,type:'radioBol' },
    { key: 'referencement_legale', label: 'Référencement pour la représentation légale disponible ?' },
    { key: 'autres_appuis', label: 'Autres types d\'appui (préciser)' },
  
    // Infrastructures, outils et politiques
    { key: 'formulaire_consentement', label: 'Utilisation d\'un formulaire de consentement ?' ,type:'radioBol' },
    { key: 'espace_confidentiel', label: 'Espace sûr et confidentiel pour l\'écoute et l\'assistance juridique ?' ,type:'radioBol' },
    { key: 'classement_securise', label: 'Espace de classement sécurisé / Ordinateur protégé ?' ,type:'radioBol' },
    { key: 'fournitures_admin', label: 'Présence de fournitures administratives (imprimante, papier, etc.) ?' ,type:'radioBol' },
    { key: 'mecanisme_eas', label: 'Mécanisme de réponse aux cas d\'EAS / harcèlement sexuel ?' ,type:'radioBol' },
    { key: 'protocole_juridique', label: 'Protocole de prise en charge des besoins juridiques des cas de VBG ?' ,type:'radioBol' },
  
    // Ressources humaines
    { key: 'juristes', label: 'Nombre de juristes / avocats ', type:'homme_femme' },
    { key: 'para_juristes', label: 'Nombre de conseillers juridiques / para-juristes ', type:'homme_femme' },
    { key: 'form_enfants', label: 'Personnes formées sur les violences envers les enfants ', type:'homme_femme' },
    { key: 'form_vbg', label: 'Personnes formées sur la prévention des EAS / VBG et leur référencement', type:'homme_femme' },
  
    // Collaboration
    { key: 'collab_police', label: 'Collaborez-vous avec les unités de police/gendarmerie ?' ,type:'radioBol' },
    { key: 'nb_policiers_collab', label: 'Nombre d\'agents de police/gendarmerie avec lesquels vous collaborez' ,type:'radioBol' },
    { key: 'collab_tribunaux', label: 'Collaborez-vous avec les juridictions dans votre zone d\'intervention ?' ,type:'radioBol' },
  
    // Coût
    { key: 'service_gratuit', label: 'Le service est-il gratuit ?' ,type:'radioBol' },
    { key: 'items_payants', label: 'Quels sont les items payants par le bénéficiaire ?' },
  
    // Difficultés
    { key: 'difficultes_service', label: 'Quelles sont les principales difficultés rencontrées dans ce service ?' }
  ],
    'Hébergement': [
    // Type d\'appui disponible
    { key: 'hebergement_sur', label: 'Accès à un hébergement sûr (maison d\'hébergement) ?' ,type:'radioBol' },
    { key: 'aide_especes', label: 'Aide en espèces pour l\'hébergement en lieu sûr ?' ,type:'radioBol' },
    { key: 'refuge_communautaire', label: 'Mécanisme communautaire de refuge (ex : famille d\'accueil) ?' ,type:'radioBol' },
    { key: 'prise_charge_alimentaire', label: 'Prise en charge alimentaire disponible ?' ,type:'radioBol' },
    { key: 'appui_non_vivres', label: 'Appui en articles non-vivres (habits, kits de dignité, etc.) ?' ,type:'radioBol' },
    { key: 'autres_appuis', label: 'Autres types d\'appui (préciser)' },
    { key: 'appuis_additionnels', label: 'Apportez-vous d\'autres types d\'appui ? (Oui / Non)' ,type:'radioBol' },
    { key: 'details_appui', label: 'Si oui, précisez les autres appuis apportés' },
  
    // Personnel disponible
    { key: 'pers_civil', label: 'Personnel civil (agent PS, infirmiers, etc.)', type:'homme_femme' },
    { key: 'leaders_religieux', label: 'Leaders religieux / autorités locales ', type:'homme_femme' },
    { key: 'membres_obc', label: 'Membres d\'organisations à base communautaire ', type:'homme_femme' },
    { key: 'agents_securite', label: 'Agents de sécurité ', type:'homme_femme' },
    { key: 'volontaires', label: 'Volontaires communautaires ', type:'homme_femme' },
    { key: 'pers_juridique', label: 'Personnel offrant l\'assistance juridique ', type:'homme_femme' },
    { key: 'pers_forme_protection', label: 'Personnel formé sur la protection de l\'enfant et prévention EAS/VBG ', type:'homme_femme' },
  
    // Mécanismes de protection
    { key: 'mecanisme_protection', label: 'Avez-vous un mécanisme de protection de l\'enfance et de prévention des EAS/VBG ? (Oui / Non)' ,type:'radioBol' },
    { key: 'code_conduite', label: 'Code de bonne conduite disponible ?' ,type:'radioBol' },
    { key: 'point_focal', label: 'Point focal désigné ?' ,type:'radioBol' },
    { key: 'autres_mecanismes', label: 'Autres mécanismes (préciser)' },
  
    // Jours et horaires de service
    { key: 'jours_ouverture', label: 'Jours d\'ouverture ', type: 'checkbox',
      options: [
        { label: 'Lundi', value: 'Lundi' },
        { label: 'Mardi', value: 'mardi' },
        { label: 'Mercredi ', value: 'mercredi' },
        { label: 'Jeudi', value: 'jeudi' },
        { label: 'Vendredi', value: 'vendredi' },
        { label: 'Samedi', value: 'samedi' },
        { label: 'Dimanche', value: 'dimanche' },
      ]
    },
    { key: 'horaire_ouverture', label: 'Horaire d\'ouverture (hh:mm)' , type:"time"},
    { key: 'horaire_fermeture', label: 'Horaire de fermeture (hh:mm)', type:"time" },
  
    // Coût du service
    { key: 'service_gratuit', label: 'Le service est-il gratuit ? (Oui / Non)', type:"radio" },
    { key: 'items_payants', label: 'Quels sont les éléments payants pour les bénéficiaires ?' },
  
    // Difficultés
    { key: 'difficultes_service', label: 'Quelles sont les difficultés rencontrées dans ce service ?' }
  ],
    'Santé mentale': [
    // Types d'appui
    { key: 'appui_pharma', label: 'Accompagnement pharmacologique (Disponibilité de médicaments psychotropes) ?' ,type:'radioBol' },
    { key: 'appui_psy', label: 'Accompagnement psychologique (PM+, Gestion du stress, psychothérapie de soutien) ?' ,type:'radioBol' },
    { key: 'appui_social', label: 'Accompagnement social (aide à la restauration de la dignité de la personne) ?' ,type:'radioBol' },
    { key: 'autres_appuis', label: 'Autres types d\'appui (préciser)' },
  
    // Nombre de personnel
    { key: 'nb', label: 'Nombre total de personnel ', type:'homme_femme' },
  
    // Spécialisation du personnel
    { key: 'psychiatres', label: 'Psychiatres', type:'homme_femme' },
    { key: 'psychologues', label: 'Psychologues cliniciens', type:'homme_femme' },
    { key: 'infirmiers_psy', label: 'Infirmiers en santé mentale', type:'homme_femme' },
    { key: 'sociologues', label: 'Sociologues', type:'homme_femme' },
    { key: 'anthropologues', label: 'Anthropologues', type:'homme_femme' },
    { key: 'medecins_psy', label: 'Médecins formés en santé mentale', type:'homme_femme' },
    { key: 'aps', label: 'Agents psychosociaux ', type:'homme_femme' },
    { key: 'autres_personnel', label: 'Autres personnels offrant des soins en santé mentale', type:'homme_femme' },
  
    // Infrastructures et outils disponibles
    { key: 'salle_ecoute_confidentielle', label: 'Salle d\'écoute et de gestion de cas confidentielle disponible ?' ,type:'radioBol' },
    { key: 'espace_enfants', label: 'Présence d\'espaces sûrs adaptés pour les enfants ?' ,type:'radioBol' },
    { key: 'securite_dossiers', label: 'Équipements pour la sécurité des dossiers (codes, armoires, clés, etc.) ?' ,type:'radioBol' },
    { key: 'protocole_prise_en_charge', label: 'Protocole de prise en charge des besoins en santé mentale disponible ?' ,type:'radioBol' },
    { key: 'autres_equipements', label: 'Autres équipements ou infrastructures (préciser)' },
  
    // Formations du personnel
    { key: 'form_enfants', label: 'Personnel de santé mentale formé sur les violences envers les enfants ', type:'homme_femme' },
    { key: 'form_vbg', label: 'Personnel de santé mentale formé sur les VBG / EAS', type:'homme_femme' },
    { key: 'form_mhgap', label: 'Personnel médical formé sur le programme MhGAP', type:'homme_femme' },
    { key: 'form_psp', label: 'Personnel formé au premier secours psychologique', type:'homme_femme' },
    { key: 'form_gestion_cas', label: 'Personnel formé à la gestion de cas ', type:'homme_femme' },
    { key: 'form_eas', label: 'Personnel formé à la prévention des EAS / harcèlement sexuel', type:'homme_femme' },
  
    // Difficultés
    { key: 'difficultes_service', label: 'Quelles sont les difficultés rencontrées dans ce service ?' }
  ],
   'Réinsertion économique': [
    // Types d\'appui disponibles
    { key: 'formation_metier', label: 'Offre de formation professionnelle sur des métiers ?' ,type:'radioBol' },
    { key: 'aide_especes', label: 'Aide en espèces pour appuyer une activité génératrice de revenu ?' ,type:'radioBol' },
    { key: 'avec', label: 'Association Villageoise d\'Épargne et de Crédit (AVEC) mise en place ?' ,type:'radioBol' },
    { key: 'referencement_travail', label: 'Référencement / placement vers des opportunités de travail ou formation ?' ,type:'radioBol' },
    { key: 'alphabetisation', label: 'Formation en alphabétisation disponible ?' ,type:'radioBol' },
    { key: 'autres_appuis', label: 'Autres types d\'appui (préciser)' },
  
    // Ressources humaines disponibles
    { key: 'agents_formation', label: 'Agents des services de formation professionnelle ', type:'homme_femme' },
    { key: 'aps', label: 'Agents psychosociaux', type:'homme_femme' },
    { key: 'agents_services_financiers', label: 'Agents des services financiers', type:'homme_femme' },
    { key: 'volontaires', label: 'Volontaires communautaires ', type:'homme_femme' },
    { key: 'agents_autonomisation', label: 'Agents en autonomisation économique/sociale & entrepreneuriat', type:'homme_femme' },
    { key: 'agronomes', label: 'Agronomes / Vétérinaires ', type:'homme_femme' },
    { key: 'formes_enfants', label: 'Personnes formées sur les violences envers les enfants' , type:'homme_femme'},
    { key: 'formes_vbg', label: 'Personnes formées sur les VBG / EAS ', type:'homme_femme' },
    { key: 'formes_formation', label: 'Personnes formées comme agents des services de formation professionnelle', type:'homme_femme' },
      { key: 'formes_entreprenariat', label: 'Personnes formées sur l\'entrepreneuriat ', type:'homme_femme' },
    { key: 'formes_compta', label: 'Personnes formées en comptabilité de base (Hommes)', type:'homme_femme' },
  
    // Mécanismes EAS/HS
    { key: 'mecanisme_eas', label: 'Existe-t-il un mécanisme de réponse aux cas d\'EAS / harcèlement sexuel ? (Oui / Non)' , type:"radio" },
  
    // Coût
    { key: 'service_gratuit', label: 'Le service est-il gratuit ? (Oui / Non)', type:"radio" },
    { key: 'items_payants', label: 'Si non, précisez les éléments payants pour les bénéficiaires' },
  
    // Difficultés
    { key: 'difficultes_service', label: 'Quelles sont les principales difficultés rencontrées dans ce service ?' }
  ]
  }