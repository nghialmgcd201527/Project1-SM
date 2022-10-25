const { assert } = require("console");
const { it } = require("node:test");

const { time } = require("@openzeppelin/test-helpers");
const { web3 } = require("@openzeppelin/test-helpers/src/setup");

const bnChai = require('bn-chai');
const expect = require('chai')
  .use(bnChai(web3.utils.BN))
  .expect;

const myToken = artifacts.require("MyToken");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("MyToken", function (accounts) {
  const remainingAmount = web3.utils.toWei(web3.utils.toBN(40e6 * 1e18 * 0.02));
  let releasePeriod = web3.utils.toBN(30 * 24 * 60 * 60);
  it("should assert true", async function () {
    await myToken.deployed();
    return assert.isTrue(true);
  });

  it("should return total supply of 1000", async function () {
    const instance = await myToken.deployed();
    const totalSupply = await instance.totalSupply();
    return assert.equal(totalSupply, 40e6 * 1e18);
  })

  it("should transfer 0.1% total supply to account 1 at TGE", async function () {
    const instance = await myToken.deployed();
    await instance.transfer(accounts[1], 40e6 * 1e18 * 0.001);

    const balanceAccount0 = await instance.balanceOf(accounts[0]);
    const balanceAccount1 = await instance.balanceOf(accounts[1]);

    assert.equal(balanceAccount0.toNumber(), 40e6 * 1e18 * 0.999);
    assert.equal(balanceAccount1.toNumber(), 40e6 * 1e18 * 0.001);
  })

  it("check the balance after releasing by owner", async function () {
    const token = await MyToken.deployed();
    let owner = accounts[0];
    let balanceBeforeRelease = await token.balance();
    await token.release();
    let balanceAfterRelease = await token.balance();
    assert.equal(balanceBeforeRelease.toNumber(), owner.balance.toNumber());
    assert.equal(balanceAfterRelease.toNumber(), 0);
  })

  it('checking balance', async () => {
    const token = await MyToken.deployed();
    let owner = accounts[0];

    await token.transfer(accounts[1].address, remainingAmount, { from: owner });

    const remaining = await account[1].remainingAmount.call();
    expect(remaining).to.eq.BN(remainingAmount);

  });

  it('release', async () => {
    const token = await MyToken.deployed();
    let owner = accounts[0];

    await time.increase(releasePeriod);

    let count = 0;
    let balance = await token.balance.call();
    while (balance > 0) {
      count++;

      beforeBalance = await token.balanceOf.call(owner);
      await token.release({ from: owner });
      afterBalance = await token.balanceOf.call(owner);

      await time.increase(releasePeriod);
      balance = await token.balance.call();
      console.log(count, balance.toString(), afterBalance.sub(beforeBalance).toString());
    }

    balance = await token.balance.call();
    expect(balance).to.eq.BN(web3.utils.toBN(0));
  });
});
