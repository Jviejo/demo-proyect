import Donor from "@/components/Roles/Donor";
import { AppContainer } from "../layout";
import { Wallet } from "@/components/ConnectWalletButton";

export default function DonorPage() {
  return (
    <AppContainer>
      <Wallet>
        <Donor />
      </Wallet>
    </AppContainer>
  );
}
