import { Jewel } from '@/infraestructure/IJewelFactory';
import { formatDate } from '@/utils/dateUtils';
import { TruncateItem } from '../truncate/TruncateItem';
import Link from 'next/link';

interface JewelTableProps {
    jewels: Jewel[];
}

export function JewelTable({ jewels }: JewelTableProps) {
    return (
        <div className="overflow-x-auto">
            <table className="table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Fecha Creación</th>
                        <th>Creador</th>
                        <th>Cantidad</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {jewels.map((jewel) => (
                        <tr key={jewel.tokenId}>
                            <td>{jewel.tokenId}</td>
                            <td>{jewel.name}</td>
                            <td>{formatDate(new Date(jewel.creationDate * 1000))}</td>
                            <td><TruncateItem item={jewel.creator} /></td>
                            <td>{jewel.totalSupply}</td>
                            <td>
                                <Link
                                    href={`/dashboard/jewel-inventory/${jewel.tokenId}`}
                                    className="btn btn-sm btn-ghost"
                                >
                                    Ver Detalles
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
} 