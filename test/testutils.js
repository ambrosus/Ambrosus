exports = module.exports = {};

exports.byte32toAscii = function(aString) {
  return web3.toAscii(aString).replace(/\0/g, '')
};

exports.byte32ArraytoAsciiArray = function(byte32Array) {
  return byte32Array.map( e => web3.toAscii(e).replace(/\0/g, '') );
};


// Inspired by https://gist.github.com/xavierlepretre/88682e871f4ad07be4534ae560692ee6
// Adjusted for parity
exports.expectedExceptionPromise = function (action, gasToUse) {
  return new Promise(function (resolve, reject) {
      try {
        resolve(action());
      } catch(e) {
        reject(e);
      }
    })
    .then(function (txn) {
      return web3.eth.getTransactionReceipt(txn);
    })
    .then(function (receipt) {
      assert.equal(receipt.gasUsed, gasToUse, "Contract expected to throw an error (use all the gas)");
    })
};
