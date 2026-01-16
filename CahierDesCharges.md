# Cahier des Charges - Projet Carstok

## 1. Présentation du Projet

### 1.1 Description
Application web mobile de type "feed vertical" (style TikTok) pour la consultation de véhicules en vente et en location. L'utilisateur scroll verticalement pour découvrir les véhicules disponibles.

### 1.2 Objectifs
- Offrir une expérience de navigation fluide et immersive
- Permettre une découverte rapide des véhicules disponibles
- Simplifier la recherche de véhicules
- Proposer deux modes : Vente et Location

---

## 2. Fonctionnalités Principales

### 2.1 Feed Vertical (Swipe TikTok-like)

#### Comportement
- **Scroll vertical** : L'utilisateur scroll vers le haut/bas pour changer de véhicule
- **Affichage plein écran** : Une carte véhicule par vue
- **Transition fluide** : Animation smooth entre les cartes
- **Auto-centrage** : La carte se centre automatiquement après le scroll
- **Infinite scroll** : Chargement automatique de nouvelles cartes

#### Contenu de chaque carte
- Photo principale du véhicule (plein écran)
- Logo GT Carstok (coin supérieur gauche)
- Badge de statut "Anonyme" (coin supérieur droit)
- Informations overlay (bas de l'écran) :
  - Nom du véhicule (ex: Toyota Land Cruiser V8)
  - Localisation (Port-Gentil)
  - Année (2021)
  - Kilométrage (42 000 km)
  - Prix en gras rose (65 000 000 FCFA)
  - Grille de spécifications :
    - Kilométrage
    - Carburant (Diesel/Essence)
    - Transmission (Automatique/Manuelle)

#### Actions sur une carte
- **Tap sur l'image** : Pause du scroll / Afficher plus de photos
- **Swipe gauche/droite** : Navigation entre les photos du véhicule
- **Bouton "Acheter/Louer"** : Contact vendeur ou réservation
- **Double tap** : Ajouter aux favoris (optionnel)

---

### 2.2 Navigation (Footer)

#### Structure du Footer
Navigation fixe en bas de l'écran avec 3 options :

**1. Vente** 📋
- Icône : Panier/Shopping cart
- Couleur active : Rose (#FF0080)
- Fonction : Affiche le feed des véhicules en vente
- État par défaut : Actif

**2. Location** 🚗
- Icône : Voiture/Car
- Couleur active : Rose (#FF0080)
- Fonction : Affiche le feed des véhicules en location
- État par défaut : Inactif

**3. Recherche** 🔍
- Icône : Loupe/Search
- Couleur active : Rose (#FF0080)
- Fonction : Ouvre l'interface de recherche
- État par défaut : Inactif

#### Comportement du Switch
- **Tap sur "Vente"** : 
  - Change le feed pour afficher uniquement les véhicules en vente
  - L'icône devient rose, les autres grises
  - Scroll automatique vers le haut du feed
  
- **Tap sur "Location"** :
  - Change le feed pour afficher uniquement les véhicules en location
  - L'icône devient rose, les autres grises
  - Scroll automatique vers le haut du feed

- **Animation de transition** : Slide horizontal lors du changement de mode

---

### 2.3 Fonctionnalité de Recherche

#### Interface de Recherche

**Déclenchement**
- Tap sur l'icône "Recherche" dans le footer
- Animation : L'interface de recherche slide du bas vers le haut (fullscreen)

**Éléments de l'interface**
```
┌─────────────────────────────┐
│ [X]  Recherche              │
├─────────────────────────────┤
│                             │
│ 🔍 [Barre de recherche]     │
│                             │
├─────────────────────────────┤
│ Filtres rapides :           │
│                             │
│ [Marque ▼] [Prix ▼]        │
│ [Année ▼]  [Km ▼]          │
│                             │
├─────────────────────────────┤
│ Type de transaction :       │
│ ( ) Vente  ( ) Location     │
│                             │
├─────────────────────────────┤
│ Résultats :                 │
│                             │
│ [Mini carte véhicule 1]     │
│ [Mini carte véhicule 2]     │
│ [Mini carte véhicule 3]     │
│                             │
└─────────────────────────────┘
```

#### Champs de recherche

**1. Barre de recherche textuelle**
- Placeholder : "Ex: Toyota Land Cruiser"
- Recherche en temps réel (debounce 300ms)
- Recherche sur : Marque, Modèle, Année

**2. Filtres**
- **Marque** : Dropdown (Toyota, Mercedes, BMW, etc.)
- **Prix** : Range slider (Min - Max)
- **Année** : Range slider (Ex: 2015 - 2024)
- **Kilométrage** : Range slider (0 - 200 000 km)
- **Carburant** : Multi-select (Diesel, Essence, Électrique, Hybride)
- **Transmission** : Radio (Automatique, Manuelle)
- **Localisation** : Dropdown (Port-Gentil, Libreville, etc.)

**3. Type de transaction**
- Radio buttons : Vente / Location / Les deux

#### Affichage des résultats
- Liste verticale de mini-cartes
- Chaque mini-carte affiche :
  - Image thumbnail
  - Nom du véhicule
  - Prix
  - Année et kilométrage
- Tap sur une carte → Retour au feed centré sur ce véhicule

#### Actions
- **Bouton "Appliquer"** : Applique les filtres et retourne au feed
- **Bouton "Réinitialiser"** : Reset tous les filtres
- **Bouton "Fermer" (X)** : Ferme la recherche sans appliquer

---

## 3. Architecture Technique

### 3.1 Structure des Pages

```
/
├── Feed (Page principale)
│   ├── Mode Vente
│   └── Mode Location
│
├── Recherche (Overlay fullscreen)
│
└── Détail véhicule (Optionnel - si tap sur image)
```

### 3.2 Composants React

```
App
│
├── Header (Logo + Badge)
│
├── FeedContainer
│   ├── VehicleCard (répété)
│   │   ├── VehicleImage
│   │   ├── VehicleInfo
│   │   ├── VehicleSpecs
│   │   └── CTAButton
│   │
│   └── InfiniteScrollHandler
│
├── SearchOverlay
│   ├── SearchBar
│   ├── FilterPanel
│   │   ├── BrandFilter
│   │   ├── PriceFilter
│   │   ├── YearFilter
│   │   └── ...
│   │
│   └── SearchResults
│       └── MiniVehicleCard (répété)
│
└── BottomNavigation
    ├── NavItem (Vente)
    ├── NavItem (Location)
    └── NavItem (Recherche)
```

### 3.3 État de l'Application

```javascript
{
  currentMode: 'vente' | 'location',
  currentVehicleIndex: 0,
  vehicles: Vehicle[],
  filteredVehicles: Vehicle[],
  searchActive: false,
  filters: {
    brand: string[],
    priceRange: [min, max],
    yearRange: [min, max],
    mileageRange: [min, max],
    fuel: string[],
    transmission: string,
    location: string,
    transactionType: 'vente' | 'location' | 'both'
  }
}
```

### 3.4 Modèle de Données

```typescript
interface Vehicle {
  id: string;
  images: string[];
  brand: string;
  model: string;
  year: number;
  price: number;
  currency: 'FCFA' | 'EUR' | 'USD';
  location: string;
  mileage: number;
  fuel: 'Diesel' | 'Essence' | 'Électrique' | 'Hybride';
  transmission: 'Automatique' | 'Manuelle';
  transactionType: 'vente' | 'location';
  status: 'Anonyme' | 'Vérifié' | 'Premium';
  seller: {
    id: string;
    name: string;
    phone?: string;
  };
  features?: string[];
  description?: string;
  createdAt: Date;
}
```

---

## 4. Spécifications UX/UI

### 4.1 Animations

**Feed Scroll**
- Type : Vertical snap scroll
- Durée : 300ms
- Easing : cubic-bezier(0.4, 0, 0.2, 1)

**Switch Mode (Vente/Location)**
- Type : Slide horizontal
- Durée : 400ms
- Direction : Vente→Location (gauche→droite), Location→Vente (droite→gauche)

**Recherche Overlay**
- Type : Slide up
- Durée : 350ms
- Backdrop : Blur + fade

**Navigation Icons**
- Type : Scale + Color change
- Durée : 200ms
- Active : Scale(1.2) + Color(pink)

### 4.2 Gestes Tactiles

| Geste | Action |
|-------|--------|
| Scroll vertical | Changer de véhicule |
| Swipe horizontal sur image | Photos suivante/précédente |
| Tap sur navigation | Changer de mode |
| Double tap (optionnel) | Favoris |
| Tap prolongé | Partager |

### 4.3 États de Chargement

**Initial Load**
- Skeleton cards (3 cartes)
- Animation pulse rose

**Infinite Scroll**
- Spinner rose en bas du feed
- Chargement anticipé (1 carte avant la fin)

**Recherche**
- Loader pendant la recherche
- Message "Aucun résultat" si vide

---

## 5. Fonctionnalités Avancées (Phase 2)

### 5.1 Favoris
- Système de likes/favoris
- Page dédiée aux favoris
- Synchronisation cloud

### 5.2 Comparaison
- Sélectionner 2-3 véhicules
- Tableau comparatif
- Export PDF

### 5.3 Notifications
- Nouveau véhicule correspondant aux critères
- Baisse de prix
- Véhicule bientôt disponible

### 5.4 Compte Utilisateur
- Sauvegarde des recherches
- Historique de navigation
- Messages avec vendeurs

### 5.5 Partage Social
- Partager une carte véhicule
- Génération d'image avec QR code
- Deep linking

---

## 6. Contraintes Techniques

### 6.1 Performance
- Temps de chargement initial < 2s
- Scroll à 60 FPS minimum
- Images optimisées (WebP, lazy loading)
- Cache des cartes adjacentes

### 6.2 Compatibilité
- Responsive : Mobile first (320px - 480px)
- Navigateurs : Chrome, Safari, Firefox (2 dernières versions)
- PWA ready (installation possible)

### 6.3 Accessibilité
- Navigation clavier
- Lecteurs d'écran
- Contraste WCAG AA minimum

---

## 7. Métriques de Succès

- Temps moyen par session : > 3 minutes
- Taux de conversion (contact vendeur) : > 5%
- Taux de rebond : < 40%
- Nombre de véhicules vus par session : > 10

---

## 8. Planning de Développement

### Phase 1 - MVP (4 semaines)
- ✅ Feed vertical basique
- ✅ Switch Vente/Location
- ✅ Navigation footer
- ✅ Design system

### Phase 2 - Recherche (2 semaines)
- 🔄 Interface de recherche
- 🔄 Filtres avancés
- 🔄 Résultats en temps réel

### Phase 3 - Optimisation (2 semaines)
- ⏳ Performance
- ⏳ Animations avancées
- ⏳ Tests utilisateurs

### Phase 4 - Fonctionnalités avancées (4 semaines)
- ⏳ Favoris
- ⏳ Compte utilisateur
- ⏳ Notifications

---

## 9. Annexes

### 9.1 Inspirations
- TikTok (feed vertical)
- Tinder (swipe cards)
- Airbnb (filtres de recherche)
- AutoScout24 (marketplace auto)

### 9.2 Stack Technique Recommandée
- **Frontend** : React + TypeScript
- **Styling** : Tailwind CSS
- **Animations** : Framer Motion
- **State** : Zustand ou Redux
- **API** : REST ou GraphQL
- **Hosting** : Vercel / Netlify

---

**Document créé le** : 16/01/2026  
**Version** : 1.0  
**Contact** : GT CarStok Team refactorise le site

---

# Référentiel pour la création du véritable Carstok

Ce cahier des charges sert de référence pour la création du projet Carstok selon les spécifications exactes du cahier des charges GT CarStok. Il détaille toutes les fonctionnalités, l'architecture technique, les spécifications UX/UI, les contraintes techniques et les fonctionnalités avancées à implémenter. Ce document doit être utilisé comme guide principal pour le développement du projet Carstok, en s'assurant que chaque fonctionnalité est implémentée selon les spécifications détaillées ci-dessus.