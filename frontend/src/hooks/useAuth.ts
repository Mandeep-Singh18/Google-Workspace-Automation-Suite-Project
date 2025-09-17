import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { User } from '@/types/user';
import api from '@/utils/api';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await api.get('/auth/me');
        setUser(data);
      } catch (err) {
        setUser(null);
        // Only redirect if we are not already on the login page
        if (router.pathname !== '/') {
          router.push('/');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [router]);

  return { user, loading };
};