import { MaterialInventory } from "@/infraestructure/IJewelFactory";
import { TruncateItem } from "../truncate/TruncateItem";

interface InventoryTableProps {
  inventory: MaterialInventory[];
}

export function InventoryTable({ inventory }: InventoryTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th>ID Material</th>
            <th>Cantidad</th>
            <th>Proveedor</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map((item) => (
            <tr key={item.materialId}>
              <td>
                <TruncateItem item={item.materialId} />
              </td>
              <td>{item.quantity}</td>
              <td>
                <TruncateItem item={item.supplier} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 