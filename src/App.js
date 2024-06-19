
import React, { useState, useEffect } from "react";
import Web3 from "web3";
import HelloWorldABI from "./ABI/HelloWorld.json"; // Assuming you have your contract ABI in a file
import './App.css'; // Import the CSS file

const App = () => {
  const [greeting, setGreeting] = useState('');
  const [newGreeting, setNewGreeting] = useState('');
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState('');
  const [showName, setShowName] = useState(false);

  useEffect(() => {
      async function initContract() {
          try {
              // Connect to MetaMask provider
              const web3 = new Web3(window.ethereum);
              // Get user's accounts
              const accounts = await web3.eth.requestAccounts();
              setAccount(accounts[0]); // Set the first account as the user's account
              // Get network ID
              const networkId = await web3.eth.net.getId();
              // Get contract instance
              const deployedNetwork = HelloWorldABI.networks[networkId];
              const contractInstance = new web3.eth.Contract(
                  HelloWorldABI.abi,
                  deployedNetwork && deployedNetwork.address,
              );
              setContract(contractInstance);
              // Retrieve initial greeting from contract
              const initialGreeting = await contractInstance.methods.getGreeting().call({ from: accounts[0] });
              setGreeting(initialGreeting);
          } catch (error) {
              console.error('Error connecting to contract:', error);
          }
      }
      initContract();
  }, []);

  const handleGreetingChange = async () => {
      try {
          const web3 = new Web3(window.ethereum);
          // Send transaction to update greeting
          await contract.methods.setGreeting(newGreeting).send({ from: account });
          // Retrieve updated greeting from contract
          const updatedGreeting = await contract.methods.getGreeting().call({ from: account });
          setGreeting(updatedGreeting);
          setNewGreeting('');
      } catch (error) {
          console.error('Error updating greeting:', error);
      }
  };

  return (
      <div className="app-container">
          <h1 className="app-title">Hello, World and Name DApp</h1>
          <div className="input-container">
              <input 
                  type="text" 
                  value={newGreeting} 
                  placeholder="Enter your name here" 
                  onChange={(e) => setNewGreeting(e.target.value)} 
                  className="input-field"
              />
              <div className="button-all">
              <button onClick={handleGreetingChange} className="button">Set Name</button>
              <button onClick={() => setShowName(!showName)} className="button">
                  {showName ? `Hide name` : `Show name`}
              </button>
              </div>
          </div>
          {showName && <p className="greeting-text">The entered name is :{greeting}</p>}
      </div>
  );
};

export default App;