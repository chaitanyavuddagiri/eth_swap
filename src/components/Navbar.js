import Identicon from 'identicon.js';
import React from 'react'

const NavBar = (props) => {
    return (
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
            <a
                className="navbar-brand col-sm-3 col-md-2 mr-0"
                href="http://www.dappuniversity.com/bootcamp"
                target="_blank"
                rel="noopener noreferrer"
            >
                EthSwap
            </a>
            <ul className="navbar-nav px-3">
                <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
                    <small className="text-secondary">
                        <small id="account">
                            {props.account}
                        </small>
                    </small>
                    {props.account &&
                        <img width="30" height="30" className="ml-2"
                            src={`data:image/png;base64, ${new Identicon(props.account, 30).toString()}`} alt="" />}
                </li>
            </ul>
        </nav>
    )
}

export default NavBar
