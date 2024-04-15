import { Web3Provider } from "@ethersproject/providers";
import { ethers } from "ethers";
import { useState } from "react";
import Twitter from "./Twitter";

const App = () => {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);

  const connectWallet = async () => {
    const Address = "0x1D0b8bB5D81400ff0D7eda4C32e088cf57469aa0";
    const ABI = [
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "uint256",
            name: "tweetId",
            type: "uint256",
          },
          {
            indexed: true,
            internalType: "address",
            name: "author",
            type: "address",
          },
          {
            indexed: false,
            internalType: "string",
            name: "heading",
            type: "string",
          },
          {
            indexed: false,
            internalType: "string",
            name: "content",
            type: "string",
          },
          {
            indexed: false,
            internalType: "string",
            name: "imageUrl",
            type: "string",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "timestamp",
            type: "uint256",
          },
        ],
        name: "TweetPosted",
        type: "event",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "_tweetId",
            type: "uint256",
          },
        ],
        name: "getTweet",
        outputs: [
          {
            internalType: "address",
            name: "author",
            type: "address",
          },
          {
            internalType: "string",
            name: "heading",
            type: "string",
          },
          {
            internalType: "string",
            name: "content",
            type: "string",
          },
          {
            internalType: "string",
            name: "imageUrl",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "timestamp",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "string",
            name: "_heading",
            type: "string",
          },
          {
            internalType: "string",
            name: "_content",
            type: "string",
          },
          {
            internalType: "string",
            name: "_imageUrl",
            type: "string",
          },
        ],
        name: "postTweet",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "tweetCount",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        name: "tweets",
        outputs: [
          {
            internalType: "address",
            name: "author",
            type: "address",
          },
          {
            internalType: "string",
            name: "heading",
            type: "string",
          },
          {
            internalType: "string",
            name: "content",
            type: "string",
          },
          {
            internalType: "string",
            name: "imageUrl",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "timestamp",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
    ];
    try {
      const { ethereum } = window;
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      window.ethereum.on("accountsChanged", () => {
        window.location.reload();
      });
      setAccount(accounts[0]);

      let contract;
      const provider = new Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      contract = new ethers.Contract(Address, ABI, signer);
      setContract(contract);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {account ? (
        <Twitter contract={contract} />
      ) : (
        <div className="flex justify-center items-center h-screen">
          <button
            className="bg-blue-600 hover:bg-blue-400 p-5 rounded-lg transition-all ease-in"
            onClick={connectWallet}
          >
            {" "}
            Connect Wallet
          </button>
        </div>
      )}
    </>
  );
};

export default App;
