import { toast, ToastOptions, Id } from 'react-toastify';

// Configuración por defecto para los toasts
const defaultOptions: ToastOptions = {
  position: 'top-right',
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

// URL del explorador de blockchain (configurable según la red)
const EXPLORER_URL = process.env.NEXT_PUBLIC_EXPLORER_URL || 'https://explorer.trias.one';

/**
 * Muestra un toast de éxito para una transacción blockchain
 * @param txHash - Hash de la transacción
 * @returns Toast ID
 */
export function showTransactionSuccess(txHash: string): Id {
  const explorerLink = `${EXPLORER_URL}/tx/${txHash}`;

  return toast.success(
    <div>
      <p className="font-semibold">¡Transacción exitosa!</p>
      <a
        href={explorerLink}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-blue-400 hover:text-blue-300 underline"
      >
        Ver en explorador →
      </a>
    </div>,
    {
      ...defaultOptions,
      autoClose: 8000,
    }
  );
}

/**
 * Muestra un toast de error para una transacción blockchain
 * @param error - Error de la transacción
 * @returns Toast ID
 */
export function showTransactionError(error: unknown): Id {
  let errorMessage = 'Error en la transacción';

  if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    errorMessage = error;
  } else if (error && typeof error === 'object' && 'message' in error) {
    errorMessage = (error as { message: string }).message;
  }

  // Acortar mensajes muy largos
  if (errorMessage.length > 150) {
    errorMessage = errorMessage.substring(0, 150) + '...';
  }

  return toast.error(
    <div>
      <p className="font-semibold">Error en transacción</p>
      <p className="text-sm mt-1">{errorMessage}</p>
    </div>,
    {
      ...defaultOptions,
      autoClose: 10000,
    }
  );
}

/**
 * Muestra un toast de espera para una transacción pendiente
 * @returns Toast ID (útil para actualizar el toast después)
 */
export function showTransactionPending(): Id {
  return toast.info(
    <div>
      <p className="font-semibold">Transacción pendiente...</p>
      <p className="text-sm mt-1">Por favor espera la confirmación</p>
    </div>,
    {
      ...defaultOptions,
      autoClose: false,
      closeButton: false,
    }
  );
}

/**
 * Muestra un toast genérico de éxito
 * @param message - Mensaje a mostrar
 * @returns Toast ID
 */
export function showGenericSuccess(message: string): Id {
  return toast.success(message, defaultOptions);
}

/**
 * Muestra un toast genérico de error
 * @param message - Mensaje a mostrar
 * @returns Toast ID
 */
export function showGenericError(message: string): Id {
  return toast.error(message, defaultOptions);
}

/**
 * Muestra un toast de información
 * @param message - Mensaje a mostrar
 * @returns Toast ID
 */
export function showGenericInfo(message: string): Id {
  return toast.info(message, defaultOptions);
}

/**
 * Muestra un toast de advertencia
 * @param message - Mensaje a mostrar
 * @returns Toast ID
 */
export function showGenericWarning(message: string): Id {
  return toast.warning(message, defaultOptions);
}

/**
 * Actualiza un toast existente (útil para actualizar un toast de "pending" a "success")
 * @param toastId - ID del toast a actualizar
 * @param options - Nuevas opciones del toast
 */
export function updateToast(toastId: Id, options: ToastOptions): void {
  toast.update(toastId, options);
}

/**
 * Cierra un toast específico
 * @param toastId - ID del toast a cerrar
 */
export function dismissToast(toastId: Id): void {
  toast.dismiss(toastId);
}

/**
 * Cierra todos los toasts activos
 */
export function dismissAllToasts(): void {
  toast.dismiss();
}
