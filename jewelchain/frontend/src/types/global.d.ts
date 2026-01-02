export {};

declare global {
    interface Window {
      ethereum?: {
        request: (args: { method: string }) => Promise<string[]>;
        isMetaMask?: boolean;
        removeAllListeners: () => void;
        on: (event: string, callback: (accounts: string[]) => void) => void;
      };
    }
  }
