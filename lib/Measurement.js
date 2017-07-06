const abi = require("./ABI.js");
const utils = require('ethereumjs-util');
const web3_utils = require('./web3-utils.js')

class Measurement {

    constructor(_attribute_id, _value, _event_id, _timestamp, _farmer_id, _batch_id, _device) {
        this.attribute_id = _attribute_id;
        this.value = _value;
        this.event_id = _event_id;
        this.timestamp = _timestamp;
        this.farmer_id = _farmer_id;
        this.batch_id = _batch_id;
        this.device = _device;
    }

    async signedHash() {        
        const TYPES = [ "bytes32", "int", "bytes32", "uint", "bytes32", "bytes32", "address" ];
        let values = [ this.attribute_id, this.value, this.event_id, this.timestamp, this.farmer_id, this.batch_id, this.device];
        return await this.signWithNode(abi.soliditySHA3(TYPES, values).toString('hex'), this.device);
    }


    async signWithNode(text, device){
        var sha; var r; var s; var v;
        let hash = '0x' + abi.soliditySHA3(['string', 'bytes32'],['\x19Ethereum Signed Message:\n32', '0x' + text]).toString('hex');
        [sha, v, r, s] = await web3_utils.signHex(web3, device, '0x'+text);
        return [hash, v, r, s];
    }

    async encode() {
        const TYPES = [ "bytes32", "int", "bytes32", "uint", "bytes32", "bytes32", "address", "bytes32", "uint", "bytes32", "bytes32" ];      
        let values = [ this.attribute_id, this.value, this.event_id, this.timestamp, this.farmer_id, this.batch_id, this.device].concat(await this.signedHash());    
        return TYPES.map( (type, i) => this.normalizeLength(values[i], type));
    }

    normalizeLength(value, type){
        if (type=="address"){
            return "0x" + utils.setLengthLeft(value, 32).toString('hex');
        } else {
            return "0x" + abi.solidityPack([type], [value]).toString('hex');
        }
    }

    static async encodeMultiple(measurements) {
        // can't use map with async function
        // return (await measurements.map(async (m) =>await m.encode())).reduce((a, b) => a.concat(b), []);
        var tab = [];
        for (var i = 0; i < measurements.length; i++) {
            tab.push(await measurements[i].encode());
        }
        return tab.reduce((a, b) => a.concat(b), []);
    }
}

module.exports = Measurement