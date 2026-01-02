import { ethers, AbiCoder } from "ethers";

export const encodeBytes32String = (str: string) => {
  return ethers.encodeBytes32String(str);
};

export const decodeBytes32String = (str: string) => {
  return ethers.decodeBytes32String(str);
};

export const defaultAbiCoderEncode = (arrayTypes: Array<string>, arrayvalue: Array<string | number>) => {
  return AbiCoder.defaultAbiCoder().encode(arrayTypes, arrayvalue);
}

export const defaultAbiCoderDecode = (arrayTypes: Array<string>, data: string) => {
  return AbiCoder.defaultAbiCoder().decode(arrayTypes, data);
}

export const weiToUnit = (unitValue: number) => {
  return ethers.formatUnits(unitValue, 0);
};

export const unitToWei = (weiValue: number) => {
  return ethers.formatUnits(weiValue, 0);
};

export const convertRoleToBytes32 = (role: string) => {
  return ethers.solidityPackedKeccak256(
    ["string"],
    [role],
  )
}