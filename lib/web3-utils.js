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