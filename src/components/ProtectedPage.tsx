'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProtectedPage({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles: string[];
}) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    const role = user?.role;

    if (!token || !allowedRoles.includes(role)) {
      router.replace('/login');
    } else {
      setAuthorized(true);
    }
  }, [allowedRoles]);

  if (!authorized) return null; 

  return <>{children}</>;
}
