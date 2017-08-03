const promisify = require("es6-promisify");

class Requirements {

  constructor(contract) {
    this.contract = contract;
  }

  getAddress() {
    return this.contract.address;
  }

  async getAttributes() {
    let count = await promisify(this.contract.getAttributesLength)();
    let attrs = [];
    for (var i = 0; i < count; i++) {
      var attr = await promisify(this.contract.getAttribute)(i);
      attrs.push({
        id: web3.toUtf8(attr[0]),
        type: web3.toDecimal(attr[1]),
        decimals: web3.toDecimal(attr[2]),
        min: web3.toDecimal(attr[3]),
        max: web3.toDecimal(attr[4])
      });
    }
    return attrs;
  }

  async getAttributeById(id) {
    var attr = await promisify(this.contract.getAttributeById)(id);
    return {
      id: web3.toUtf8(attr[0]),
      type: web3.toDecimal(attr[1]),
      decimals: web3.toDecimal(attr[2]),
      min: web3.toDecimal(attr[3]),
      max: web3.toDecimal(attr[4])
    }
  }
}

module.exports = Requirements;