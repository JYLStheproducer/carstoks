import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Smartphone, 
  Palette, 
  Zap, 
  Star, 
  MessageCircle, 
  Navigation,
  LayoutGrid,
  ShoppingCart,
  MapPin,
  Search,
  Heart,
  Share2,
  Filter,
  TrendingUp,
  BarChart3,
  Users,
  Car
} from 'lucide-react';

const UIDesignSuggestions = () => {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-white mb-2">Suggestions d'amélioration UI/UX</h1>
        <p className="text-muted-foreground">
          Recommandations pour optimiser l'expérience utilisateur de CARSTOK
        </p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="navigation">Navigation</TabsTrigger>
          <TabsTrigger value="visual">Design visuel</TabsTrigger>
          <TabsTrigger value="features">Fonctionnalités</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Vue d'ensemble des améliorations
              </CardTitle>
              <CardDescription>
                Résumé des principales recommandations pour améliorer l'interface et l'expérience utilisateur
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="glass-dark p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-4 w-4 text-primary" />
                    <span className="font-medium">Performance</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Optimiser les temps de chargement et améliorer la fluidité des animations
                  </p>
                </div>
                
                <div className="glass-dark p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Smartphone className="h-4 w-4 text-primary" />
                    <span className="font-medium">Responsive</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Améliorer l'adaptabilité sur tous les formats d'écran
                  </p>
                </div>
                
                <div className="glass-dark p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="h-4 w-4 text-primary" />
                    <span className="font-medium">Expérience</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Simplifier les parcours utilisateurs et réduire les étapes
                  </p>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="font-semibold text-white mb-3">Priorités d'amélioration</h3>
                <div className="space-y-3">
                  {[
                    { title: "Amélioration de la recherche", priority: "Haute", desc: "Ajouter des filtres avancés et une recherche intelligente" },
                    { title: "Page détaillée véhicule", priority: "Haute", desc: "Créer une page complète avec galerie photo et caractéristiques" },
                    { title: "Système de notation", priority: "Moyenne", desc: "Permettre aux utilisateurs de noter les vendeurs" },
                    { title: "Notifications", priority: "Moyenne", desc: "Alerter les utilisateurs des nouveaux véhicules correspondants" },
                    { title: "Comparaison de véhicules", priority: "Faible", desc: "Permettre de comparer plusieurs véhicules côte à côte" }
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-card rounded-lg">
                      <Badge variant={item.priority === "Haute" ? "destructive" : item.priority === "Moyenne" ? "default" : "secondary"}>
                        {item.priority}
                      </Badge>
                      <div>
                        <h4 className="font-medium">{item.title}</h4>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="navigation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Navigation className="h-5 w-5" />
                Améliorations de navigation
              </CardTitle>
              <CardDescription>
                Suggestions pour faciliter la navigation et l'accès aux fonctionnalités
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-white mb-3">Navigation principale</h3>
                  <ul className="space-y-2">
                    {[
                      { icon: LayoutGrid, label: "Accueil (vidéos)", desc: "Maintenir le format vidéo mais ajouter des catégories" },
                      { icon: Car, label: "Catalogue", desc: "Vue grille/liste des véhicules avec filtres" },
                      { icon: MapPin, label: "Par localisation", desc: "Trouver des véhicules près de chez soi" },
                      { icon: Heart, label: "Favoris", desc: "Accéder rapidement aux véhicules sauvegardés" },
                      { icon: ShoppingCart, label: "Vendre", desc: "Formulaire d'ajout de véhicule" }
                    ].map((item, index) => (
                      <li key={index} className="flex items-start gap-3 p-2 hover:bg-accent rounded">
                        <item.icon className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <div className="font-medium">{item.label}</div>
                          <div className="text-xs text-muted-foreground">{item.desc}</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-white mb-3">Barre de recherche améliorée</h3>
                  <div className="space-y-4">
                    <div className="glass-dark p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Search className="h-4 w-4 text-primary" />
                        <span className="font-medium">Recherche intelligente</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Suggestions contextuelles basées sur les recherches récentes
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {['Mercedes', '4x4', 'Diesel', 'Sous 5M'].map((tag, i) => (
                          <Badge key={i} variant="secondary">{tag}</Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="glass-dark p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Filter className="h-4 w-4 text-primary" />
                        <span className="font-medium">Filtres avancés</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Par gamme de prix, année, kilométrage, localisation, etc.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="visual" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Design visuel
              </CardTitle>
              <CardDescription>
                Recommandations pour améliorer l'esthétique et la cohérence visuelle
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-white mb-3">Palette de couleurs</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-4 h-4 rounded-full bg-primary"></div>
                        <span className="text-sm">Primaire (Or)</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Utilisée pour les éléments d'action et les éléments importants
                      </p>
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-4 h-4 rounded-full bg-black"></div>
                        <span className="text-sm">Arrière-plan</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Fond sombre pour un contraste optimal avec le contenu
                      </p>
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-4 h-4 rounded-full bg-gray-800"></div>
                        <span className="text-sm">Surfaces</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Éléments de surface avec effet glassmorphism
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-white mb-3">Hiérarchie typographique</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="text-2xl font-bold text-white">Titres principaux</div>
                      <p className="text-xs text-muted-foreground">Utilisés pour les titres de section</p>
                    </div>
                    
                    <div>
                      <div className="text-lg font-semibold text-white">Sous-titres</div>
                      <p className="text-xs text-muted-foreground">Pour les titres de carte ou d'article</p>
                    </div>
                    
                    <div>
                      <div className="text-base font-medium text-white">Texte principal</div>
                      <p className="text-xs text-muted-foreground">Contenu principal des paragraphes</p>
                    </div>
                    
                    <div>
                      <div className="text-sm text-muted-foreground">Texte secondaire</div>
                      <p className="text-xs text-muted-foreground">Détails et informations complémentaires</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="font-semibold text-white mb-3">Composants UI recommandés</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { icon: BarChart3, title: "Graphiques", desc: "Visualiser les tendances du marché" },
                    { icon: Users, title: "Statistiques", desc: "Afficher les métriques clés" },
                    { icon: MessageCircle, title: "Chat", desc: "Communication avec les vendeurs" },
                    { icon: TrendingUp, title: "Tendances", desc: "Véhicules populaires du moment" }
                  ].map((item, index) => (
                    <div key={index} className="glass-dark p-4 rounded-lg text-center">
                      <item.icon className="h-8 w-8 text-primary mx-auto mb-2" />
                      <h4 className="font-medium">{item.title}</h4>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Fonctionnalités supplémentaires
              </CardTitle>
              <CardDescription>
                Suggestions pour enrichir l'application avec des fonctionnalités utiles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-white mb-3">Fonctionnalités principales</h3>
                  <div className="space-y-3">
                    {[
                      { title: "Galerie photo immersive", desc: "Visionneuse d'images avec zoom et navigation fluide" },
                      { title: "Fiche véhicule détaillée", desc: "Page complète avec caractéristiques, historique et évaluations" },
                      { title: "Système de messagerie", desc: "Communication directe avec les vendeurs" },
                      { title: "Alertes personnalisées", desc: "Notifications pour les nouveaux véhicules correspondant aux critères" },
                      { title: "Comparateur de véhicules", desc: "Possibilité de comparer plusieurs modèles côte à côte" }
                    ].map((item, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-card rounded-lg">
                        <div className="mt-0.5">
                          <div className="w-2 h-2 rounded-full bg-primary"></div>
                        </div>
                        <div>
                          <h4 className="font-medium">{item.title}</h4>
                          <p className="text-sm text-muted-foreground">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-white mb-3">Fonctionnalités sociales</h3>
                  <div className="space-y-4">
                    <div className="glass-dark p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Share2 className="h-4 w-4 text-primary" />
                        <span className="font-medium">Partage social</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Permettre aux utilisateurs de partager des véhicules sur les réseaux sociaux
                      </p>
                    </div>
                    
                    <div className="glass-dark p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Heart className="h-4 w-4 text-primary" />
                        <span className="font-medium">Favoris et sauvegardes</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Système de favoris pour retrouver facilement les véhicules intéressants
                      </p>
                    </div>
                    
                    <div className="glass-dark p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <MessageCircle className="h-4 w-4 text-primary" />
                        <span className="font-medium">Commentaires et avis</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Permettre aux utilisateurs de commenter et évaluer les véhicules
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h3 className="font-semibold text-white mb-3">Fonctionnalités techniques</h3>
                    <div className="space-y-2">
                      {[
                        "Reconnaissance d'image pour extraction de caractéristiques",
                        "Estimation de valeur basée sur le marché",
                        "Calculatrice de crédit automobile",
                        "Intégration GPS pour localisation précise"
                      ].map((item, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 hover:bg-accent rounded">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                          <span className="text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="pt-4">
                <h3 className="font-semibold text-white mb-3">Implémentation progressive</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Phase 1: Améliorations critiques</span>
                      <span className="text-sm text-muted-foreground">40%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '40%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Phase 2: Fonctionnalités avancées</span>
                      <span className="text-sm text-muted-foreground">10%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '10%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Phase 3: Fonctionnalités sociales</span>
                      <span className="text-sm text-muted-foreground">0%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '0%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="text-center pt-8">
        <Button className="gradient-gold text-primary-foreground">
          Voir la maquette complète
        </Button>
        <p className="text-sm text-muted-foreground mt-2">
          Ces suggestions peuvent être implémentées progressivement selon les priorités
        </p>
      </div>
    </div>
  );
};

export default UIDesignSuggestions;