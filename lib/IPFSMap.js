const IPFS = require('ipfs');
const Buffer = require('safe-buffer').Buffer;

class IPFSMap {

	constructor(_ipfs, _ipfsObject){
		this.node = _ipfs;
		this.catalog = _ipfsObject;
	}

	static async create(_ipfs){
		var catalog = await _ipfs.object.put({
			Data: Buffer.from(''), 
			Links: []
		});
		return new IPFSMap(_ipfs, catalog);
	}

	static async createFromHash(_ipfs, _nodeHash){
		var object = await _ipfs.object.get(_nodeHash);
		return new IPFSMap(_ipfs, object);
	}

	getOwnHash(){
		return this.catalog.toJSON().multihash;
	}

	async add(content){
		var newDAG = await this.node.object.put({
			Data: Buffer.from(content),
			Links: []
		});
	  this.catalog = await this.node.object.patch.addLink(this.catalog.multihash, 
	  {			
			size: newDAG.toJSON().size,
			multihash: newDAG.toJSON().multihash,
		});
    return newDAG.toJSON().multihash;
	}

	keys(){
		return this.catalog.toJSON().links;
	}

	async values(hash) {
		var data=[];
		var keys = await this.keys();
		for (var i = 0; i < keys.length; i++) {
			data.push((await this.node.object.data(keys[i].multihash)).toString());
		}
		return data;
	}
}

module.exports = IPFSMap;