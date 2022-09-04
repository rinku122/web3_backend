const Web3 = require("web3");
const dotenv = require("dotenv");
const abi = require("./abi.json");

dotenv.config();

const web3 = new Web3(process.env.INFURA);

const myContract = new web3.eth.Contract(abi, process.env.CONTRACT_ADDRESS);
web3.eth.accounts.wallet.add(process.env.PRIVATE_KEY);

const admin = process.env.USER_ADDRESS;
const call = async () => {
  try {
    const previousAge = await myContract.methods.age().call();
    console.log("previousAge", previousAge);

    const tx = myContract.methods.changeAge(2);

    const value = web3.utils.toWei("0.1", "ether");
    // const value = 0;

    const gas = await tx.estimateGas({ from: admin, value });

    const gasPrice = await web3.eth.getGasPrice();

    const data = tx.encodeABI();
    const nounce = await web3.eth.getTransactionCount(admin);
    const Txdata = {
      from: admin,
      to: process.env.CONTRACT_ADDRESS,
      value,
      data,
      gas,
      gasPrice,
      nounce,
    };

    const receipt = await web3.eth.sendTransaction(Txdata);

    console.log("TransactionHasH", receipt.transactionHash);

    const newAge = await myContract.methods.age().call();

    console.log("NewAge", newAge);
  } catch (error) {
    console.log(error);
  }
};

call();
