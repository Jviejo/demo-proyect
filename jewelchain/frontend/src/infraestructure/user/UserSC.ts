import { UserSCList, UserSmartContract } from "@/types/user";
import { IUser } from "./IUser";
import { BrowserProvider, Contract, TransactionReceipt, TransactionResponse } from "ethers";
import { ABI_USER } from "@/abis/user";
import { convertRoleToBytes32 } from "@/application/EthersUtils";

export class UserSC implements IUser {

  private provider: BrowserProvider;

  constructor(provider: BrowserProvider) {
    this.provider = provider;
  }

  async getUsersList(): Promise<UserSCList[]> {
    const contract: Contract = await this.getContractUser();
    const usersList: UserSCList[] = await contract.getListUsers();
    return usersList;
  }



  async createUser(user: UserSmartContract): Promise<TransactionReceipt> {
    const contract: Contract = await this.getContractUser();
    const gasEstimate = await contract.createUser.estimateGas(
      user.address, user.role, user.name
    );
    const userCreate: TransactionResponse = await contract.createUser(user.address, user.role, user.name, { gasLimit: gasEstimate });
    const userCreateTransation: TransactionReceipt | null = await userCreate.wait();

    if (userCreateTransation == null) {
      throw Error('Transaction failed user create');
    }
    return userCreateTransation;
  }

  async deleteUser(address: string): Promise<TransactionReceipt> {
    const contract: Contract = await this.getContractUser();
    const gasEstimate = await contract.deleteUser.estimateGas(address);
    const userDelete: TransactionResponse = await contract.deleteUser(address, { gasLimit: gasEstimate });
    const userDeleteTransation: TransactionReceipt | null = await userDelete.wait();

    if (userDeleteTransation == null) {
      throw Error('Transaction failed user delete');
    }
    return userDeleteTransation;
  }

  async getUsersByRole(role: string): Promise<UserSCList[]> {
    const contract: Contract = await this.getContractUser();
    const roleSC: string = convertRoleToBytes32(role);
    const usersList: UserSCList[] = await contract.getUsersByRole(roleSC);
    return usersList;
  }

  async getContractUser(): Promise<Contract> {
    const signer = await this.provider.getSigner();
    const ADDRESS = process.env.NEXT_PUBLIC_USER_CONTRACT_ADDRESS as string;
    if (!ADDRESS) throw new Error("La dirección del rawMineralContract no está definida");
    return new Contract(ADDRESS, ABI_USER, signer)
  }

  async getUserName(address: string): Promise<string> {
    const contract = await this.getContractUser();
    return await contract.getUserName(address);
  }

}