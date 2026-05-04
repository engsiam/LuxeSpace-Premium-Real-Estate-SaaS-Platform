'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useRef } from 'react';
import { useUserStore } from '@/store/useUserStore';

export function UserStoreProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const { setUser } = useUserStore();
  const initialized = useRef(false);

  useEffect(() => {
    if (status === 'authenticated' && session?.user && !initialized.current) {
      const user = session.user as any;
      setUser({
        id: user.id || '',
        name: user.name || '',
        email: user.email || '',
        avatar: user.avatar || user.image || '',
        role: user.role || 'USER',
      });
      initialized.current = true;
    } else if (status === 'unauthenticated') {
      setUser(null);
      initialized.current = false;
    }
  }, [status, session, setUser]);

  return <>{children}</>;
}