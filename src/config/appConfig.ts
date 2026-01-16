// Configuration de l'application
export const AppConfig = {
  // Mode d'exécution
  isLocalMode: false, // Désactivé pour utiliser Supabase

  // Paramètres pour le mode local
  local: {
    enableMockData: false,
    mockDelay: 300, // Délai de simulation en ms
  },

  // Paramètres pour le mode serveur
  server: {
    enableRealData: true,
    apiEndpoint: import.meta.env.VITE_API_ENDPOINT || 'http://localhost:3000/api',
  }
};