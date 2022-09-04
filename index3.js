const Web3 = require("web3");
const dotenv = require("dotenv");
const abi = require("./abi.json");
const Provider = require("@truffle/hdwallet-provider");

dotenv.config();

const provider = new Provider(process.env.PRIVATE_KEY, process.env.INFURA);
const web3 = new Web3(provider);

const myContract = new web3.eth.Contract(abi, process.env.CONTRACT_ADDRESS);

const admin = process.env.USER_ADDRESS;
const call = async () => {
  try {
    const previousAge = await myContract.methods.age().call();
    console.log("previousAge", previousAge);

    const tx = myContract.methods.changeAge(3);

    const value = web3.utils.toWei("0.1", "ether");
    const gas = await tx.estimateGas({ from: admin, value });

    const gasPrice = await web3.eth.getGasPrice();

    const result = await tx.send({ from: admin, value, gas, gasPrice });

    console.log(result, "+++++++++++++++++++++++++++++");

    const newAge = await myContract.methods.age().call();

    console.log("NewAge", newAge);
  } catch (error) {
    console.log(error);
  }
};

call();
