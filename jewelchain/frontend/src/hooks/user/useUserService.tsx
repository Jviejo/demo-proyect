import { UserService } from "@/application/users/UserService";
import { User } from "@/types/user";
import { BrowserProvider } from "ethers";
import { useCallback, useEffect, useState } from "react";

let userService: UserService;

export const useUserService = (provider: BrowserProvider | null) => {
  const [isLoading, setIsLoading] = useState(false);
  const [userList, setUserList] = useState<User[]>([]);

  useEffect(() => {
    if (provider) {
      userService = new UserService(provider);
    }
  }, [provider]);

  const createUser = useCallback(async (user: User) => {
    if (!userService) return;

    try {
      setIsLoading(true);
      return await userService.createUser(user);
    } catch (error) {
      console.error("Error createUser", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const listUsers = useCallback(async () => {
    if (!userService) return;
    try {
      const usersList: User[] = await userService.listUsers();
      setUserList(usersList);
    } catch (error) {
      console.error("Error listUsers", error);
    }
  }, []);

  const deleteUser = useCallback(async (address: string) => {
    if (!userService) return;

    try {
      setIsLoading(true);
      await userService.deleteUser(address);
    } catch (error) {
      console.error("Error deleteUser", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const listUserByRole = useCallback(async (role: string) => {
    if (!userService) return;

    try {
      setIsLoading(true);
      const usersList: User[] = await userService.listUserByRole(role);
      setUserList(usersList);
    } catch (error) {
      console.error("Error listUserByRole", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getUserName = useCallback(async (address: string) => {
    if (!userService) return;

    try {
      setIsLoading(true);
      return await userService.getUserName(address);
    } catch (error) {
      console.error("Error getUserName", error);
      return "";
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    userList,
    createUser,
    deleteUser,
    listUsers,
    listUserByRole,
    getUserName,
  };
};
