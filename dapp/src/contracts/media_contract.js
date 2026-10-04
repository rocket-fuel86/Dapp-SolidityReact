import web3 from "../lib/web3";
import contractAbi from "./abi/mediaAbi.json";

const contract_address = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const mediaContract = new web3.eth.Contract(contractAbi, contract_address);

export default mediaContract;