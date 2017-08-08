const Token = artifacts.require("./protocol/Utils/MockToken.sol");
const TokenSingleton = require('../../lib/TokenSingleton.js');


contract('Token Interface', function(accounts) {

  it('should create token', async () => {
    var token = await new TokenSingleton(Token).create([accounts[0],accounts[1]],[10,123]);

    assert.equal(await token.balanceOf(accounts[0]), 10);
    assert.equal(await token.balanceOf(accounts[1]), 123);
  });
});