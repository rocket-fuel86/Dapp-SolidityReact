import Web3 from "web3";

let web3 = new Web3();

if(window.ethereum){
    // web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
    web3 = new Web3(window.ethereum);
    try{
        window.ethereum.request({
            method: 'eth_requestAccounts'
        });
    }catch(error){
        console.error("Accounts not found: ", error);
    }
} else if(window.web3){
    web3 = new Web3(window.web3.currentProvider);
}else{
    console.error("Not detected web3 provider");
}

export default web3;