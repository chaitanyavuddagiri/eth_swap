import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import EthSwap from '../abis/EthSwap.json';
import Token from '../abis/Token.json';

import Navbar from './Navbar';
import './App.css';
import Main from './Main';
import { Spinner } from 'react-bootstrap';

const App = () => {

  const [account, setAccount] = useState('')
  const [token, setToken] = useState({})
  const [ethSwap, setEthSwap] = useState({})
  const [ethBalance, setEthBalance] = useState('0')
  const [tokenBalance, setTokenBalance] = useState('0')
  const [loading, setLoading] = useState(true)

  async function loadBlockChainData() {
    const web3 = window.web3

    const accounts = await web3.eth.getAccounts();
    setAccount(accounts[0])
    const ethBalance = await web3.eth.getBalance(accounts[0])
    setEthBalance(ethBalance)

    // creating smart contract for token in js using web3
    const netwokId = await web3.eth.net.getId()
    const tokenData = Token.networks[netwokId]
    if (tokenData) {
      const token = new web3.eth.Contract(Token.abi, tokenData.address)
      setToken(token)
      let tokenBalance = await token.methods.balanceOf(accounts[0]).call()
      setTokenBalance(tokenBalance)
    }
    else {
      window.alert('Token contract not deployed to detected network')
    }

    // Creating smart contract for EthSwap in js using web3
    const ethSwapData = EthSwap.networks[netwokId]
    if (ethSwapData) {
      const ethSwap = new web3.eth.Contract(EthSwap.abi, ethSwapData.address)
      setEthSwap(ethSwap)
    }
    else {
      window.alert('EthSwap contract is not deployed to detected network')
    }

    setLoading(false)
  }

  async function loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('No ethereum browser detected, you should consider using MetaMask!')
    }
  }

  async function initialize() {
    await loadWeb3() // Connecting to ethereum broweser
    await loadBlockChainData(); // Creating smart contracts in JS
  }

  useEffect(() => {
    initialize();
  }, []);

  const buyTokens = (etherAmount) => {
    setLoading(true)
    ethSwap.methods.buyTokens()
      .send({ from: account, value: etherAmount })
      .on('transactionHash', async (hash) => {
        refreshBalance()

        setLoading(false);
      })
  }

  const sellTokens = (tokenAmount) => {
    setLoading(true);
    token.methods.approve(ethSwap._address, tokenAmount).send({ from: account }).on('transactionHash', (hash) => {
      ethSwap.methods.sellTokens(tokenAmount).send({ from: account }).on('transactionHash', async (hash) => {
        refreshBalance()

        setLoading(false);
      })
    })
  }

  async function refreshBalance() {
    let ethBalance = await window.web3.eth.getBalance(account)
    setEthBalance(ethBalance)

    let tokenBalance = await token.methods.balanceOf(account).call()
    setTokenBalance(tokenBalance)
  }


  return (
    <div>
      <Navbar account={account} />
      <div className="container-fluid mt-5">
        <div className="row d-flex justify-content-center align-items-center" style={{ height: '90vh' }}>
          <main role="main" className="col-lg-6 text-center">
            <div className="content mr-auto ml-auto">
              <a
                href="http://www.dappuniversity.com/bootcamp"
                target="_blank"
                rel="noopener noreferrer"
              >
              </a>
              {loading ? (<Spinner animation="border" role="status">
                <span className="sr-only">Loading...</span>
              </Spinner>) : (<Main
                ethBalance={ethBalance}
                tokenBalance={tokenBalance}
                buyTokens={buyTokens}
                sellTokens={sellTokens} />)}
            </div>
          </main>
        </div>
      </div>
    </div>
  );

}

export default App;
