exports = module.exports = {};

exports.byte32toAscii = function(aString) {
  return web3.toAscii(aString).replace(/\0/g, '')
};

exports.byte32ArraytoAsciiArray = function(byte32Array) {
  return byte32Array.map( e => web3.toAscii(e).replace(/\0/g, '') );
};


// Inspired by https://gist.github.com/xavierlepretre/d5583222fde52ddfbc58b7cfa0d2d0a9
exports.expectedExceptionPromise = function (action, gasToUse) {
  return new Promise(function (resolve, reject) {
      try {
        resolve(action());
      } catch(e) {
        reject(e);
      }
    })
    .then(function (txn) {
      // https://gist.github.com/xavierlepretre/88682e871f4ad07be4534ae560692ee6
      return web3.eth.getTransactionReceiptMined(txn);
    })
    .then(function (receipt) {
      // We are in Geth
      assert.equal(receipt.gasUsed, gasToUse, "should have used all the gas");
    })
    .catch(function (e) {
      if ((e + "").indexOf("invalid JUMP") || (e + "").indexOf("out of gas") > -1) {
        // We are in TestRPC
      } else if ((e + "").indexOf("please check your gas amount") > -1) {
        // We are in Geth for a deployment
      } else {
        throw e;
      }
    });
};
