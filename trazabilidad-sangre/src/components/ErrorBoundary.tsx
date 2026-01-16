'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from './ui/Button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * ErrorBoundary component to catch React errors and display fallback UI
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error to console
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });
  }

  handleReload = () => {
    // Reset error state - let React re-render
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-green-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-card p-8 max-w-2xl w-full">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">⚠️</div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Algo salió mal
              </h1>
              <p className="text-gray-600">
                Ha ocurrido un error inesperado. Por favor, intenta recargar la página.
              </p>
            </div>

            {this.state.error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <h2 className="text-sm font-semibold text-red-800 mb-2">
                  Detalles del error:
                </h2>
                <p className="text-sm text-red-700 font-mono break-words">
                  {this.state.error.toString()}
                </p>
                {this.state.errorInfo && (
                  <details className="mt-3">
                    <summary className="text-sm text-red-700 cursor-pointer hover:text-red-800">
                      Ver stack trace
                    </summary>
                    <pre className="text-xs text-red-600 mt-2 overflow-auto max-h-48 bg-red-100 p-3 rounded">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>
            )}

            <div className="flex justify-center gap-4">
              <Button
                variant="primary"
                onClick={this.handleReload}
              >
                🔄 Recargar Página
              </Button>
              <Button
                variant="ghost"
                onClick={() => window.history.back()}
              >
                ← Volver Atrás
              </Button>
            </div>

            <div className="mt-6 text-center text-sm text-gray-500">
              Si el problema persiste, contacta con el equipo de soporte.
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
