import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, AuthState, UserRole } from '../types';
import { users } from '../data/mockData';

interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// Créer le contexte avec une valeur par défaut
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  login: async () => false,
  logout: () => { /* Implémentation vide mais nécessaire */ }
});

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useHasRole = (roles: UserRole[]): boolean => {
  const { user } = useAuth();
  if (!user) return false;
  return roles.includes(user.role);
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    // Vérifier si l'utilisateur est stocké dans localStorage (connexion persistante)
    const storedUser = localStorage.getItem('currentUser');

    if (storedUser) {
      try {
        const user = JSON.parse(storedUser) as User;
        setState({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        // Utilisateur stocké invalide, le supprimer
        localStorage.removeItem('currentUser');
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      }
    } else {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Pour la démo, on vérifie juste si le nom d'utilisateur existe et on ignore le mot de passe
      // Dans une application réelle, vous valideriez les identifiants avec une API backend
      const user = users.find(u => u.username === username);

      if (user) {
        // Stocker l'utilisateur dans localStorage pour la connexion persistante
        localStorage.setItem('currentUser', JSON.stringify(user));

        setState({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });

        return true;
      } else {
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: 'Identifiants incorrects. Veuillez réessayer.',
        });

        return false;
      }
    } catch (error) {
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: "Une erreur s'est produite lors de la connexion. Veuillez réessayer.",
      });

      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('currentUser');

    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  };

  const contextValue: AuthContextType = {
    ...state,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
