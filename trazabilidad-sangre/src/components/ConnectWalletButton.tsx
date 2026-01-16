"use client";
import React, { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { useRouter } from "next/navigation";
import Web3, { Contract } from "web3";
import "./../app/globals.css";
import GetWalletModal from "@/components/GetWalletModal";
import { abi as abiTracker } from "@/lib/contracts/BloodTracker"
import { abi as abiDonation } from "@/lib/contracts/BloodDonation"
import { abi as abiDerivative } from "@/lib/contracts/BloodDerivative"
import { truncateAddress, formatEther } from "@/lib/helpers"
import Badge from "@/components/ui/Badge"
import Tooltip from "@/components/ui/Tooltip"

type WalletContextType = {
  account: string | null;
  setAccount: React.Dispatch<React.SetStateAction<string>>,
  network: string | null;
  setNetwork: React.Dispatch<React.SetStateAction<string>>,
  installed: boolean | null;
  setInstalled: React.Dispatch<React.SetStateAction<boolean>>,
  isModalOpen: boolean | null;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
  isGetWalletModalOpen: boolean | null;
  setIsGetWalletModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
  dropdownOpen: boolean | null;
  setDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>,
  role: number | null,
  setRole: React.Dispatch<React.SetStateAction<number | null>>,
  getRole: () => Promise<void>,
  isAdmin: boolean,
  setIsAdmin: React.Dispatch<React.SetStateAction<boolean>>,
  checkIsAdmin: () => Promise<void>,
  web3: Web3 | null;
  setWeb3: React.Dispatch<React.SetStateAction<Web3 | null>>,
  walletType: string | null;
  setWalletType: React.Dispatch<React.SetStateAction<string>>,
  handleConnectWallet: () => Promise<void>;
  handleLogout: () => Promise<void>;
  getNetworkName: (networkId: string) => string;
  getWalletType: () => string;
  handleCloseModal: () => void;
  getWalletLogo: () => string;
  contractTracker: Contract<typeof abiTracker> | undefined
  contractDonation: Contract<typeof abiDonation> | undefined
  contractDerivative: Contract<typeof abiDerivative> | undefined
};

const WalletContext = createContext<WalletContextType | undefined>(undefined);

type WalletProviderProps = {
  children: ReactNode;
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a Wallet component');
  }
  return context;
}

