const { assert } = require("console");
const { it } = require("node:test");

const myToken = artifacts.require("MyToken");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("MyToken", function (accounts) {
  it("should assert true", async function () {
    await myToken.deployed();
    return assert.isTrue(true);
  });

  it("should return total supply of 1000", async function () {
    const instance = await myToken.deployed();
    const totalSupply = await instance.totalSupply();
    return assert.equal(totalSupply, 40e6 * 1e18);
  })

  it("should transfer 0.1% total supply to account 1", async function () {
    const instance = await myToken.deployed();
    await instance.transfer(accounts[1], 40e6 * 1e18 * 0.001);

    const balanceAccount0 = await instance.balanceOf(accounts[0]);
    const balanceAccount1 = await instance.balanceOf(accounts[1]);

    assert.equal(balanceAccount0.toNumber(), 40e6 * 1e18 * 0.999);
    assert.equal(balanceAccount1.toNumber(), 40e6 * 1e18 * 0.001);
  })
});
