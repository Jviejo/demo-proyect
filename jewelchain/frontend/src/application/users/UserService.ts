import { IUser } from "@/infraestructure/user/IUser";
import { UserSC } from "@/infraestructure/user/UserSC";
import { User, UserRole, UserSCList, UserSmartContract } from "@/types/user";
import { BrowserProvider, ethers, TransactionReceipt } from "ethers";


const mapRole = (roleHash: string): string => {
  const roles = {
    [ethers.keccak256(ethers.toUtf8Bytes("ADMIN_ROLE"))]: "ADMIN_ROLE",
    [ethers.keccak256(ethers.toUtf8Bytes("RAW_MINERAL_ROLE"))]:
      "RAW_MINERAL_ROLE",
    [ethers.keccak256(ethers.toUtf8Bytes("JEWEL_FACTORY_ROLE"))]:
      "JEWEL_FACTORY_ROLE",
    [ethers.keccak256(ethers.toUtf8Bytes("DISTRIBUTOR_ROLE"))]:
      "DISTRIBUTOR_ROLE",
    [ethers.keccak256(ethers.toUtf8Bytes("STORE_ROLE"))]: "STORE_ROLE",
  };
  return roles[roleHash] || "UNKNOWN_ROLE";
};

export class UserService {
  private userSC: IUser;
  constructor(provider: BrowserProvider) {
    this.userSC = new UserSC(provider);
  }

  public async createUser(user: User): Promise<string> {

    const userSC: UserSmartContract = {
      address: user.address,
      role: ethers.solidityPackedKeccak256(
        ["string"],
        [user.role],
      ),
      name: user.name
    }

    const tx: TransactionReceipt = await this.userSC.createUser(userSC);

    return tx.hash;
  }

  public async deleteUser(address: string): Promise<string> {
    const tx: TransactionReceipt = await this.userSC.deleteUser(address);
    return tx.hash;
  }

  public async listUsers(): Promise<User[]> {

    const users: UserSCList[] = await this.userSC.getUsersList();

    const mappedUsers: User[] = users.map(user => {
      return {
        user: '',
        address: user.user,
        role: mapRole(user.role) as UserRole,
        name: user.name,
        companyName: '',
        isActive: user.isActive
      }
    });
    return mappedUsers;
  }

  public async listUserByRole(role: string): Promise<User[]> {

    const users: UserSCList[] = await this.userSC.getUsersByRole(role);

    return this.convertUserSCToUser(users);
  }

  private convertUserSCToUser(UserSCList: UserSCList[]): User[] {
    const mappedUsers: User[] = UserSCList.map(user => {
      return {
        user: '',
        address: user.user,
        role: mapRole(user.role) as UserRole,
        name: user.name,
        companyName: '',
        isActive: user.isActive
      }
    });
    return mappedUsers;
  }

  async getUserName(address: string): Promise<string> {
    try {
      return await this.userSC.getUserName(address);
    } catch (error) {
      console.error("Error getting user name:", error);
      throw error;
    }
  }
}