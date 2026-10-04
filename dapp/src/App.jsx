import { useEffect, useState } from "react";
import web3 from "./lib/web3";
import counterContract from "./contracts/counter_contract";

const App = () => {
  const [counter, setCounter] = useState(-1);
  const [account, setAccount] = useState('');

  useEffect(() => {
    const loadAccounts = async () => {
      const accounts = await web3.eth.getAccounts();
      if (accounts.length > 0) {
        console.log("Accounts: ", accounts);
        setAccount(accounts[0]);
      }
    }

    loadAccounts();
    getCounter();
    const handleChangedAccount = (accounts) => {
      console.log("Accounts(handler): ", accounts);
      setAccount(accounts[0]);
    }

    window.ethereum.on("accountsChanged", handleChangedAccount);

    return () => {
      window.ethereum.removeListener("accountsChanged", handleChangedAccount);
    }

  }, [])

  const increment = async()=>{
    await counterContract.methods.increase().send({from: account});
    await getCounter();
  }

  const decrement = async()=>{
    await counterContract.methods.decrease().send({from: account});
    await getCounter();
  }

  const getCounter = async()=>{
    const result = await counterContract.methods.get_counter().call();
    setCounter(result);
  }
  return (
    <div>
      <h1>Account: {account}</h1>
      <h3>Stored value: {counter}</h3>
      <button onClick={increment}>++</button>
      <button onClick={decrement} disabled={counter <= 0}>--</button>
    </div>
  )
}

export default App;