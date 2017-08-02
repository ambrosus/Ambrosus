const Amber = artifacts.require("./Amber.sol");
const agreementArtifacts = artifacts.require('./protocol/Agreement/EscrowedAgreement.sol');
const Agreement = require('../../lib/Agreement');


contract('Delivery Interface', function(accounts) {
  var delivery, amber;

  let testOffer = {
    name: 'AAA',
    origin: 'BBB',
    category: 'Fish',
    packageWeight: 200,
    pricePerUnit: 100,
    pricePerPackage: 200,
    imageHash: 'QmVPMUYVooLw9XRgEWFnKZLyaZeWBM18EX7X3g6hrQBDqB',
    seller: web3.eth.accounts[1],
    measurementsAddress: accounts[1],
    requirementsAddress: accounts[1],
  };

  beforeEach(async () => {

    agreement = new Agreement(testOffer, 3, agreementArtifacts, Amber);
    let result = await web3.eth.getBlock('earliest');
    let startTime = result.timestamp;
    amber = await Amber.new(startTime, startTime);
    await amber.mintLiquidToken(web3.eth.accounts[0], 1000);
  });

  it('should escrow', async () => {
    var agreementContract = await agreement.initiateAgreement(amber.address);

    assert.equal(await amber.balanceOf(accounts[0]), 400);
    assert.equal(await amber.balanceOf(agreementContract.address), 600);
  });

  it('should accept agreement', async () => {
    var agreementContract = await agreement.initiateAgreement(amber.address);
    await agreement.accept(agreementContract);

    assert.equal(await amber.balanceOf(accounts[0]), 400);
    assert.equal(await amber.balanceOf(accounts[1]), 600);
  });

  it('should reject agreement', async () => {
    var agreementContract = await agreement.initiateAgreement(amber.address);
    await agreement.reject(agreementContract);

    assert.equal(await amber.balanceOf(accounts[0]), 1000);
    assert.equal(await amber.balanceOf(accounts[1]), 0);
  });
});