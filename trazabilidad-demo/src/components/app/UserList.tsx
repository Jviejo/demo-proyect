"use client";
import { Button } from "@/components/ui/button";
import { getDeployedTo } from "@/lib/clientLib";
import { Participant, User } from "@/lib/types";
import { ethers, Interface } from "ethers";
import Link from "next/link";
import { useEffect, useState } from "react";

const {ADDRESS, ABI} = getDeployedTo("userContract");


export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [metaMaskUser, setMetaMaskUser] = useState<string[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!window.ethereum) return;

      try {

        const provider = new ethers.BrowserProvider(window.ethereum);
        
        const contractAddress = ADDRESS;
        const contractABI = ABI;
        const contract = new ethers.Contract(
          contractAddress,
          contractABI as Interface,
          provider
        );

        const participants = await contract.getParticipants();

        const formattedUsers: User[] = participants.map(
          (participant: Participant) => ({
            address: participant.userAddress,
            name: participant.name,
            role: participant.role,
          })
        );
        console.log(formattedUsers);
        setUsers(formattedUsers);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUsers();
  }, []);

  
  useEffect(() => {
    const checkConnectedAccounts = async () => {
      if (typeof window.ethereum !== "undefined") {
        try {
          const accounts = await window.ethereum.request({
            method: "eth_accounts"
          });
          setMetaMaskUser(accounts);
          // Update users with connection status
          

        } catch (error) {
          console.error("Error checking connected accounts:", error);
        }
      }
    };

    checkConnectedAccounts();

    // Listen for account changes
    
  }, []);


  

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Participantes</h1>
        <Link href="/dashboard/admin/users/add">
          <Button>Add New User</Button>
        </Link>
      </div>

      <div className="border rounded-lg">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="px-4 py-3 text-left">Address</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user: User, index) => (
              <tr key={index} className="border-t">
                <td className="px-4 py-3 font-mono">{user.address}</td>
                <td className="px-4 py-3">{user.name}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-sm ${
                      user.role === "admin"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="border rounded-lg mt-6">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="px-4 py-3 text-left">Connected MetaMask Accounts</th>
            </tr>
          </thead>
          <tbody>
            {metaMaskUser.map((account, index) => (
              <tr key={index} className="border-t">
                <td className="px-4 py-3 font-mono">{account}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
