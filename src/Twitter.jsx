import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Modal from "react-modal";
import { ethers } from "ethers";

const TwitterUI = ({ contract }) => {
  const [tweets, setTweets] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTweet, setNewTweet] = useState({
    heading: "",
    content: "",
    imageUrl: "",
  });
  const [transactionFee, setTransactionFee] = useState("");

  useEffect(() => {
    getTweetsFromBlockchain();
  }, []);

  const postTweet = async () => {
    try {
      const txn = await contract.postTweet(
        newTweet.heading,
        newTweet.content,
        newTweet.imageUrl
      );

      const receipt = await txn.wait();
      const gasUsed = receipt.gasUsed;
      const gasPrice = await contract.provider.getGasPrice();
      const transactionFeeWei = gasUsed.mul(gasPrice);

      const transactionFeeEther = ethers.utils.formatEther(transactionFeeWei);
      setTransactionFee(transactionFeeEther);

      setNewTweet({ heading: "", content: "", imageUrl: "" });
    } catch (error) {
      console.error("Error posting tweet:", error);
    }
  };

  const getTweetsFromBlockchain = async () => {
    try {
      const tweetCount = await contract.tweetCount();
      const tweets = [];
      for (let i = 1; i <= tweetCount; i++) {
        const tweet = await contract.getTweet(i);
        tweets.push(tweet);
      }
      setTweets(tweets);
    } catch (error) {
      console.error("Error fetching tweets:", error);
    }
  };

  return (
    <div className="bg-cover ">
      <h1 className="text-4xl font-semibold mb-4 flex justify-between items-center">
        <span className="text-white font-montserrat">TwitterClone</span>

        <button
          className="bg-black bg-opacity-80 text-white px-3 py-1.5 rounded-md hover:bg-blue-950 transition duration-300 transform scale-95"
          onClick={() => setIsModalOpen(true)}
        >
          New Tweet
        </button>
      </h1>
      {tweets.length > 0 ? (
        <div className="flex flex-col justify-center items-center">
          {tweets.map((tweet, index) => (
            <div
              key={index}
              className="border my-2 p-4 rounded-3xl shadow-md bg-black bg-opacity-50"
            >
              {console.log(tweet.content)}
              <h2 className="text-xl text-green-400 font-semibold mb-2">
                {tweet.heading}
              </h2>
              {tweet.imageUrl && (
                <img src={tweet.imageUrl} alt="tweet image" className="mb-2" />
              )}
              <p className="text-white mb-2">{tweet.content}</p>
              <p className="text-gray-200">Author: {tweet.author}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No tweets available.</p>
      )}

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="New Tweet Modal"
      >
        <h2 className="text-xl font-semibold mb-4">New Tweet</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            postTweet();
          }}
        >
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Heading:
            </label>
            <input
              type="text"
              className="w-full border p-2 rounded-md"
              value={newTweet.heading}
              onChange={(e) =>
                setNewTweet({ ...newTweet, heading: e.target.value })
              }
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Content:
            </label>
            <textarea
              className="w-full border p-2 rounded-md"
              value={newTweet.content}
              onChange={(e) =>
                setNewTweet({ ...newTweet, content: e.target.value })
              }
              required
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Image URL:
            </label>
            <input
              type="text"
              className="w-full border p-2 rounded-md"
              value={newTweet.imageUrl}
              onChange={(e) =>
                setNewTweet({ ...newTweet, imageUrl: e.target.value })
              }
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
          >
            Post Tweet
          </button>
        </form>
      </Modal>
    </div>
  );
};

TwitterUI.propTypes = {
  contract: PropTypes.object.isRequired,
};

export default TwitterUI;
