const IPFS = require('ipfs');
const IPFSMap = require("../lib/IPFSMap.js");
const assert = require('assert')


describe('IPFSMap', function() {

    it("add an element", (done) => {
        var ipfs = new IPFS();
        ipfs.on('ready', async () => {
            var map = await IPFSMap.create(ipfs);
            var hash1 = await map.add('test');
            var hash2 = await map.add('test2');
            var links = map.keys();
            var data = await map.values();

            assert.equal(links.length, 2);
            assert.equal(data.length, 2);
            assert.deepEqual(data.sort(), ['test', 'test2']);
            assert.deepEqual(links.map((l)=>l.multihash).sort(), [hash1,hash2].sort());

            ipfs.stop(done);
        });        
    });
});
