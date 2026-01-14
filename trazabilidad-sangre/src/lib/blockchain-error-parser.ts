/**
 * Parser de errores de blockchain
 * Convierte errores técnicos en mensajes amigables para el usuario
 */

// Mapeo de errores comunes a mensajes amigables
const ERROR_MESSAGES: Record<string, string> = {
  // Errores de transacción
  'user rejected transaction': 'Transacción cancelada por el usuario',
  'user denied transaction': 'Transacción rechazada por el usuario',
  'transaction was rejected': 'La transacción fue rechazada',

  // Errores de fondos
  'insufficient funds': 'Fondos insuficientes para completar la transacción',
  'insufficient balance': 'Saldo insuficiente en la cuenta',
  'exceeds balance': 'El monto excede el saldo disponible',

  // Errores de gas
  'gas required exceeds allowance': 'Gas requerido excede el límite permitido',
  'out of gas': 'Se agotó el gas durante la ejecución',
  'gas too low': 'El gas proporcionado es demasiado bajo',
  'intrinsic gas too low': 'Gas intrínseco demasiado bajo',

  // Errores de red
  'network error': 'Error de conexión con la red blockchain',
  'timeout': 'La transacción excedió el tiempo de espera',
  'nonce too low': 'El nonce de la transacción es demasiado bajo',
  'nonce too high': 'El nonce de la transacción es demasiado alto',
  'replacement transaction underpriced': 'La transacción de reemplazo tiene un precio muy bajo',

  // Errores de smart contract
  'execution reverted': 'La ejecución del contrato fue revertida',
  'revert': 'Transacción revertida por el contrato',
  'invalid opcode': 'Código de operación inválido en el contrato',
  'stack underflow': 'Error de ejecución en el contrato',
  'stack overflow': 'Error de ejecución en el contrato',

  // Errores de permisos
  'not authorized': 'No tienes autorización para realizar esta acción',
  'only owner': 'Solo el propietario puede realizar esta acción',
  'access denied': 'Acceso denegado',

  // Errores de validación
  'invalid address': 'Dirección Ethereum inválida',
  'invalid argument': 'Argumento inválido en la transacción',
  'missing argument': 'Falta un argumento requerido',
  'invalid value': 'Valor inválido proporcionado',

  // Errores de conexión
  'could not detect network': 'No se pudo detectar la red',
  'no provider': 'No se encontró un proveedor Web3 (instala MetaMask)',
  'metamask not installed': 'MetaMask no está instalado',
  'provider not found': 'Proveedor Web3 no encontrado',

  // Errores específicos de la aplicación
  'not registered': 'La entidad no está registrada en el sistema',
  'already registered': 'La entidad ya está registrada',
  'invalid role': 'Rol inválido',
  'not laboratory': 'Solo los laboratorios pueden realizar esta acción',
  'not donation center': 'Solo los centros de donación pueden realizar esta acción',
  'not trader': 'Solo los traders pueden realizar esta acción',
  'blood not found': 'Donación de sangre no encontrada',
  'derivative not found': 'Derivado no encontrado',
  'not for sale': 'Este derivado no está a la venta',
  'insufficient payment': 'Pago insuficiente',
  'cannot buy own derivative': 'No puedes comprar tu propio derivado',
};

/**
 * Parsea un error de blockchain y retorna un mensaje amigable
 * @param error - Error de blockchain (puede ser Error, string, u objeto)
 * @returns Mensaje de error amigable para mostrar al usuario
 */
export function parseBlockchainError(error: unknown): string {
  // Si no hay error, retornar mensaje genérico
  if (!error) {
    return 'Ha ocurrido un error desconocido';
  }

  // Convertir el error a string para procesarlo
  let errorString: string;

  if (error instanceof Error) {
    errorString = error.message.toLowerCase();
  } else if (typeof error === 'string') {
    errorString = error.toLowerCase();
  } else if (typeof error === 'object' && 'message' in error) {
    errorString = String((error as { message: unknown }).message).toLowerCase();
  } else {
    errorString = String(error).toLowerCase();
  }

  // Buscar coincidencias con los errores conocidos
  for (const [key, message] of Object.entries(ERROR_MESSAGES)) {
    if (errorString.includes(key.toLowerCase())) {
      return message;
    }
  }

  // Intentar extraer el mensaje de revert si existe
  const revertMatch = errorString.match(/revert\s+(.+?)(?:\"|$)/i);
  if (revertMatch && revertMatch[1]) {
    return `Error del contrato: ${revertMatch[1].trim()}`;
  }

  // Si el error es muy largo, acortarlo
  if (errorString.length > 100) {
    return 'Error en la transacción. Por favor, verifica los datos e intenta nuevamente';
  }

  // Si no hay coincidencia, retornar el error original pero más amigable
  return `Error: ${errorString}`;
}

/**
 * Extrae información adicional del error si está disponible
 * @param error - Error de blockchain
 * @returns Objeto con información del error
 */
export function extractErrorInfo(error: unknown): {
  message: string;
  code?: string | number;
  data?: unknown;
} {
  const message = parseBlockchainError(error);

  let code: string | number | undefined;
  let data: unknown;

  if (error && typeof error === 'object') {
    if ('code' in error) {
      code = error.code as string | number;
    }
    if ('data' in error) {
      data = error.data;
    }
  }

  return {
    message,
    code,
    data,
  };
}

/**
 * Verifica si un error es debido a que el usuario canceló la transacción
 * @param error - Error a verificar
 * @returns true si el usuario canceló, false en caso contrario
 */
export function isUserRejection(error: unknown): boolean {
  if (!error) return false;

  const errorString = String(error).toLowerCase();

  return (
    errorString.includes('user rejected') ||
    errorString.includes('user denied') ||
    errorString.includes('user cancelled') ||
    errorString.includes('transaction was rejected')
  );
}

/**
 * Verifica si un error es debido a fondos insuficientes
 * @param error - Error a verificar
 * @returns true si hay fondos insuficientes, false en caso contrario
 */
export function isInsufficientFunds(error: unknown): boolean {
  if (!error) return false;

  const errorString = String(error).toLowerCase();

  return (
    errorString.includes('insufficient funds') ||
    errorString.includes('insufficient balance') ||
    errorString.includes('exceeds balance')
  );
}
