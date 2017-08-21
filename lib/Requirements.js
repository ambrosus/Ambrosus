const promisify = require("es6-promisify");

class Requirements {

  constructor(contract) {
    this.contract = contract;
  }

  getAddress() {
    return this.contract.address;
  }

  async getName() {
    return web3.toUtf8(await promisify(this.contract.name)());
  }

  async getAttributes() {
    let count = await promisify(this.contract.getAttributesLength)();
    let attrs = [];
    for (var i = 0; i < count; i++) {
      var attr = await promisify(this.contract.getAttribute)(i);
      var decimals = web3.toDecimal(attr[2]);
      attrs.push({
        id: web3.toUtf8(attr[0]),
        type: web3.toDecimal(attr[1]),
        decimals: decimals,
        min: web3.toDecimal(attr[3]) / 10**decimals,
        max: web3.toDecimal(attr[4]) / 10**decimals,
      });
    }
    return attrs;
  }

  async getAttributeById(id) {
    var attr = await promisify(this.contract.getAttributeById)(id);
    var decimals = web3.toDecimal(attr[2]);
    return {
      id: web3.toUtf8(attr[0]),
      type: web3.toDecimal(attr[1]),
      decimals: decimals,
      min: web3.toDecimal(attr[3]) / 10**decimals,
      max: web3.toDecimal(attr[4]) / 10**decimals
    }
  }
}

module.exports = Requirements;