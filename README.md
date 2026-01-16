# CartoK-AI - Plateforme de Vente de Voitures

## Présentation

CartoK-AI est une application moderne de vente et location de voitures avec une interface inspirée de TikTok. L'application permet aux utilisateurs de parcourir des véhicules à travers un flux vertical, avec des informations détaillées et la possibilité de contacter les vendeurs via WhatsApp.

## Technologies utilisées

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Supabase
- React Query
- Lucide React

## Comment éditer ce code ?

Il y a plusieurs façons de modifier l'application.

**Utilisation locale**

Si vous voulez travailler localement avec votre IDE préféré, vous pouvez cloner ce dépôt et pousser les changements. Les changements poussés seront également reflétés dans Lovable.

La seule exigence est d'avoir Node.js & npm installés - [installer avec nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Suivez ces étapes :

```sh
# Étape 1: Cloner le dépôt en utilisant l'URL Git du projet.
git clone <YOUR_GIT_URL>

# Étape 2: Naviguez vers le répertoire du projet.
cd <YOUR_PROJECT_NAME>

# Étape 3: Installez les dépendances nécessaires.
npm i

# Étape 4: Lancez le serveur de développement avec rechargement automatique et aperçu instantané.
npm run dev
```

**Éditer un fichier directement dans GitHub**

- Naviguez vers le(des) fichier(s) souhaité(s).
- Cliquez sur le bouton "Edit" (icône de crayon) en haut à droite de la vue du fichier.
- Faites vos modifications et validez les changements.

**Utiliser GitHub Codespaces**

- Naviguez vers la page principale de votre dépôt.
- Cliquez sur le bouton "Code" (bouton vert) près du coin supérieur droit.
- Sélectionnez l'onglet "Codespaces".
- Cliquez sur "New codespace" pour lancer un nouvel environnement Codespace.
- Modifiez les fichiers directement dans Codespace et validez et poussez vos changements une fois terminé.

## Comment déployer ce projet ?

### Déploiement manuel

Pour déployer ce projet manuellement, suivez ces étapes :

1. Assurez-vous que tous vos changements sont poussés vers le dépôt GitHub
2. Connectez-vous à [Vercel](https://vercel.com/)
3. Cliquez sur "New Project"
4. Importez votre dépôt GitHub
5. Dans les paramètres de déploiement, assurez-vous que :
   - Framework preset: "Other"
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Development Command: `npm run dev`

### Déploiement automatique avec Vercel

Vous pouvez également déployer automatiquement en cliquant sur le bouton ci-dessous :

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/cartok-ai)

### Variables d'environnement requises

Pour que l'application fonctionne correctement, vous aurez besoin de définir les variables d'environnement suivantes dans votre plateforme de déploiement :

- `VITE_SUPABASE_URL` - L'URL de votre projet Supabase
- `VITE_SUPABASE_ANON_KEY` - La clé publique anonyme de votre projet Supabase
- `VITE_SUPABASE_PROJECT_ID` - L'ID de votre projet Supabase

Ces variables sont déjà configurées dans le fichier `.env` du projet.

## Tester l'application en temps réel

Une fois déployée, l'application sera accessible via une URL unique générée par la plateforme de déploiement. Vous pourrez alors tester toutes les fonctionnalités en temps réel :

- Parcourir le flux de voitures
- Voir les détails des véhicules
- Contacter les vendeurs via WhatsApp
- Basculer entre les modes vente et location
- Accéder à la section d'exploration

## Peut-on connecter un domaine personnalisé à ce projet ?

Oui, c'est possible !

Pour connecter un domaine, rendez-vous sur votre plateforme de déploiement (Vercel, Netlify, etc.) et suivez les instructions pour connecter un domaine personnalisé.

## Fonctionnalités

- Interface verticale inspirée de TikTok pour parcourir les véhicules
- Filtres pour vente et location
- Système de notation Elyndra pour les véhicules
- Contact direct avec les vendeurs via WhatsApp
- Profils des vendeurs (actuellement tous sous la marque CartoK)
- Système d'administration (protégé)
