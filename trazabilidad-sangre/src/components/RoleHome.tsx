"use client";
import React, { useEffect } from "react";
import { AppContainer } from "../app/layout";
import { useWallet } from "./ConnectWalletButton";
import DonationCenter from "./Roles/DonationCenter";
import Laboratory from "./Roles/Laboratory";
import Trader from "./Roles/Trader";
import { Spinner } from "./Spinner";
import { useRouter } from "next/navigation";
import Donor from "./Roles/Donor";
import Container from "./ui/Container";
import Section from "./ui/Section";
import Grid from "./ui/Grid";
import Card from "./ui/Card";
import Image from "next/image";

const rolesData = [
  { name: "Company", img: "/Blood_cell512px.png", path: "/role-registro" },
  { name: "Donor", img: "/Donor_card512px.png", path: "/role-donor" },
];

const RolesGrid = () => {
  const { account, web3, role, setRole, getRole, contractTracker } = useWallet();
  const router = useRouter();

  useEffect(() => {

    getRole();

  }, [account, web3, role]);

  const getRoleComponent = (role) => {

    switch (role) {
      case null:
        return <Spinner />
      case 1:
        return <DonationCenter />
      case 2:
        return <Laboratory />
      case 3:
        return <Trader />
      case 4:
        return <Donor />
      default:
        return (
          <Section>
            <Container>
              {/* Header Section */}
              <div className="text-center mb-16">
                <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
                  Your trusted partner in{" "}
                  <span className="text-medical-600">tracing blood donation</span> with{" "}
                  <span className="text-blockchain-600">blockchain</span> solutions.
                </h1>
                <p className="text-lg text-slate-600 max-w-3xl mx-auto mb-8">
                  Our platform leverages blockchain technology to ensure full
                  traceability of blood, connecting the entire value chain from the
                  donor to the recipient.
                </p>

                {/* Wallet not registered message */}
                <div className="bg-blood-50 border border-blood-200 rounded-lg p-6 max-w-2xl mx-auto">
                  <p className="text-slate-700">
                    <span className="font-semibold text-blood-700">Wallet {account}</span> is not registered.
                    <br />
                    If you are a <span className="font-medium text-blood-600">company</span>, you can register directly from the options below.
                    <br />
                    If you are a <span className="font-medium text-medical-600">donor</span>, please visit one of our donation centers to be registered.
                  </p>
                </div>
              </div>

              {/* Roles Grid */}
              <Grid cols={{ xs: 1, sm: 2, md: 2 }} gap="lg" className="max-w-2xl mx-auto">
                {rolesData.map((roleData) => (
                  <Card
                    key={roleData.name}
                    variant="elevated"
                    hoverable
                    onClick={() => handleClick(roleData.path)}
                    className="cursor-pointer transition-all duration-300 hover:-translate-y-2"
                  >
                    <div className="flex flex-col items-center justify-center p-8 text-center min-h-[280px]">
                      <div className="relative w-20 h-20 mb-6">
                        <Image
                          src={roleData.img}
                          alt={roleData.name}
                          width={80}
                          height={80}
                          className="object-contain"
                        />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900">
                        {roleData.name}
                      </h3>
                    </div>
                  </Card>
                ))}
              </Grid>
            </Container>
          </Section>
        )
        break;
    }
  }

  const handleClick = (path: string) => {
    router.push(path);
  }


  return (
    <AppContainer>
      <div className="min-h-[50vh]">
        {getRoleComponent(role)}
      </div>
    </AppContainer>
  );
}


export default RolesGrid;
