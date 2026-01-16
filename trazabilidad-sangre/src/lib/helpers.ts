import { format, formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import Web3 from 'web3';
import { abi as abiTracker } from './contracts/BloodTracker';

/**
 * Trunca una dirección Ethereum para mostrarla de forma compacta
 * @param address - Dirección Ethereum completa
 * @param startChars - Número de caracteres al inicio (por defecto 6)
 * @param endChars - Número de caracteres al final (por defecto 4)
 * @returns Dirección truncada en formato 0x1234...5678
 */
export function truncateAddress(
  address: string,
  startChars: number = 6,
  endChars: number = 4
): string {
  if (!address) return '';
  if (address.length < startChars + endChars) return address;

  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
}

/**
 * Formatea una fecha según el patrón especificado
 * @param date - Fecha a formatear (Date, timestamp, o string)
 * @param formatPattern - Patrón de formato (por defecto 'dd/MM/yyyy')
 * @returns Fecha formateada
 */
export function formatDate(
  date: Date | number | string,
  formatPattern: string = 'dd/MM/yyyy'
): string {
  if (!date) return '';

  try {
    const dateObj = typeof date === 'string' || typeof date === 'number'
      ? new Date(date)
      : date;

    return format(dateObj, formatPattern, { locale: es });
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
}

/**
 * Formatea una fecha con hora en formato completo
 * @param date - Fecha a formatear
 * @returns Fecha formateada en formato "dd/MM/yyyy HH:mm"
 */
export function formatDateTime(date: Date | number | string): string {
  return formatDate(date, 'dd/MM/yyyy HH:mm');
}

/**
 * Formatea una fecha de forma relativa (hace X minutos/horas/días)
 * @param date - Fecha a formatear
 * @returns Tiempo relativo formateado
 */
export function formatRelativeTime(date: Date | number | string): string {
  if (!date) return '';

  try {
    const dateObj = typeof date === 'string' || typeof date === 'number'
      ? new Date(date)
      : date;

    return formatDistanceToNow(dateObj, {
      addSuffix: true,
      locale: es
    });
  } catch (error) {
    console.error('Error formatting relative time:', error);
    return '';
  }
}

/**
 * Convierte wei a ETH y formatea con decimales
 * @param wei - Cantidad en wei (string o bigint)
 * @param decimals - Número de decimales a mostrar (por defecto 4)
 * @returns Cantidad formateada en ETH
 */
export function formatEther(
  wei: string | bigint | number,
  decimals: number = 4
): string {
  if (!wei) return '0';

  try {
    // Convertir a bigint si es necesario
    const weiValue = typeof wei === 'bigint' ? wei : BigInt(wei);

    // Convertir wei a ETH (dividir por 10^18)
    const ethValue = Number(weiValue) / 1e18;

    // Formatear con decimales
    return ethValue.toFixed(decimals);
  } catch (error) {
    console.error('Error formatting ether:', error);
    return '0';
  }
}

/**
 * Obtiene el nombre del tipo de derivado
 * @param type - Tipo numérico del derivado (0, 1, 2)
 * @returns Nombre del derivado
 */
export function getDerivativeTypeName(type: number | string): string {
  const typeNum = typeof type === 'string' ? parseInt(type) : type;

  const types: Record<number, string> = {
    0: 'Plasma',
    1: 'Eritrocitos',
    2: 'Plaquetas'
  };

  return types[typeNum] || 'Desconocido';
}

/**
 * Obtiene el nombre del tipo de evento
 * @param event - Tipo de evento
 * @returns Nombre del evento
 */
export function getEventTypeName(event: string): string {
  const events: Record<string, string> = {
    'Donation': 'Donación',
    'Transfer': 'Transferencia',
    'Processing': 'Procesamiento',
    'Sale': 'Venta',
    'Purchase': 'Compra',
    'Listed': 'Publicado',
    'Unlisted': 'Retirado',
    'Generation': 'Generación',
    'Consumation': 'Procesamiento',
    'PatientAdministration': 'Administración a Paciente',
    'ManufacturerBatch': 'Lote Manufacturado'
  };

  return events[event] || event;
}

/**
 * Obtiene el nombre del rol según el número
 * @param role - Número del rol (0-5)
 * @returns Nombre del rol
 */
export function getRoleName(role: number | string): string {
  const roleNum = typeof role === 'string' ? parseInt(role) : role;

  const roles: Record<number, string> = {
    0: 'Sin Registrar',
    1: 'Centro de Donación',
    2: 'Laboratorio',
    3: 'Trader',
    4: 'Hospital',
    5: 'Manufacturer'
  };

  return roles[roleNum] || 'Desconocido';
}

/**
 * Obtiene el nombre del tipo de producto manufacturado
 * @param type - Tipo de producto (SERUM, CREAM, etc.)
 * @returns Nombre del producto
 */
export function getProductTypeName(type: string): string {
  const types: Record<string, string> = {
    'SERUM': 'Serum Facial',
    'CREAM': 'Crema Anti-Edad',
    'MASK': 'Mascarilla Facial',
    'TREATMENT': 'Tratamiento Capilar',
    'SUPPLEMENT': 'Suplemento Nutricional'
  };

  return types[type] || type;
}

/**
 * Obtiene la imagen según el tipo de token (bolsa o derivado)
 * @param isBloodBag - true si es bolsa completa, false si es derivado
 * @param derivativeType - tipo de derivado (0, 1, 2) si es derivado
 * @returns Ruta de la imagen
 */
export function getImageFromType(isBloodBag: boolean, derivativeType?: number): string {
  if (isBloodBag) {
    return '/blood-bag.png';
  }

  // Para derivados, usar las imágenes existentes
  const images: Record<number, string> = {
    0: '/plasma.png',
    1: '/erythrocytes.png',
    2: '/platelets.png'
  };

  return images[derivativeType || 0] || '/blood-bag.png';
}

/**
 * Obtiene el nombre de una compañía desde el contrato BloodTracker
 * @param address - Dirección Ethereum de la compañía
 * @returns Nombre de la compañía o dirección truncada si no se encuentra
 */
export async function getCompanyName(address: string): Promise<string> {
  if (!address) return '';

  try {
    // Inicializar Web3 con el proveedor correcto
    const web3 = new Web3(
      typeof window !== 'undefined' && (window as any).ethereum
        ? (window as any).ethereum
        : process.env.NEXT_PUBLIC_RPC_URL || 'http://localhost:8545'
    );

    // Crear instancia del contrato BloodTracker
    const contractAddress = process.env.NEXT_PUBLIC_BLD_TRACKER_CONTRACT_ADDRESS;

    if (!contractAddress) {
      console.error('BloodTracker contract address not configured');
      return truncateAddress(address);
    }

    const contract = new web3.eth.Contract(abiTracker, contractAddress);

    // Llamar al mapping público companies(address)
    const company = await contract.methods.companies(address).call();

    // El mapping retorna un objeto con { name, location, role }
    const companyData = company as { name: string; location: string; role: number };

    // Si tiene nombre, retornarlo
    if (companyData.name && companyData.name.trim() !== '') {
      return companyData.name;
    }

    // Si no tiene nombre, retornar dirección truncada
    return truncateAddress(address);
  } catch (error) {
    console.error('Error fetching company name:', error);
    // En caso de error, retornar dirección truncada
    return truncateAddress(address);
  }
}
