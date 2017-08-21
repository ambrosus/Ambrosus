exports = module.exports = {};

exports.signHex = async(web3, account, shaAsHex) => {
  var sig = await web3.eth.sign(account, shaAsHex);
  sig = sig.substr(2, 130);
  var v = web3.toDecimal('0x' + sig.substr(128, 2));
  let r = "0x" + sig.substr(0, 64);
  let s = "0x" + sig.substr(64, 64);
  if (v != 27 && v != 28) v += 27;
  v = web3.toHex(v);
  return [shaAsHex, v, r, s];
}

exports.signString = async function(web3, account, text) {
  let sha = web3.fromUtf8(text);
  var sig = await web3.eth.sign(account, sha);
  sig = sig.substr(2, 130);
  var v = web3.toDecimal('0x' + sig.substr(128, 2));
  let r = "0x" + sig.substr(0, 64);
  let s = "0x" + sig.substr(64, 64);
  if (v != 27 && v != 28) v += 27;
  v = web3.toHex(v);
  return [sha, v, r, s];
}

const CHECK_TRANSACTION_STATUS_TIME = 300;
const ERROR_MSG = "Transaction failed. Check if you have enough resources";

exports.waitForTransaction = function(tx, gasLimit) {

  function checkStatus(tx, resolve, reject) {
    web3.eth.getTransaction(tx, function(error, transaction) {
      if (error) {
        reject(error);
      } else if (transaction.blockHash) {
        web3.eth.getTransactionReceipt(tx, (error, transaction) => {
          if (error) {
            reject(error);
          } else if (transaction.logs.length == 0) {
            reject(ERROR_MSG);
          } else {
            resolve(tx);
          }
        });
      } else {
        setTimeout(() => checkStatus(tx, resolve, reject), CHECK_TRANSACTION_STATUS_TIME);
      }
    });
  }

  return new Promise(function(resolve, reject) {
    checkStatus(tx, resolve, reject);
  });

}

exports.toBigNumberWithDecimals = (number, decimalPlaces=0) => {
  if (!Number.isInteger(decimalPlaces) || decimalPlaces < 0) {
    throw new TypeError("decimalPlaces should be non negative integer");
  }
  var bignum = new web3.BigNumber(number).times(new web3.BigNumber(10).pow(decimalPlaces));
  if (!bignum.isInteger())
    throw new RangeError("Conversion to BigNumber requires higher precision than " + decimalPlaces + " decimal places");
  return bignum;
}

exports.fromBigNumberWithDecimals = (bigNumber, decimalPlaces=0) => {
  return bigNumber.div(new web3.BigNumber(10).pow(decimalPlaces)).toNumber();
}

