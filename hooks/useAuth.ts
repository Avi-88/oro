import { useState, useCallback } from 'react';

interface User {
  name: string;
  email: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>({name:"John Doe", email:"john.doe@example.com"});
  const [loading, setLoading] = useState(false);

  // Simulate async login
  const login = useCallback(async (name: string, email: string) => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setUser({ name, email });
    setLoading(false);
  }, []);

  // Simulate async logout
  const logout = useCallback(async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setUser(null);
    setLoading(false);
  }, []);

  return { user, loading, login, logout };
} 