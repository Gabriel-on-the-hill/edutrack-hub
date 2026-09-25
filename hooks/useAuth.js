// hooks/useAuth.js
// Client-side authentication hook

import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { useRouter } from 'next/router';

// Auth context
const AuthContext = createContext(null);

// Auth provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is authenticated
  const checkAuth = useCallback(async () => {
    // Only run on client side
    if (typeof window === 'undefined') {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/auth/me', {
        credentials: 'include',
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error('Auth check failed:', err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Check auth status on mount (client-side only)
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Login
  const login = useCallback(async (email, password) => {
    try {
      setError(null);
      setLoading(true);

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      setUser(data.user);
      return { success: true, user: data.user };

    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Signup
  const signup = useCallback(async (name, email, password, phone) => {
    try {
      setError(null);
      setLoading(true);

      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name, email, password, phone }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Signup failed');
      }

      setUser(data.user);
      return { success: true, user: data.user };

    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Logout
  const logout = useCallback(async () => {
    try {
      setLoading(true);
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
      setUser(null);
      // Router navigation will be handled by the calling component
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Check if user has specific role
  const hasRole = useCallback((role) => {
    return user?.role === role;
  }, [user]);

  // Check if user is admin
  const isAdmin = useCallback(() => {
    return user?.role === 'ADMIN';
  }, [user]);

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    checkAuth,
    hasRole,
    isAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);

  // Return default values during SSR or when context is not available
  if (!context) {
    return {
      user: null,
      loading: true,
      error: null,
      isAuthenticated: false,
      login: async () => ({ success: false, error: 'Not mounted' }),
      signup: async () => ({ success: false, error: 'Not mounted' }),
      logout: async () => { },
      checkAuth: async () => { },
      hasRole: () => false,
      isAdmin: () => false,
    };
  }
  return context;
}

// HOC to protect pages
export function withAuth(Component, options = {}) {
  const { requireAdmin = false, redirectTo = '/login' } = options;

  return function ProtectedPage(props) {
    const { user, loading, isAuthenticated, isAdmin } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading) {
        if (!isAuthenticated) {
          router.replace(redirectTo);
        } else if (requireAdmin && !isAdmin()) {
          router.replace('/dashboard/student');
        }
      }
    }, [loading, isAuthenticated, isAdmin, router]);

    // Show loading while checking auth
    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      );
    }

    // Don't render if not authenticated
    if (!isAuthenticated) {
      return null;
    }

    // Don't render if admin required but not admin
    if (requireAdmin && !isAdmin()) {
      return null;
    }

    return <Component {...props} />;
  };
}

export default useAuth;
