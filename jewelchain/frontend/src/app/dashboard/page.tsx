'use client';

import { useAuth } from '@/context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="p-4">
      <div className="grid gap-4">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-2xl">Bienvenido a tu Dashboard, {user?.name}</h2>
            <p className="text-sm opacity-70">
              Wallet conectada: {user?.address?.slice(0, 6)}...{user?.address?.slice(-4)}
            </p>
            <p className="text-sm opacity-70">
              Tipo de cuenta: {user?.role}
            </p>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="stat bg-base-100 shadow-xl rounded-box">
            <div className="stat-title">Balance Total</div>
            <div className="stat-value">0 ETH</div>
            <div className="stat-desc">↗︎ 400 (22%)</div>
          </div>

          <div className="stat bg-base-100 shadow-xl rounded-box">
            <div className="stat-title">Transacciones</div>
            <div className="stat-value">0</div>
            <div className="stat-desc">↘︎ 90 (14%)</div>
          </div>

          <div className="stat bg-base-100 shadow-xl rounded-box">
            <div className="stat-title">NFTs</div>
            <div className="stat-value">0</div>
            <div className="stat-desc">↗︎ 10 (2%)</div>
          </div>
        </div>

        {/* Actividad Reciente */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="card-title">Actividad Reciente</h3>
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Tipo</th>
                    <th>Hash</th>
                    <th>Valor</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Transferencia</td>
                    <td>0x1234...5678</td>
                    <td>0.1 ETH</td>
                    <td><div className="badge badge-success">Completado</div></td>
                  </tr>
                  <tr>
                    <td>Swap</td>
                    <td>0x8765...4321</td>
                    <td>0.5 ETH</td>
                    <td><div className="badge badge-success">Completado</div></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 