export const Wallet: React.FC<WalletProviderProps> = ({ children }) => {
  const [account, setAccount] = useState("");
  const [network, setNetwork] = useState("");
  const [role, setRole] = useState<number | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [installed, setInstalled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isGetWalletModalOpen, setIsGetWalletModalOpen] =
    useState<boolean>(false);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [walletType, setWalletType] = useState<string>("");
  const [contractTracker, setContractTracker] = useState<Contract<typeof abiTracker>>()
  const [contractDonation, setContractDonation] = useState<Contract<typeof abiDonation>>()
  const [contractDerivative, setContractDerivative] = useState<Contract<typeof abiDerivative>>()

  const router = useRouter();

  useEffect(() => {
    if (window.ethereum) {
      setInstalled(true);
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);

      const handleAccountsChanged = async (accounts: string[]) => {
        setAccount(accounts[0]);
        setWalletType(getWalletType());

        // Redirigir según el estado de la nueva cuenta
        if (accounts[0]) {
          const tracker = new web3Instance.eth.Contract(
            abiTracker,
            process.env.NEXT_PUBLIC_BLD_TRACKER_CONTRACT_ADDRESS
          );

          try {
            // Verificar si es admin
            const adminStatus = await tracker.methods.isAdmin(accounts[0]).call();
            if (adminStatus) {
              router.push("/admin/approval-requests");
              return;
            }

            // Verificar si tiene solicitud pendiente
            const requestId = await tracker.methods.getActiveRequestId(accounts[0]).call();
            if (requestId && requestId !== "0") {
              router.push("/registro/pending");
              return;
            }

            // Si no es admin ni tiene solicitud, ir a selección de roles
            router.push("/all-role-grid");
          } catch (error) {
            console.error("Error checking account status:", error);
            router.push("/all-role-grid");
          }
        }
      };

      const handleChainChanged = (chainId: string) => {
        setNetwork(getNetworkName(chainId));
      };

      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);

      // Solo auto-conectar si el usuario previamente se había conectado (guardar en localStorage)
      const wasConnected = localStorage.getItem('walletConnected');
      if (wasConnected === 'true' && window.ethereum.selectedAddress) {
        setAccount(window.ethereum.selectedAddress);
        setWalletType(getWalletType());

        const networkId = window.ethereum.networkVersion;
        if (networkId == process.env.NEXT_PUBLIC_CHAIN_ID) {
          setContractTracker(new web3Instance.eth.Contract(abiTracker, process.env.NEXT_PUBLIC_BLD_TRACKER_CONTRACT_ADDRESS))
          setContractDonation(new web3Instance.eth.Contract(abiDonation, process.env.NEXT_PUBLIC_BLD_DONATION_CONTRACT_ADDRESS))
          setContractDerivative(new web3Instance.eth.Contract(abiDerivative, process.env.NEXT_PUBLIC_BLD_DERIVATIVE_CONTRACT_ADDRESS))
        } else {
          setContractTracker(new web3Instance.eth.Contract(abiTracker, process.env.NEXT_PUBLIC_BLD_TRACKER_CONTRACT_ADDRESS))
          setContractDonation(new web3Instance.eth.Contract(abiDonation, process.env.NEXT_PUBLIC_BLD_DONATION_CONTRACT_ADDRESS))
          setContractDerivative(new web3Instance.eth.Contract(abiDerivative, process.env.NEXT_PUBLIC_BLD_DERIVATIVE_CONTRACT_ADDRESS))
        }
        setNetwork(getNetworkName(networkId));
      } else {
        setAccount("");
        setNetwork("");
        setWalletType("");
      }
    } else {
      setInstalled(false);
    }
  }, []);

  useEffect(() => {
    if (account && contractTracker) {
      getRole();
    } else {
      setRole(null);
    }
  }, [account, contractTracker]);

  useEffect(() => {
    if (account && contractTracker) {
      checkIsAdmin();
    } else {
      setIsAdmin(false);
    }
  }, [account, contractTracker]);

  const handleConnectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const accounts = await web3?.eth.getAccounts();
        if (!accounts) return;
        if (accounts[0] == undefined) return;
        setAccount(accounts[0]);
        setWalletType(getWalletType());

        // Guardar en localStorage que el usuario se conectó
        localStorage.setItem('walletConnected', 'true');

        window.ethereum.on("accountsChanged", (accounts: string[]) => {
          setAccount(accounts[0]);
          setWalletType(getWalletType());
        });

        const networkId = await web3?.eth.net.getId();
        setNetwork(getNetworkName(networkId));

        // Verificar si es admin antes de redirigir
        if (contractTracker) {
          try {
            const adminStatus = await contractTracker.methods.isAdmin(accounts[0]).call();
            if (adminStatus) {
              // Si es admin, ir al panel de administración
              router.push("/admin/approval-requests");
            } else {
              // Verificar si tiene una solicitud pendiente
              const requestId = await contractTracker.methods.getActiveRequestId(accounts[0]).call();
              if (requestId && requestId !== "0") {
                // Si tiene solicitud pendiente, ir a la página de revisión
                router.push("/registro/pending");
              } else {
                // Si no tiene solicitud ni es admin, ir a la página de selección de roles
                router.push("/all-role-grid");
              }
            }
          } catch (error) {
            console.error("Error checking admin status:", error);
            // En caso de error, ir a la página por defecto
            router.push("/all-role-grid");
          }
        } else {
          router.push("/all-role-grid");
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      setIsGetWalletModalOpen(true);
    }
  };

  const handleLogout = async () => {
    try {
      // Limpiar localStorage para evitar auto-reconexión
      localStorage.removeItem('walletConnected');

      // Limpiamos el estado de la aplicación sin desconectar MetaMask
      setAccount("");
      setNetwork("");
      setWalletType("");
      setRole(null);
      setIsAdmin(false);
      setDropdownOpen(false);
      router.push("/");
    } catch (error) {
      console.error(error);
    }
  };

  const getRole = async () => {
    if (web3 && contractTracker && account) {
      try {
        // PRIMERO: Verificar si es admin - los admins no tienen rol específico
        const adminStatus = await contractTracker.methods.isAdmin(account).call();
        if (Boolean(adminStatus)) {
          setRole(null); // Admin no tiene rol de usuario
          return;
        }

        const company = await contractTracker.methods.companies(account).call();
        const companyRole = Number(company.role);

        console.log("Rol compañia", companyRole);

        // Si tiene un rol de compañía (1, 2 o 3), usarlo
        if (companyRole !== 0) {
          setRole(companyRole);
          return;
        }

        // Si no es compañía, verificar si es donante buscando eventos Donation
        const donationEvents = await contractTracker.getPastEvents('Donation', {
          filter: { donor: account },
          fromBlock: 0,
          toBlock: 'latest'
        });

        console.log(`Found ${donationEvents.length} donation events for ${account}`);

        if (donationEvents.length > 0) {
          setRole(4); // Donante
        } else {
          setRole(5); // No registrado
        }
      } catch (error) {
        console.error("Error getting role:", error);
        setRole(5);
      }
    }
  }

  const checkIsAdmin = async () => {
    if (web3 && contractTracker && account) {
      try {
        const adminStatus = await contractTracker.methods.isAdmin(account).call();
        setIsAdmin(Boolean(adminStatus));
        console.log("Admin status:", adminStatus);
      } catch (error) {
        console.error("Error checking admin status:", error);
        setIsAdmin(false);
      }
    } else {
      setIsAdmin(false);
    }
  }

  const getNetworkName = (networkId: string) => {
    switch (networkId) {
      case "1":
        return "Mainnet";
      case "11155111":
        return "Sepolia";
      case "5":
        return "Goerli";
      case "81234":
        return "Besu CodeCrypto";
      case "31337":
        return "Localhost (Anvil)";
      case "1337":
        return "Localhost (Ganache)";
      default:
        return networkId ? `Chain ID: ${networkId}` : "";
    }
  };

  const getWalletType = () => {
    if (window.ethereum.isMetaMask) return "MetaMask";
    return "Unknown Wallet";
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const getWalletLogo = () => {
    switch (walletType) {
      case "MetaMask":
        return "/metamask-icon.png";
      default:
        return "/icons8-hero-32-white.png";
    }
  };

  const contextValue: WalletContextType = {
    account,
    setAccount,
    network,
    setNetwork,
    installed,
    setInstalled,
    isModalOpen,
    setIsModalOpen,
    isGetWalletModalOpen,
    setIsGetWalletModalOpen,
    dropdownOpen,
    setDropdownOpen,
    role,
    setRole,
    getRole,
    isAdmin,
    setIsAdmin,
    checkIsAdmin,
    web3,
    setWeb3,
    walletType,
    setWalletType,
    handleConnectWallet,
    handleLogout,
    getNetworkName,
    getWalletType,
    handleCloseModal,
    getWalletLogo,
    contractTracker,
    contractDonation,
    contractDerivative
  }

  return (
    <WalletContext.Provider value={contextValue}>
      {children}
    </WalletContext.Provider>
  );
};

