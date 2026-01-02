import { useState, useEffect } from "react";
import { CreateJewelDTO } from "@/infraestructure/IJewelFactory";
import { useJewelFactoryService } from "@/hooks/jewel-factory/useJewelFactoryService";

interface CreateJewelModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (jewel: CreateJewelDTO) => Promise<void>;
}

export function CreateJewelModal({ isOpen, onClose, onSubmit }: CreateJewelModalProps) {
    const { inventory, getAllMaterialsInventory } = useJewelFactoryService();
    
    const [formData, setFormData] = useState<CreateJewelDTO>({
        name: "",
        quantity: 1,
        materials: [],
        data: {
            quality: 0,
            design: "",
            certification: ""
        }
    });

    const [selectedMaterial, setSelectedMaterial] = useState({
        materialId: "",
        quantity: 0
    });

    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            getAllMaterialsInventory();
        }
    }, [isOpen, getAllMaterialsInventory]);

    const handleAddMaterial = () => {
        setError(null);
        
        if (!selectedMaterial.materialId) {
            setError("Debe seleccionar un material");
            return;
        }
        
        if (!selectedMaterial.quantity || selectedMaterial.quantity <= 0) {
            setError("La cantidad debe ser mayor que 0");
            return;
        }

        const materialInventory = inventory.find(item => item.materialId === selectedMaterial.materialId);
        if (!materialInventory) {
            setError("Material no encontrado en el inventario");
            return;
        }

        if (selectedMaterial.quantity > materialInventory.quantity) {
            setError(`Solo hay ${materialInventory.quantity} unidades disponibles de este material`);
            return;
        }
        console.log(selectedMaterial);
        console.log(formData);

        setFormData({
            ...formData,
            materials: [...formData.materials, {
                materialId: selectedMaterial.materialId,
                quantity: selectedMaterial.quantity
            }]
        });

        setSelectedMaterial({ materialId: "", quantity: 0 });
    };

    const handleRemoveMaterial = (index: number) => {
        setFormData({
            ...formData,
            materials: formData.materials.filter((_, i) => i !== index)
        });
    };

    const validateForm = (): boolean => {
        if (!formData.name.trim()) {
            setError("El nombre de la joya es requerido");
            return false;
        }
        if (formData.quantity <= 0) {
            setError("La cantidad debe ser mayor que 0");
            return false;
        }
        if (formData.materials.length === 0) {
            setError("Se requiere al menos un material");
            return false;
        }
        if (formData.data.quality <= 0) {
            setError("La calidad debe ser mayor que 0");
            return false;
        }
        if (!formData.data.design.trim()) {
            setError("El diseño es requerido");
            return false;
        }
        if (!formData.data.certification.trim()) {
            setError("La certificación es requerida");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        
        if (!validateForm()) {
            return;
        }

        try {
            await onSubmit(formData);
            onClose();
            setFormData({
                name: "",
                quantity: 1,
                materials: [],
                data: {
                    quality: 0,
                    design: "",
                    certification: ""
                }
            });
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Error desconocido al crear la joya');
            console.error("Error al crear la joya:", error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal modal-open">
            <div className="modal-box w-11/12 max-w-5xl h-[85vh] overflow-y-auto">
                <h3 className="font-bold text-lg mb-4">Fabricar Nueva Joya</h3>
                
                {error && (
                    <div className="alert alert-error mb-4">
                        <p>{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Información básica */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Nombre</span>
                            </label>
                            <input
                                type="text"
                                className="input input-bordered"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                required
                            />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Cantidad</span>
                            </label>
                            <input
                                type="number"
                                className="input input-bordered"
                                value={formData.quantity}
                                onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value)})}
                                min="1"
                                required
                            />
                        </div>
                    </div>

                    {/* Materiales */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Materiales</span>
                        </label>
                        <div className="flex gap-2">
                            <select
                                className="select select-bordered flex-1"
                                value={selectedMaterial.materialId}
                                onChange={(e) => setSelectedMaterial({
                                    ...selectedMaterial,
                                    materialId: e.target.value
                                })}
                            >
                                <option value="">Seleccionar material</option>
                                {inventory.map((item) => (
                                    <option key={item.materialId} value={item.materialId}>
                                        {item.materialId} (Disponible: {item.quantity})
                                    </option>
                                ))}
                            </select>
                            <input
                                type="number"
                                className="input input-bordered w-24"
                                placeholder="Cant."
                                value={selectedMaterial.quantity || ""}
                                onChange={(e) => setSelectedMaterial({
                                    ...selectedMaterial,
                                    quantity: parseInt(e.target.value)
                                })}
                                min="1"
                            />
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={handleAddMaterial}
                            >
                                Añadir
                            </button>
                        </div>

                        {/* Lista de materiales seleccionados */}
                        <div className="mt-2">
                            {formData.materials.length > 0 ? (
                                <div className="bg-base-200 p-2 rounded-lg">
                                    <h4 className="font-semibold mb-2">Materiales seleccionados:</h4>
                                    {formData.materials.map((material, index) => {
                                        const materialInfo = inventory.find(item => item.materialId === material.materialId);
                                        return (
                                            <div key={index} className="flex items-center justify-between gap-2 mb-2 last:mb-0 bg-base-100 p-2 rounded">
                                                <span className="flex-1">
                                                    {materialInfo ? (
                                                        <>Material: {material.materialId} - Cantidad: {material.quantity}</>
                                                    ) : (
                                                        <>Material no encontrado</>
                                                    )}
                                                </span>
                                                <button
                                                    type="button"
                                                    className="btn btn-ghost btn-sm text-error"
                                                    onClick={() => handleRemoveMaterial(index)}
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-sm text-gray-500 mt-2">
                                    No hay materiales seleccionados
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Datos adicionales */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Calidad (quilates)</span>
                            </label>
                            <input
                                type="number"
                                className="input input-bordered"
                                value={formData.data.quality}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    data: {
                                        ...formData.data,
                                        quality: parseInt(e.target.value)
                                    }
                                })}
                                min="0"
                                required
                            />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Diseño</span>
                            </label>
                            <input
                                type="text"
                                className="input input-bordered"
                                value={formData.data.design}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    data: {
                                        ...formData.data,
                                        design: e.target.value
                                    }
                                })}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Certificación</span>
                        </label>
                        <input
                            type="text"
                            className="input input-bordered"
                            value={formData.data.certification}
                            onChange={(e) => setFormData({
                                ...formData,
                                data: {
                                    ...formData.data,
                                    certification: e.target.value
                                }
                            })}
                            required
                        />
                    </div>

                    {/* Botones de acción */}
                    <div className="modal-action">
                        <button type="button" className="btn" onClick={onClose}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn btn-primary">
                            Crear Joya
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
} 