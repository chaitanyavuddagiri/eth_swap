import React, { useState } from 'react'
import BuyForm from './BuyForm'
import SellForm from './SellForm'

const Main = (props) => {
    const [currentFrom, setCurrentFrom] = useState('buy')
    return (
        <div id='content'>
            <div className="d-flex justify-content-between mb-3">
                <button className="btn btn-light shadow" onClick={() => setCurrentFrom('buy')}>
                    Buy
                </button>
                <span className="text-muted">&lt; &nbsp; &gt;</span>
                <button className="btn btn-light shadow" onClick={() => setCurrentFrom('sell')}>
                    Sell
                </button>
            </div>
            <div className="card mb-4 shadow rounded-3" >
                <div className="card-body">
                    {currentFrom === 'buy' ?
                        <BuyForm ethBalance={props.ethBalance} tokenBalance={props.tokenBalance} buyTokens={props.buyTokens} /> :
                        <SellForm ethBalance={props.ethBalance} tokenBalance={props.tokenBalance} sellTokens={props.sellTokens} />
                    }
                </div>

            </div>
        </div>
    )
}

export default Main
