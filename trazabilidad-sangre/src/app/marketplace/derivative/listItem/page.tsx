"use client"
import styles from "@/components/Registro.module.css"
import { useEffect, useState } from "react";
import { Wallet } from "@/components/ConnectWalletButton";
import { useWallet } from "@/components/ConnectWalletButton";
import { abi as abiTracker } from "@/lib/contracts/BloodTracker";
import { abi as abiDerivative } from "@/lib/contracts/BloodDerivative";
import { getDerivativeTypeFromNumber } from "@/components/Marketplace";
import Web3 from "web3";
import { abi } from "@/lib/contracts/BloodDonation";
import { useRouter } from "next/navigation";

function ListItemLogic() {
    const { account, web3 } = useWallet();
    const [tokensOfTheAccount, setTokensOfTheAccount] = useState<tokenInterface[]>([]);
    const [price, setPrice] = useState<number>(0);
    const [tokenId, setTokenId] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState("");
    const router = useRouter()

    interface tokenInterface {
        tokenAddress: string;
        tokenId: string;
        typeString: string;
        typeNumber: Number;
    }

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!price || !tokenId) {
            setErrorMessage("All fields are required");
            return;
        }

        setErrorMessage("");
        const contractAddressTracker = process.env.NEXT_PUBLIC_BLD_TRACKER_CONTRACT_ADDRESS ?? '';
        const contractAddressDerivative = process.env.NEXT_PUBLIC_BLD_DERIVATIVE_CONTRACT_ADDRESS ?? '';

        if (web3) {
            const contractTracker = new web3.eth.Contract(abiTracker, process.env.NEXT_PUBLIC_BLD_TRACKER_CONTRACT_ADDRESS);
            const contractDerivative = new web3.eth.Contract(abiDerivative, process.env.NEXT_PUBLIC_BLD_DERIVATIVE_CONTRACT_ADDRESS);
            const priceWei = web3.utils.toWei(price.toString(), "ether")
            console.log(process.env.NEXT_PUBLIC_BLD_DERIVATIVE_CONTRACT_ADDRESS, tokenId, priceWei)
            if (!account) return;
            await contractDerivative.methods.approve(contractAddressTracker, Number(tokenId)).send({ from: account, gas: '1000000', gasPrice: '1000000000' });
            await contractTracker.methods.listItem(contractAddressDerivative, Number(tokenId), priceWei).send({ from: account, gas: '1000000', gasPrice: '1000000000' });
            console.log("item listed correctly")
            router.push("/marketplace")
        }


    };

    const getTokenIdsInfo = async (params: { tokenIds: number[] } | null) => {
        const tokenAddress = process.env.NEXT_PUBLIC_BLD_DERIVATIVE_CONTRACT_ADDRESS;
        const tokens: tokenInterface[] = [];

        if (web3 && tokenAddress && params && params.tokenIds) {
            const contractTracker = new web3.eth.Contract(
                abiTracker,
                process.env.NEXT_PUBLIC_BLD_TRACKER_CONTRACT_ADDRESS
            );

            for (const id of params.tokenIds) {
                const contract = new web3.eth.Contract(
                    abiDerivative,
                    process.env.NEXT_PUBLIC_BLD_DERIVATIVE_CONTRACT_ADDRESS
                );
                const derivativeType = contract.methods.products(id).arguments[0];
                console.log("id", id);
                const typeString = getDerivativeTypeFromNumber(Number(derivativeType));
                if (!typeString) return;
                tokens.push({
                    tokenAddress,
                    tokenId: id.toString(),
                    typeString, 
                    typeNumber: Number(derivativeType),
                });
            }

            setTokensOfTheAccount(tokens);
            console.log(tokens);
        }
    };

    const getTokensOfTheAccount = async () => {
        var tokenIds: number[] = [];
        const contractDerivativeAddress = process.env.NEXT_PUBLIC_BLD_DERIVATIVE_CONTRACT_ADDRESS;
        if (!contractDerivativeAddress || !web3) return;
        const contractDerivative = new web3.eth.Contract(abiDerivative, contractDerivativeAddress);
        if (web3 && account && contractDerivative) {
            const balance = await contractDerivative.methods.balanceOf(account).call({ from: account })
            const balanceNum = Number(balance);
            if (!balanceNum) return;

            for (let index = 0; index < balanceNum; index++) {
                const tokenId = await contractDerivative.methods.tokenOfOwnerByIndex(account, index).call({ from: account })
                tokenIds.push(Number(tokenId))
            }
            console.log(tokenIds)
            getTokenIdsInfo({ tokenIds });
        }
    }

    useEffect(() => {
        getTokensOfTheAccount();
    }, []);

    useEffect(() => {

        getTokensOfTheAccount();
    }, [web3, account]);

    return (
        <section className={styles.section}>
            <h2 className={styles.title}>List Item form</h2>
            <form onSubmit={handleSubmit} className={styles.registerForm}>
                {
                    <>
                        <div className={styles.formGroup}>
                            <label htmlFor="companyRole" className={styles.formLabel}>
                                TokenId
                            </label>
                            <select
                                id="companyRole"
                                value={tokenId}
                                onChange={(e) => setTokenId(e.target.value)}
                                className={styles.formSelect}
                                required>
                                <option value="" disabled>
                                    Select a company role
                                </option>
                                {tokensOfTheAccount.map(({ tokenId, typeString }) => (
                                    <option key={tokenId} value={tokenId}>
                                        {`${tokenId}, ${typeString}`}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="location" className={styles.formLabel}>
                                Price(Ether)
                            </label>
                            <input
                                type="number"
                                step="0.000000000000000001"
                                id="location"
                                value={price}
                                onChange={(e) => setPrice(e.target.valueAsNumber)}
                                className={styles.formInput}
                                required
                            />
                        </div>

                    </>
                }
                {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
                <button type="submit" className={styles.submitButton}>
                    Submit
                </button>
            </form>
        </section>
        // <>Soy listItemLogic</>
    )
}

export default function ListItem() {
    return (
        <Wallet>
            <ListItemLogic />
        </Wallet>
    )
}
