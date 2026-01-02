import { ethers, AbiCoder } from "ethers";
import "dotenv/config";
import { RAW_MINERAL_ABI } from "../abis/raw-mineral.js";

const uniqueIdJ =
    "0xa4783e3c62a3344e169a12a5b6e17b49ddb21c300bda14443360e59e4762c07b";

const PROVIDER = new ethers.JsonRpcProvider(process.env.PROVIDER);
const ADDRESS_CONTRACT = process.env.RAW_MINERAL_CONTRACT_ADDRESS;
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY_RAW_MINERAL, PROVIDER);
const rawMineralsContract = new ethers.Contract(
    ADDRESS_CONTRACT,
    RAW_MINERAL_ABI,
    wallet,
);

const deserialze = async () => {
    const jewel = await rawMineralsContract.getJewelByUniqueId(uniqueIdJ);
    console.log("jewel", jewel);

    const abiCoder = AbiCoder.defaultAbiCoder();
    const jewelCahinData = await rawMineralsContract.encodeJewel(uniqueIdJ);

    const jewelCahinDECODE =
        await rawMineralsContract.decodeJewel(jewelCahinData);
    console.log("jewelCahinDECODE", jewelCahinDECODE);

    console.log("jewelCahinData", jewelCahinData);
    const slicet = jewelCahinData.slice(90);
    console.log("slicet", slicet);

    const [supplier, uniqueId, name, date, quantity, recordType, data] =
        abiCoder.decode(
            [
                "address",
                "bytes32",
                "bytes32",
                "uint256",
                "uint256",
                "uint8",
                "bytes",
            ],
            "0x" + slicet,
        );
    console.log("supplier", supplier);
    console.log("uniqueId", uniqueId);
    console.log("name", name);
    console.log("date", date);
    console.log("quantity", quantity);
    console.log("recordType", recordType);
    console.log("data", data);
};

deserialze();
