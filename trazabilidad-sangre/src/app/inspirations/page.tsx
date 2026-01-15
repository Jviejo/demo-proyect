'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * @deprecated Esta página ha sido fusionada con /services
 * Redirige automáticamente a /services (sección de historias de éxito)
 */
export default function InspirationsRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/services');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blockchain-600 mx-auto mb-4"></div>
        <p className="text-slate-600">Redirigiendo a Servicios...</p>
      </div>
    </div>
  );
}
