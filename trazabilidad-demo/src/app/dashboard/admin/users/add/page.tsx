"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ethers, Interface } from "ethers";
import { getDeployedTo } from "@/lib/clientLib";

const { ADDRESS, ABI } = getDeployedTo("userContract");

export default function AddUserPage() {
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const { toast } = useToast();
  const router = useRouter();



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!window.ethereum) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please install MetaMask to perform this action",
      });
      return;
    }
//     No files changed, compilation skipped
// Deployer: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
// Deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
// Transaction hash: 0xfe641cb28aea1b87d1cc7e606ad81fb5b86e43180e33959acc57ceaad1398d3e

    try {
      // Here you would interact with your smart contract
      // This is a basic example - adjust according to your contract's ABI and address
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner();
      const contractAddress = ADDRESS;

      const contractABI = ABI;
      // const contractABI = ["function addParticipante(address _address, string memory _name, string memory _role)"];
      const contract = new ethers.Contract(contractAddress, contractABI as Interface, signer);

      const tx = await contract.addParticipante(address, name, role);
      await tx.wait();

      toast({
        title: "Success",
        description: "User added successfully",
      });

      router.push("/dashboard/admin/users");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add user. Please try again.",
      });
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold">Add New User</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div className="space-y-2">
          <label htmlFor="address" className="text-sm font-medium">
            Wallet Address
          </label>
          <Input
            id="address"
            placeholder="0x..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            Name
          </label>
          <Input
            id="name"
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="role" className="text-sm font-medium">
            Role
          </label>
          <Select onValueChange={setRole} required>
            <SelectTrigger>
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="producer">Producer</SelectItem>
              <SelectItem value="factory">Factory</SelectItem>
              <SelectItem value="retailer">Retailer</SelectItem>
              <SelectItem value="consumer">Consumer</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button type="submit" className="w-full">
          Add User
        </Button>
      </form>
    </div>
  );
}
