const MetaCoin = artifacts.require("MyToken");

contract("MyToken", (accounts) => {
    it("should create more than one million total supply", async () => {
        const myTokenInstance = await MyToken.deployed();
        const balance = await myTokenInstance.getBalance.call(accounts[0]);

        assert.equal(balance.valueOf(), 40e6 * 1e18, "40e6 * 1e18 wasn't in the first account");
    });
});
