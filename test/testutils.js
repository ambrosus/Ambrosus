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

exports.send = function(method, params, callback) {
  if (typeof params === 'function') {
    callback = params;
    params = [];
  }

  web3.currentProvider.sendAsync({
    jsonrpc: '2.0',
    method,
    params: params || [],
    id: new Date().getTime(),
  }, callback);
}

exports.increaseTime = function(time_shift, done) {
    web3.eth.getBlock('latest', (err, result) => {
      this.send('evm_increaseTime', [time_shift - result.timestamp], (err, result) => {
        assert.equal(err, null);
        this.send('evm_mine', [], (err, result) => {
          assert.equal(err, null);
          done();
        });
      });
    });
}

exports.assertThrows = function(body) {
  return new Promise( (resolve, reject) => {
    body()
    .then( () => { assert.fail(false,true, "Expected to throw an exception."); })
    .catch( () => { resolve(); });
  });
}


exports.signString = async function(web3, account, text) {
  let sha = web3.fromUtf8(text);
  var sig = await web3.eth.sign(account, sha);
  sig = sig.substr(2, 130);
  let r = "0x" + sig.substr(0, 64);
  let s = "0x" + sig.substr(64, 64);
  var v = web3.toDecimal('0x'+sig.substr(128, 2));        
  if (v!=27 && v!=28) v+=27;
  v = web3.toHex(v);
  return [sha, v, r, s];
}
