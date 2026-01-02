import { ethers } from "ethers";
import "dotenv/config";
import { USER_ABI } from "./abis/user.js";
const PROVIDER = new ethers.JsonRpcProvider(process.env.PROVIDER);

const ADDRESS_CONTRACT = process.env.USER_CONTRACT_ADDRESS;

const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, PROVIDER);

const userJewelsContract = new ethers.Contract(
    ADDRESS_CONTRACT,
    USER_ABI,
    wallet,
);

const RAW_MINERAL_ROLE = "RAW_MINERAL";
const rawMineralRole = ethers.solidityPackedKeccak256(
    ["string"],
    [RAW_MINERAL_ROLE],
);

const JEWEL_FACTORY_ROLE = "JEWEL_FACTORY";
const jewelFactoryRole = ethers.solidityPackedKeccak256(
    ["string"],
    [JEWEL_FACTORY_ROLE],
);

const ADMIN_ROLE = "ADMIN";
const adminRole = ethers.solidityPackedKeccak256(
    ["string"],
    [JEWEL_FACTORY_ROLE],
);

const interface_SC_User = new ethers.Interface(USER_ABI);

const mapRole = {
    [rawMineralRole]: RAW_MINERAL_ROLE,
    [jewelFactoryRole]: JEWEL_FACTORY_ROLE,
    [adminRole]: ADMIN_ROLE,
};

const createUser = async () => {
    const addressNewUser = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
    const addressNewUserRawMineral =
        "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";

    try {
        const tx = await userJewelsContract.createUser(
            addressNewUser,
            rawMineralRole,
            "raw_mineral",
        );
        tx.wait();
        console.log("tx", tx);
        const tx2 = await userJewelsContract.createUser(
            addressNewUserRawMineral,
            jewelFactoryRole,
            "jewel_factory",
        );
        tx2.wait();
        console.log("tx2", tx2);
    } catch (err) {
        console.log("err", err);

        console.log("data_error", err.info.error.data);
        const revertData = err.info.error.data;
        const decodedError = interface_SC_User.parseError(revertData);
        console.log("Decode__Error:", decodedError);

        console.log("data", err.transaction.data);
        const data = err.transaction.data;
        const decodedData = interface_SC_User.getFunctionName("0x141fb940");
        console.log("Decode__Data:", decodedData);
        console.log("----------------------------");
    }
};

const getListUsers = async () => {
    try {
        const userList = await userJewelsContract.getListUsers();
        console.log("userList", userList);
        const mappedUserList = userList.map((user) => {
            return {
                address: user[0],
                role: mapRole[user[1]],
                isActive: user[2],
            };
        });
        console.log("mappedUserList", mappedUserList);
    } catch (err) {
        console.error("no funciona", err);
    }
};

//await createUser();
await getListUsers();
