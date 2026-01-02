import { ethers } from "ethers";
import "dotenv/config";
import { USER_ABI } from "../abis/user.js";

const PROVIDER = new ethers.JsonRpcProvider(process.env.PROVIDER);
const ADDRESS_CONTRACT = process.env.USER_CONTRACT_ADDRESS;
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, PROVIDER);
const userJewelsContract = new ethers.Contract(
    ADDRESS_CONTRACT,
    USER_ABI,
    wallet,
);

// Array de usuarios a crear
const users = [
    {
        address: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        role: "RAW_MINERAL_ROLE",
        name: "Mina Metales S.A.",
    },
    {
        address: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
        role: "JEWEL_FACTORY_ROLE",
        name: "Fabricante de Joyas S.A.",
    },
    {
        address: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
        role: "DISTRIBUTOR_ROLE",
        name: "Distribuidor de Joyas S.A.",
    },
    {
        address: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
        role: "STORE_ROLE",
        name: "Retail Joyas S.A.",
    },
];

// Función para convertir el string del rol a bytes32
const getRoleHash = (role) => {
    return ethers.solidityPackedKeccak256(["string"], [role]);
};

const createUsers = async () => {
    for (const user of users) {
        try {
            console.log(`Creando usuario ${user.name} con rol ${user.role}...`);
            const roleHash = getRoleHash(user.role);

            const tx = await userJewelsContract.createUser(
                user.address,
                roleHash,
                user.name,
            );

            const receipt = await tx.wait();
            console.log(
                `Usuario creado exitosamente. Hash de transacción: ${receipt.hash}`,
            );
        } catch (err) {
            console.error(`Error creando usuario ${user.name}:`, err);

            if (err.info?.error?.data) {
                const revertData = err.info.error.data;
                const decodedError = new ethers.Interface(USER_ABI).parseError(
                    revertData,
                );
                console.log("Error decodificado:", decodedError);
            }
        }

        // Pequeña pausa entre transacciones
        await new Promise((resolve) => setTimeout(resolve, 1000));
    }
};

// Ejecutar el script
const main = async () => {
    try {
        await createUsers();
        console.log("Proceso completado");
    } catch (err) {
        console.error("Error en el proceso principal:", err);
    }
};

main();
