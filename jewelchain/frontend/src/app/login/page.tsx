'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Login() {
  const { connect, isConnected } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isConnected) {
      router.push('/dashboard');
    }
  }, [isConnected, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body items-center text-center">
          <h2 className="card-title">Conecta tu Wallet</h2>
          <p>Conecta tu wallet de MetaMask para continuar</p>
          <div className="card-actions justify-end">
            <button className="btn btn-primary" onClick={connect}>
              Conectar MetaMask
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 