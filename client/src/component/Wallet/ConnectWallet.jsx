// src/components/ConnectWallet.jsx

import { useState } from "react";
import { ethers } from "ethers";
import axios from "axios";
import { toast } from "react-toastify";

const SERVER_URL = import.meta.env.SERVER_URL;

export default function ConnectWallet() {
  const [walletAddress, setWalletAddress] = useState(null);

  const handleConnectWallet = async () => {
    try {
      if (!window.ethereum) {
        toast.error("Please install MetaMask!");
        return;
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      setWalletAddress(address);

      // Save to backend
      await axios.put(
        `${SERVER_URL}/user/connect-wallet`,
        { walletAddress: address },
        {
          withCredentials: true,
          //   headers: {
          //     Authorization: `Bearer ${user.token}`, // your auth token
          //   },
        }
      );

      toast.success("Wallet connected successfully");
    } catch (error) {
      console.error("Wallet connection error:", error);
      toast.error("Could not connect wallet");
    }
  };

  return (
    <div className="p-4 rounded border max-w-md mx-auto bg-orange-50 dark:bg-zinc-900">
      {walletAddress ? (
        <div className="text-green-600 font-medium">
          Wallet Connected: {walletAddress.slice(0, 6)}...
          {walletAddress.slice(-4)}
        </div>
      ) : (
        <button
          onClick={handleConnectWallet}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
}
