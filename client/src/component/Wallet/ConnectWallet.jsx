import { useDispatch, useSelector } from "react-redux";
import {
  disconnectWallet,
  setWalletAddress,
  setConnectionStatus,
  setNetwork,
} from "../../redux/reducers/walletSlice";
import api from "../../utils/api";
import { useEffect } from "react";
import { ethers } from "ethers";

const chainIdToName = {
  1: "Ethereum Mainnet",
  5: "Goerli Testnet",
  11155111: "Sepolia Testnet",
  137: "Polygon",
  80001: "Mumbai Testnet",
  42220: "Celo Mainnet", // ✅ Add this line
  44787: "Celo Alfajores Testnet", // Optional: Celo testnet
};

const ConnectWallet = () => {
  const dispatch = useDispatch();
  const { isConnected, walletAddress, network } = useSelector(
    (state) => state.wallet
  );

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const walletAddress = accounts[0];

        dispatch(setWalletAddress(walletAddress));
        dispatch(setConnectionStatus(true));

        await api.put(
          "/user/connect-wallet",
          { walletAddress },
          { withCredentials: true }
        );

        const provider = new ethers.BrowserProvider(window.ethereum);
        const network = await provider.getNetwork();
        const networkName = chainIdToName[network.chainId] || "Unknown Network";
        dispatch(setNetwork(networkName));

        console.log("Connected to:", networkName);
      } catch (error) {
        console.error("Error connecting wallet:", error);
      }
    } else {
      console.error("MetaMask is not installed.");
    }
  };

  const disconnectWalletHandler = async () => {
    dispatch(disconnectWallet());
    await api.put("/user/disconnect-wallet", {}, { withCredentials: true });
    console.log("Wallet disconnected.");
  };

  useEffect(() => {
    const restoreConnection = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({
            method: "eth_accounts",
          });
          if (accounts.length > 0) {
            const address = accounts[0];
            dispatch(setWalletAddress(address));
            dispatch(setConnectionStatus(true));

            const provider = new ethers.BrowserProvider(window.ethereum);
            const network = await provider.getNetwork();
            console.log(network);
            const networkName =
              chainIdToName[network.chainId] || "Unknown Network";
            dispatch(setNetwork(networkName));

            console.log("Connected to:", networkName);
          }
        } catch (error) {
          console.error("Error restoring wallet connection:", error);
        }
      }
    };

    restoreConnection();
  }, [dispatch]);

  // Reload on account or network change
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", () => window.location.reload());
      window.ethereum.on("chainChanged", () => window.location.reload());
    }
  }, []);

  return (
    <div className="p-4 rounded-xl shadow-md bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white w-full max-w-md mx-auto mt-6">
      {!isConnected ? (
        <button
          onClick={connectWallet}
          className="w-full py-2 px-4 rounded-lg font-semibold bg-orange-500 text-white hover:bg-orange-600 dark:bg-zinc-700 dark:hover:bg-zinc-600 transition duration-200"
        >
          Connect Wallet
        </button>
      ) : (
        <div className="space-y-4">
          <p className="break-all text-sm">
            Wallet connected:{" "}
            <span className="font-medium">{walletAddress}</span>
          </p>
          <button
            onClick={disconnectWalletHandler}
            className="w-full py-2 px-4 rounded-lg font-semibold bg-gray-200 text-zinc-800 hover:bg-gray-300 dark:bg-zinc-700 dark:text-white dark:hover:bg-zinc-600 transition duration-200"
          >
            Disconnect Wallet
          </button>
        </div>
      )}
      {network && (
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Network: {network}
        </p>
      )}
    </div>
  );
};

export default ConnectWallet;
