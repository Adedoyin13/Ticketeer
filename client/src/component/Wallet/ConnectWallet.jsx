import { useDispatch, useSelector } from "react-redux";
import {
  disconnectWallet,
  setWalletAddress,
  setConnectionStatus,
} from "../../redux/reducers/walletSlice";
import api from "../../utils/api";
import { useEffect } from "react";

const ConnectWallet = () => {
  const dispatch = useDispatch();
  const { isConnected, walletAddress } = useSelector((state) => state.wallet);

  // Connect wallet function
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        // Request accounts from MetaMask
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const walletAddress = accounts[0];

        // Dispatch Redux to store wallet address and set status to connected
        dispatch(setWalletAddress(walletAddress));
        dispatch(setConnectionStatus(true));

        // Send wallet address to the backend to save it to the user's profile
        await api.put(
          "/user/connect-wallet",
          { walletAddress },
          { withCredentials: true }
        );

        console.log("Wallet connected:", walletAddress);
      } catch (error) {
        console.error("Error connecting wallet:", error);
      }
    } else {
      console.error("MetaMask is not installed.");
    }
  };

  useEffect(() => {
    const checkIfWalletIsConnected = async () => {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setIsConnected(true);
          setWalletAddress(accounts[0]);
          // Optional: check network here too
        }
      }
    };
  
    checkIfWalletIsConnected();
  }, []);
  

  // Disconnect wallet function
  const disconnectWalletHandler = async () => {
    // Dispatch Redux to clear wallet address and set status to disconnected
    dispatch(disconnectWallet());

    // Optionally, call an API to remove wallet address from the backend
    await api.put("/user/disconnect-wallet", { withCredentials: true });

    console.log("Wallet disconnected.");
  };

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
    </div>
  );
};

export default ConnectWallet;