const WalletButton = () => {
  const { account,
    setAccount,
    network,
    setNetwork,
    installed,
    setInstalled,
    isModalOpen,
    setIsModalOpen,
    isGetWalletModalOpen,
    setIsGetWalletModalOpen,
    dropdownOpen,
    setDropdownOpen,
    role,
    isAdmin,
    web3,
    setWeb3,
    walletType,
    setWalletType,
    handleConnectWallet,
    handleLogout,
    getNetworkName,
    getWalletType,
    handleCloseModal,
    getWalletLogo,
    contractTracker,
    contractDonation,
    contractDerivative } = useContext(WalletContext);

  const router = useRouter();
  const [balance, setBalance] = useState<string>("0");

  // Fetch balance when account changes
  useEffect(() => {
    const fetchBalance = async () => {
      if (account && web3) {
        try {
          const balanceWei = await web3.eth.getBalance(account);
          setBalance(formatEther(balanceWei, 4));
        } catch (error) {
          console.error("Error fetching balance:", error);
        }
      }
    };

    fetchBalance();
  }, [account, web3]);

  const getRoleName = (roleNum: number | null, isAdmin: boolean): string => {
    if (isAdmin) return "Administrador";
    if (roleNum === null) return "No registrado";
    switch (roleNum) {
      case 1:
        return "Centro de Donación";
      case 2:
        return "Laboratorio";
      case 3:
        return "Trader";
      case 4:
        return "Donante";
      case 5:
        return "No registrado";
      default:
        return "No registrado";
    }
  };

  const getRoleBadgeVariant = (
    roleNum: number | null,
    isAdmin: boolean
  ): "pending" | "processing" | "completed" | "cancelled" => {
    if (isAdmin) return "completed"; // Green for Admin
    if (roleNum === null) return "cancelled";
    switch (roleNum) {
      case 1:
        return "processing"; // Blue for Donation Center
      case 2:
        return "completed"; // Green for Laboratory
      case 3:
        return "pending"; // Yellow for Trader
      case 4:
        return "completed"; // Green for Donor
      case 5:
        return "cancelled"; // Red for Not registered
      default:
        return "cancelled";
    }
  };

  const getToWalletRole = async () => {
    // Si es admin, ir al panel de administración
    if (isAdmin) {
      router.push("/admin/approval-requests");
    } else {
      // Verificar si tiene solicitud pendiente
      if (contractTracker && account) {
        try {
          const requestId = await contractTracker.methods.getActiveRequestId(account).call();
          if (requestId && requestId !== "0") {
            router.push("/registro/pending");
          } else {
            router.push("/all-role-grid");
          }
        } catch (error) {
          console.error("Error checking request status:", error);
          router.push("/all-role-grid");
        }
      } else {
        router.push("/all-role-grid");
      }
    }
  }

  // Toggle dropdown instead of hover
  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDropdownOpen(!dropdownOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (dropdownOpen && !target.closest('.dropdown-wallet')) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <div className="wallet-container">
      {installed ? (
        account === "" ? (
          <>
            <button
              className="feature-connect-wallet"
              onClick={handleConnectWallet}>
              Connect Wallet
            </button>
            {isModalOpen && <GetWalletModal onClose={handleCloseModal} />}
          </>
        ) : (
          <div className="dropdown-wallet">
            <div className="wallet-button-container">
              <button
                className="feature-connect-wallet wallet-button-main"
                onClick={role === 5 && !isAdmin ? getToWalletRole : undefined}
                style={{ cursor: role === 5 && !isAdmin ? 'pointer' : 'default' }}>
                <img
                  src={getWalletLogo()}
                  alt={walletType}
                  className="wallet-logo"
                />
                <span className="wallet-address">
                  {web3?.utils.isAddress(account)
                    ? truncateAddress(account, 4, 4)
                    : account}
                </span>
              </button>
              <button
                className="wallet-dropdown-trigger"
                onClick={toggleDropdown}
                aria-label="Toggle wallet menu"
                aria-expanded={dropdownOpen}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  className={`dropdown-icon ${dropdownOpen ? 'open' : ''}`}>
                  <path
                    d="M5 7.5L10 12.5L15 7.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            {dropdownOpen && (
              <div className="dropdown-wallet-content">
                <button
                  className="feature-wallet-logout"
                  onClick={(e) => {
                    e.preventDefault();
                    handleLogout();
                  }}>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="logout-icon">
                    <path
                      d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"/>
                  </svg>
                  <span>Desconectar</span>
                </button>
              </div>
            )}
          </div>
        )
      ) : (
        <>
          <button
            className="feature-connect-wallet"
            onClick={handleConnectWallet}>
            Connect Wallet
          </button>
          {isGetWalletModalOpen && (
            <GetWalletModal onClose={handleCloseModal} />
          )}
        </>
      )}
    </div>
  );
};

const ConnectWalletButton = () => {
  return (
    <Wallet>
      <WalletButton></WalletButton>
    </Wallet>
  )
}
export default ConnectWalletButton;
