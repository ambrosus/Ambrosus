exports = module.exports = {};

exports.signHex = async (web3, account, shaAsHex)=>{
    var sig = await web3.eth.sign(account, shaAsHex);
    sig = sig.substr(2, 130);
    var v = web3.toDecimal('0x'+sig.substr(128, 2));        
    let r = "0x" + sig.substr(0, 64);
    let s = "0x" + sig.substr(64, 64);
    if (v!=27 && v!=28) v+=27;
    v = web3.toHex(v);
    return [shaAsHex, v, r, s];
}

exports.signString = async function(web3, account, text) {
  let sha = web3.fromUtf8(text);
  var sig = await web3.eth.sign(account, sha);
  sig = sig.substr(2, 130);
  var v = web3.toDecimal('0x'+sig.substr(128, 2));        
  let r = "0x" + sig.substr(0, 64);
  let s = "0x" + sig.substr(64, 64);
  if (v!=27 && v!=28) v+=27;
  v = web3.toHex(v);
  return [sha, v, r, s];
}

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
