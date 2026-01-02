import { useAuth } from "@/context/AuthContext";
import { useUserService } from "@/hooks/user/useUserService";
import { User } from "@/types/user";
import { useEffect } from "react";

interface UserSelectProps {
  handlerSelect: (user: User) => void;
}

// NOTE: este componente es solo para usuarios con role JEWEL_FACTORY_ROLE o STORE_ROLE ---> para crear el select
export const UserSelect = ({ handlerSelect }: UserSelectProps) => {
  const { user, provider } = useAuth();

  const { userList, isLoading, listUserByRole } = useUserService(provider);

  useEffect(() => {
    const getUserByRole = async () => {
      if (user) {
        const role: string =
          user.role == "JEWEL_FACTORY_ROLE"
            ? "RAW_MINERAL_ROLE"
            : "JEWEL_FACTORY_ROLE";
        await listUserByRole(role);
      }
    };

    getUserByRole();
    // eslint-disable-next-line
  }, [listUserByRole, user]);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedAddress = event.target.value;
    const selectedUser = userList.find((u) => u.address === selectedAddress);
    if (selectedUser) {
      handlerSelect(selectedUser);
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <select name="user" id="user" onChange={handleChange}>
      <option>Select an user</option>
      {userList.map((u) => (
        <option key={u.address} value={u.address}>
          {u.name}
        </option>
      ))}
    </select>
  );
};
