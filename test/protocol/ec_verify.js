const ECVerify = artifacts.require("./protocol/Utils/ECVerify.sol");
const testutils = require("../testutils.js");



/* Paintfu topic, relevant links:

https://github.com/paritytech/parity/issues/5490
https://ethereum.stackexchange.com/questions/15364/totally-baffled-by-ecrecover
*/
contract('ECVerify', function(accounts) {

    it("should sign transaction (works with testrpc only)", async () => {
        var sha; var r; var s; var v;
        let text = "dupa";
        let ecverify = await ECVerify.new();
        [sha, v, r, s] = await testutils.signString(web3, accounts[0], text);
        var result = await ecverify.verify(sha, v, r, s);        
        assert.equal(result, accounts[0]);
        assert.isOk(await ecverify.isCorrect(sha, v, r, s, accounts[0]));
    });

});