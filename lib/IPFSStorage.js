const IPFS = require('ipfs');
const Buffer = require('safe-buffer').Buffer;



class IPFSStorage {

	constructor(_ipfs, _catalog){
		this.node = _ipfs;
		this.catalog = _catalog;
	}

	async retreiveCatalogFromHash(hash){
		this.catalog = await this.node.object.get(hash);
	}

	getCatalogHash(){
		return this.catalog.toJSON().multihash;
	}

	async createCatalog(){
		this.catalog = await this.node.object.put({
			Data:Buffer.from(''), 
			Links:[]
		});
	}

	async addFile(fileContent){
		var newDAG = await this.node.object.put({
			Data: Buffer.from(fileContent),
			Links: []
		});

	    this.catalog = await this.node.object.patch.addLink(this.catalog.multihash, {			
			size: newDAG.toJSON().size,
			multihash: newDAG.toJSON().multihash
		});
        return newDAG.toJSON().multihash;
	}

	ls(){
		return this.catalog.toJSON().links;
	}

	async readAllData(hash) {
		var data=[];
		var ls = await this.ls();
		for (var i = 0; i < ls.length; i++) {
			data.push((await this.node.object.data(ls[i].multihash)).toString());
		}
		return data;
	}
}

module.exports = IPFSStorage;