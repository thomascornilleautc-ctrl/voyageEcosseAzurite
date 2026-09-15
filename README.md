# Site Azurite — voyage en famille vers l'Écosse (2027)

Site statique, 5 pages, en français uniquement pour l'instant.

## Structure

```
azurite-site/
├── index.html      → Accueil
├── bateau.html      → Le bateau
├── equipage.html     → L'équipage
├── trajet.html      → Le trajet
├── sponsors.html    → Sponsors
├── assets/
│   ├── style.css    → tous les styles du site
│   ├── script.js    → menu mobile (seul script du site)
│   └── img/       → photos et illustrations
└── README.md
```

Pas de générateur de site, pas de build : ce sont des fichiers HTML/CSS/JS bruts, prêts à être déposés tels quels.

## Déployer sur GitHub Pages

1. Créer un nouveau dépôt GitHub (ex. `azurite-voyage`)
2. Déposer tout le contenu de ce dossier à la racine du dépôt
3. Aller dans **Settings → Pages**, choisir la branche `main` et le dossier `/ (root)`
4. Le site sera en ligne à une adresse du type `https://tonpseudo.github.io/azurite-voyage/`

## Ce qui reste à faire (pas bloquant pour publier)

- **Morgane** : portrait à écrire dans `equipage.html` (emplacement déjà prévu, marqué "à compléter")
- **Fiche technique du bateau** : vérifier largeur, tirant d'eau exact et déplacement dans les papiers du bord (`bateau.html`)
- **E-mail de contact** : remplacer `contact@azurite-voyage.fr` dans `sponsors.html` par la vraie adresse
- **Logos sponsors** : remplacer les emplacements réservés dans `sponsors.html` au fur et à mesure des partenariats
- **Anglais (EN)** : le sélecteur de langue dans l'en-tête est déjà en place mais désactivé ("EN" grisé) — à activer une fois les pages traduites
- **Carte du trajet** : `trajet.html` embarque désormais une carte interactive (Leaflet, tuiles CARTO). Les points de l'itinéraire vivent dans un seul fichier, `assets/route-data.js` — modifier les coordonnées ou ajouter une étape se fait uniquement là, la carte et la liste se mettent à jour automatiquement. Les coordonnées actuelles sont approximatives (un point représentatif par étape), à affiner si besoin
- **Vidéo** : la vidéo de navigation n'est pas encore intégrée (fichier trop lourd pour un dépôt Git) — mieux vaut l'héberger sur YouTube ou Vimeo en non répertorié, puis intégrer le lien dans `trajet.html` ou `bateau.html`

## Notes techniques

- Typographies chargées depuis Google Fonts (Fraunces + Public Sans) — nécessite une connexion internet, pas de dépendance à installer
- Aucune dépendance JavaScript externe : `script.js` ne gère que le menu mobile
- Respecte `prefers-reduced-motion` (l'animation du trait de route sur la page d'accueil est désactivée si l'utilisateur l'a demandé dans son système)
- Focus visible au clavier sur tous les liens/boutons
