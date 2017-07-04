const ECVerify = artifacts.require("./protocol/Utils/ECVerify.sol");
const testutils = require("../testutils.js");



/* Paintfu topic, relevant links:

https://github.com/paritytech/parity/issues/5490
https://ethereum.stackexchange.com/questions/15364/totally-baffled-by-ecrecover
https://ethereum.stackexchange.com/questions/2171/how-does-one-properly-use-ecrecover-to-verify-ethereum-signatures
https://github.com/ethereum/web3.js/issues/392
https://github.com/paritytech/parity/issues/5568
https://github.com/paritytech/parity/issues/5431
https://etherchain.org/verify/signature
https://gist.github.com/axic/5b33912c6f61ae6fd96d6c4a47afde6d
https://github.com/obscuren/ethmail/blob/master/client/ethmail.js
*/
contract('ECVerify', function(accounts) {

    it("should sign transaction (works with testrpc only)", async () => {
        var sha; var r; var s; var v;
        let text = "example";
        let ecverify = await ECVerify.new();
        [sha, v, r, s] = await testutils.signString(web3, accounts[0], text);
        let hash = web3.sha3("\x19Ethereum Signed Message:\n" + text.length + text);
        var result = await ecverify.verify(hash, v, r, s);        
        assert.isOk(await ecverify.isCorrect(hash, v, r, s, accounts[0]));
    });

});