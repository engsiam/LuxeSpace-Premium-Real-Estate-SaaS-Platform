import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth.config';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.role) {
    redirect('/login');
  }

  const role = session.user.role.toLowerCase();
  redirect(`/dashboard/${role}`);
}
