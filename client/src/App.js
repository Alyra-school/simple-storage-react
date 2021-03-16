import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = { storageValue: 0, web3: null, accounts: null, contract: null };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      const contract = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address,
      );  
      const storageValue = await contract.methods.get().call();

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract , storageValue });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  setValue = async () => {
    const { accounts, contract, web3 } = this.state;
    let storageValue = this.storedValue.value; 
    let context = this;

    await contract.methods.set(storageValue).send({ from: accounts[0], gasPrice: 0 } ,async function(erreur,tx){
      if(tx){
        console.log(tx);
        await web3.eth.getTransactionReceipt(tx, async function(erreur, receipt){
          console.log(receipt.logs);
          
          if(receipt.status){
            // Get the value from the contract to prove it worked.
            const response = await contract.methods.get().call();
            
            // Update state with the result.
            context.setState({ storageValue: response });
            context.storedValue.value = "";
            
            let events = contract.events.allEvents();
            console.log(events);
          }
        })
      }
    });
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Good to Go!</h1>
        <p>Your Truffle Box is installed and ready.</p>
        <h2>Smart Contract Example</h2>
        <p>
          Try changing the value stored on <strong>line 40</strong> of App.js.
        </p>
        <div>
        <form>
          <label>
            Value to store :
            <input type="text" id="storedValue" 
              ref={(input) => { 
                this.storedValue = input
              }}
            />
          </label>
          <input type="button" value="Set" onClick= { this.setValue } />
        </form>
        </div>
        <br></br>
        <div>The stored value is: {this.state.storageValue}</div>
      </div>
    );
  }
}

export default App;
