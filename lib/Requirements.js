const promisify = require("es6-promisify");
const utils = require('./web3-utils');

class Requirements {

  constructor(contract) {
    this.contract = contract;
  }

  static convertToFormattedAttribute(attribute) {
    let decimals = web3.toDecimal(attribute[2]);
    return {
      id: web3.toUtf8(attribute[0]),
      type: web3.toDecimal(attribute[1]),
      decimals: decimals,
      min: utils.fromBigNumberWithDecimals(attribute[3], decimals),
      max: utils.fromBigNumberWithDecimals(attribute[4], decimals),
    }
  }

  getAddress() {
    return this.contract.address;
  }

  async getName() {
    return web3.toUtf8(await promisify(this.contract.name)());
  }

  async getAttributes() {
    let count = await promisify(this.contract.getAttributesLength)();
    let attributes = [];
    for (var i = 0; i < count; i++) {
      var attr = await promisify(this.contract.getAttribute)(i);
      attributes.push(Requirements.convertToFormattedAttribute(attr));
    }
    return attributes;
  }

  async getAttributeById(id) {
    var attribute = await promisify(this.contract.getAttributeById)(id);
    return Requirements.convertToFormattedAttribute(attribute)
  }
}

module.exports = Requirements;