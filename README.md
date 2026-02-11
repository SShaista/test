# Student Portal - Version Multi-Pages

Application web pour étudiants en école d'ingénieurs, avec **4 pages HTML séparées**.

## 📁 Structure des fichiers

```
student-portal-multi/
├── index.html          ← Emploi du temps (page d'accueil)
├── cours.html          ← Mes cours (UE/ECUE)
├── examens.html        ← Examens & Tâches
├── parametres.html     ← Paramètres
├── style.css           ← Styles CSS communs
├── edt.js              ← JavaScript pour l'emploi du temps
├── cours.js            ← JavaScript pour les cours
├── examens.js          ← JavaScript pour examens & tâches
├── parametres.js       ← JavaScript pour les paramètres
└── README.md           ← Ce fichier
```

## 🚀 Comment utiliser

### Option 1 : Ouvrir directement
1. Double-cliquez sur `index.html`
2. Naviguez entre les pages avec la barre du bas

### Option 2 : Avec un serveur local
```bash
# Python 3
python -m http.server 8000

# Puis ouvrez http://localhost:8000
```

### Option 3 : Sur GitHub Pages
1. Uploadez tous les fichiers sur GitHub
2. Activez GitHub Pages dans Settings → Pages
3. Votre site sera en ligne !

## ✨ Fonctionnalités

### 📅 Emploi du temps (index.html)
- Navigation par semaine (précédente/suivante)
- Sélection du jour
- Affichage des cours avec couleurs
- Badge "En cours" pour le cours actif
- Résumé : événements, heures, jours
- **Support fichier iCal** (edt.ics)

### 📚 Cours (cours.html)
- Filtre par semestre (1, 2, 3)
- Affichage par UE avec ECUE
- Compteurs : ECUE, UE, ECTS

### 📝 Examens & Tâches (examens.html)
- Liste des examens avec compte à rebours
- To-do list interactive
  - Ajouter une tâche
  - Marquer comme complétée
  - Supprimer une tâche
- Pourcentage de progression

### ⚙️ Paramètres (parametres.html)
- Profil étudiant
- Préférences (notifications, mode sombre)
- Paramètres du compte
- Déconnexion

## 🎨 Personnalisation

### Modifier les données

**Cours** : Éditez `cours.js`, variable `ueData`

**Examens** : Éditez `examens.js`, variable `examsData`

**Tâches** : Éditez `examens.js`, variable `tasksData`

### Fichier iCal (edt.ics)
Pour charger un emploi du temps automatiquement :
1. Exportez votre EDT au format `.ics`
2. Nommez-le `edt.ics`
3. Placez-le dans le même dossier que `index.html`

## 🌐 Navigateurs supportés

- Chrome / Edge
- Firefox
- Safari
- Opera

## 📱 Responsive

Optimisé pour :
- Mobile (smartphones)
- Tablettes
- Desktop

## 📄 Licence

Projet libre pour usage éducatif.
