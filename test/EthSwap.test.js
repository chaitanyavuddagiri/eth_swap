const { assert } = require('chai')

const Token = artifacts.require('Token')
const EthSwap = artifacts.require('EthSwap')

require('chai').use(require('chai-as-promised')).should()

const tokens = (n) => {
    return web3.utils.toWei(n, 'ether');
};

contract('EthSwap', ([deployer, investor]) => {
    let token, ethSwap
    before(async () => {
        token = await Token.new()
        ethSwap = await EthSwap.new(token.address)

        //Transfer tokens to ethSwap
        await token.transfer(ethSwap.address, tokens('1000000'))
    })

    describe('Token deployment', async () => {
        it('contract has a name', async () => {
            const name = await token.name()
            assert.equal(name, 'DApp Token')
        })
    })

    describe('EthSwap deployment', async () => {
        it('contract has a name', async () => {
            const name = await ethSwap.name()
            assert.equal(name, 'EthSwap Instant Exchange')
        })

        it('contract has token', async () => {
            let balance = await token.balanceOf(ethSwap.address)
            assert.equal(balance.toString(), tokens('1000000'))
        })
    })

    describe('buyTokens', async () => {
        let result

        before(async () => {
            // purchase tokens before each example
            result = await ethSwap.buyTokens({ from: investor, value: web3.utils.toWei('1', 'ether') })
        })
        it('Allows user to instantly purchase tokens from ethSwap for a fixed price', async () => {
            // Check investor receive tokens after purchase
            let investorBalance = await token.balanceOf(investor)
            assert.equal(investorBalance.toString(), tokens('100'))

            // check ethSwap balance after purchase
            let ethSwapBalance
            ethSwapBalance = await token.balanceOf(ethSwap.address)
            assert.equal(ethSwapBalance.toString(), tokens('999900'))
            ethSwapBalance = await web3.eth.getBalance(ethSwap.address)
            assert.equal(ethSwapBalance.toString(), web3.utils.toWei('1', 'ether'))

            // check logs to ensure events emitted with correct data
            const events = result.logs[0].args
            assert.equal(events.account, investor)
            assert.equal(events.token, token.address)
            assert.equal(events.amount.toString(), tokens('100').toString())
            assert.equal(events.rate.toString(), '100')
        })
    })

    describe('SellTokens()', async () => {
        let result

        before(async () => {
            // Investor must approve token before the purchase
            await token.approve(ethSwap.address, tokens('100'), { from: investor })

            // Investor sells tokens
            result = await ethSwap.sellTokens(tokens('100'), { from: investor })
        })

        it('Allows user to instantly sell tokens to ethswap for a fixed price', async () => {
            // check investor balance after purchase
            let investorBalance = await token.balanceOf(investor)
            assert.equal(investorBalance.toString(), tokens('0'))

            // check ethSwap balance after purchase
            let ethSwapBalance
            ethSwapBalance = await token.balanceOf(ethSwap.address)
            assert.equal(ethSwapBalance.toString(), tokens('1000000'))
            ethSwapBalance = await web3.eth.getBalance(ethSwap.address)
            assert.equal(ethSwapBalance.toString(), web3.utils.toWei('0', 'ether'))

            // check logs to ensure events emmited with correct data
            const events = result.logs[0].args;
            assert.equal(events.account, investor)
            assert.equal(events.token, token.address)
            assert.equal(events.amount.toString(), tokens('100').toString())
            assert.equal(events.rate.toString(), '100')

            // FAILIRE: Investor cant sell more tokens than they have
            await ethSwap.sellTokens(tokens('500'), { from: investor }).should.be.rejected;
        })
    })
})