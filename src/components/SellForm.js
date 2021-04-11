import React, { useState } from 'react'
import ethLogo from '../eth-logo.png'
import tokenLogo from '../token-logo.png'

const SellForm = (props) => {
    const [etherAmount, setEatherAmount] = useState('0')
    const [output, setOutput] = useState('0')

    const onEtherAmountChange = (e) => {
        setEatherAmount(e.target.value)
        setOutput(e.target.value / 100)
    }
    return (

        <form className="mb-3" onSubmit={(event) => {
            event.preventDefault()
            props.sellTokens(window.web3.utils.toWei(etherAmount, 'Ether'))
        }}>
            <div>

                <label className="float-left"><b>Input</b></label>
                <span className="float-right text-muted">
                    Balance: {window.web3.utils.fromWei(props.tokenBalance, 'Ether')}
                </span>
            </div>
            <div className="input-group mb-4">
                <input
                    type="text"
                    value={etherAmount}
                    onChange={(event) => onEtherAmountChange(event)}
                    // ref={(input) => { this.input = input }}
                    className="form-control form-control-lg"
                    placeholder="0"
                    required />
                <div className="input-group-append">
                    <div className="input-group-text">
                        <img src={tokenLogo} height='32' alt="" className="mr-2" />
            DApp
      </div>
                </div>
            </div>
            <div>
                <label className="float-left"><b>Output</b></label>
                <span className="float-right text-muted">
                    Balance: {window.web3.utils.fromWei(props.ethBalance, 'Ether')}
                </span>
            </div>
            <div className="input-group mb-2">
                <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="0"
                    value={output}
                    disabled
                />
                <div className="input-group-append">
                    <div className="input-group-text">
                        <img src={ethLogo} height='32' alt="" className="mr-2" />
          ETH
      </div>
                </div>
            </div>
            <div className="mb-5">
                <span className="float-left text-muted">Exchange Rate</span>
                <span className="float-right text-muted">100 DApp = 1 ETH</span>
            </div>
            <button type="submit" className="btn btn-primary btn-block btn-lg">SWAP!</button>
        </form>

    )
}

export default SellForm
