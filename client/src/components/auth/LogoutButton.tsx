'use client';

import { signOut } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

interface LogoutButtonProps {
  className?: string;
}

export function LogoutButton({ className = '' }: LogoutButtonProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/login');
          router.refresh();
        },
      },
    });
  };

  return (
    <button type="button" onClick={handleLogout} className={className}>
      Sign Out
    </button>
  );
}