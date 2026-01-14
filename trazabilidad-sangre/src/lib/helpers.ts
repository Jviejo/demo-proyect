import { format, formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

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
    'Unlisted': 'Retirado'
  };

  return events[event] || event;
}
