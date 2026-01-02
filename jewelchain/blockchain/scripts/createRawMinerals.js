import { ethers, AbiCoder } from "ethers";
import "dotenv/config";
import { RAW_MINERAL_ABI } from "../abis/raw-mineral.js";

const PROVIDER = new ethers.JsonRpcProvider(process.env.PROVIDER);
const ADDRESS_CONTRACT = process.env.RAW_MINERAL_CONTRACT_ADDRESS;
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY_RAW_MINERAL, PROVIDER);
const rawMineralsContract = new ethers.Contract(
    ADDRESS_CONTRACT,
    RAW_MINERAL_ABI,
    wallet,
);

const rawMineral = [
    {
        name: "Diamante",
        date: Math.floor(Date.now() / 1000),
        quantity: 5,
        origin: "Madrid",
        quality: "85",
    },
    {
        name: "Oro",
        date: Math.floor(Date.now() / 1000),
        quantity: 10,
        origin: "Valencia",
        quality: "999",
    },
    {
        name: "Zafiro",
        date: Math.floor(Date.now() / 1000),
        quantity: 10,
        origin: "Bilbao",
        quality: "65",
    },
    {
        name: "Rubi",
        date: Math.floor(Date.now() / 1000),
        quantity: 10,
        origin: "Vigo",
        quality: "65",
    },
    {
        name: "Plata",
        date: Math.floor(Date.now() / 1000),
        quantity: 10,
        origin: "Barcelona",
        quality: "35",
    },
];

const creatRawMinerals = async () => {
    //let nonce = await PROVIDER.getTransactionCount(wallet.address);
    for (const mineral of rawMineral) {
        const dataBytes = AbiCoder.defaultAbiCoder().encode(
            ["uint256", "string"],
            [mineral.quality, mineral.origin],
        );
        const name = ethers.encodeBytes32String(mineral.name);
        const date = ethers.formatUnits(mineral.date, 0);
        const quantity = ethers.formatUnits(mineral.quantity, 0);

        const rawMineralCreate = await rawMineralsContract.createJewelRecord(
            name,
            date,
            quantity,
            dataBytes,
        );
        await rawMineralCreate.wait();

        //nonce += 1;
        console.log("Raw Mineral created", mineral.name);
        await new Promise((resolve) => setTimeout(resolve, 2000));
    }
};

creatRawMinerals()
    .catch(console.log)
    .finally(() => console.log("Fin crear materiales"));
