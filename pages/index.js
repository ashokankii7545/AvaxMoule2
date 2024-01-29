import { useState, useEffect, useRef } from "react";
import { ethers } from "ethers";
import ashokPrasadWalletAbi from "../artifacts/contracts/Assessment.sol/HomeSecuritySystem.json";

export default function HomePage() {
  const [ashokWallet, setAshokWallet] = useState(undefined);
  const [ashokAccount, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);

  const changeKeyPrev = useRef();
  const changeKeyNew = useRef();
  const adminAccessAddr = useRef();
  const accessAddr = useRef();
  const openDoorKey = useRef();

  const contractAddress = "0x5D147C36248f2f3E822529A32b4a00653432caCc";
  const atmABI = ashokPrasadWalletAbi.abi;

  const getWalletAddress = async () => {
    if (window.ethereum) {
      setAshokWallet(window.ethereum);
    }

    if (ashokWallet) {
      try {
        const accounts = await ashokWallet.request({ method: "eth_accounts" });
        accoundHandler(accounts);
      } catch (error) {
        console.log("error", error);
      }
    }
  };

  const accoundHandler = (accounts) => {
    if (accounts && accounts.length > 0) {
      console.log("Account connected: ", accounts[0]);
      setAccount(accounts[0]);
    } else {
      console.log("No ashokAccount found");
    }
  };

  const connectToMetamask = async () => {
    if (!ashokWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    const accounts = await ashokWallet.request({ method: "eth_requestAccounts" });
    accoundHandler(accounts);

    // once wallet is set, we can get a reference to our deployed contract
    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ashokWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);

    setATM(atmContract);
  };

  const changeSecretKey = async () => {
    let prevKey = Number(changeKeyPrev.current.value);
    let newKey = Number(changeKeyNew.current.value);
    try {
      if (atm) {
        let tx = await atm.changeSecretKey(prevKey, newKey);
        await tx.wait();
        console.log(`secret key change`);
      }
    } catch (error) {
      console.log("SOMETHING WENT WRONG");
      console.log(error);
    }
  };

  const giveAdminAccess = async () => {
    let addr = adminAccessAddr.current.value;

    try {
      if (atm) {
        let tx = await atm.giveAdminAccess(addr);
        await tx.wait();
        console.log(`new item added successfully`);
      }
    } catch (error) {
      console.log("SOMETHING WENT WRONG");
      console.log(error);
    }
  };

  const giveAccess = async () => {
    let addr = accessAddr.current.value;

    try {
      if (atm) {
        let tx = await atm.giveAccess(addr);
        await tx.wait();
        console.log(`new item added successfully`);
      }
    } catch (error) {
      console.log("SOMETHING WENT WRONG");
      console.log(error);
    }
  };

  const openDoor = async () => {
    let key = openDoorKey.current.value;

    try {
      if (atm) {
        let tx = await atm.openDoor(key);
        await tx.wait();
        console.log(`new item added successfully`);
      }
    } catch (error) {
      console.log("SOMETHING WENT WRONG");
      console.log(error);
    }
  };

  useEffect(() => {
    getWalletAddress();
  }, []);

  return (
    <main className="container">
      <header>
        <h1>Home Security</h1>
      </header>
      <div className="content">
        {!ashokAccount ? (
          <button onClick={connectToMetamask}>Start Home Security System</button>
        ) : (
          <>
            <div className="div">
              <h2>Only for Owner</h2>
              <div className="btn-group">
                <button onClick={changeSecretKey}>Change Key</button>
                <div>
                  <input ref={changeKeyPrev} type="password" placeholder="Previous Password" />
                  <input ref={changeKeyNew} type="password" placeholder="New Password" />
                </div>
              </div>
              <div className="btn-group">
                <button onClick={giveAdminAccess}>Give Admin Access</button>
                <div>
                  <input ref={adminAccessAddr} type="text" placeholder="Address" />
                </div>
              </div>
            </div>

            <div className="div">
              <h2>For All Admins</h2>
              <div className="btn-group">
                <button onClick={giveAccess}>Give Access To Users</button>
                <div>
                  <input ref={accessAddr} type="text" placeholder="Address" />
                </div>
              </div>
            </div>

            <div className="div">
              <h2>For People With Access</h2>
              <div className="btn-group">
                <button onClick={openDoor}>Open Door</button>
                <div>
                  <input ref={openDoorKey} type="password" placeholder="Password" />
                </div>
              </div>
            </div>
          </>
        )}
      </div>

    <style jsx>{`
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background-color: #f4f4f4;
    padding: 20px;
    font-family: Arial, sans-serif;
  }

  header {
    margin-bottom: 20px;
    text-align: center;
  }

  h1 {
    font-size: 24px;
    color: #333;
  }

  .content {
    width: 100%;
    max-width: 600px;
    background-color: #fff;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  .div {
    margin-bottom: 20px;
  }

  h2 {
    font-size: 18px;
    margin-bottom: 10px;
    color: #333;
  }

  .btn-group {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  input {
    padding: 8px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: 100%;
    box-sizing: border-box;
  }

  button {
    padding: 10px 20px;
    margin-top: 10px;
    cursor: pointer;
    border: none;
    border-radius: 4px;
    background-color: #007bff;
    color: #fff;
    font-size: 16px;
    transition: background-color 0.3s;
  }

  button:hover {
    background-color: #0056b3;
  }
`}</style>

    </main>
  );
}
