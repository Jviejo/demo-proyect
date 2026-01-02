import { UserSCList, UserSmartContract } from "@/types/user";
import { TransactionReceipt } from "ethers";

export interface IUser {
  createUser(user: UserSmartContract): Promise<TransactionReceipt>;
  deleteUser(address: string): Promise<TransactionReceipt>;
  getUsersList(): Promise<UserSCList[]>;
  getUsersByRole(role: string): Promise<UserSCList[]>;
  getUserName(address: string): Promise<string>;
}