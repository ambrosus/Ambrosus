const IPFS = require('ipfs');
const MeasurementsStorage = require("../lib/MeasurementsStorage.js");
const IPFSStorage = require("../lib/IPFSStorage.js");
const Measurement = require("../lib/Measurement.js");
const assert = require('assert')

describe('MeasurementsStorage', function() {

    let measurement1 = new Measurement("Volume", 22, "delivery", 1491848127, "fmr01", "bch01", '0xa123a');
    let measurement2 = new Measurement("Color", 777, "shipping", 1491848135, "fmr02", "bch02", '0x12345678');
    var ipfs;
    

    it("should save and restore measurements",  (done) => {
        ipfs = new IPFS();
        ipfs.on('ready', async () => {
            var storage = new MeasurementsStorage(new IPFSStorage(ipfs));

            await storage.addMeasurement(measurement1);
            await storage.addMeasurement(measurement1);
            await storage.addMeasurement(measurement2);

            var measurements = await storage.getMeasurements();
            assert.deepEqual(measurements.sort(), [measurement1,measurement1,measurement2].sort());

            ipfs.stop(()=>done());            
        });
        
    });

    it("should return empty array",  (done) => {
        ipfs = new IPFS();
        ipfs.on('ready', async () => {
            var storage = new MeasurementsStorage(new IPFSStorage(ipfs));  

            var measurements = await storage.getMeasurements();                                
            await storage.storage.createCatalog();

            assert.deepEqual(measurements, []);
            assert.deepEqual(await storage.getMeasurements(), []);

            ipfs.stop(done);            
        });
        
    });

    it("should keep measurements", (done) => {
        ipfs = new IPFS();
        ipfs.on('ready', async () => {
            var ipfsStorage = new IPFSStorage(ipfs);
            var storage = new MeasurementsStorage(ipfsStorage);

            await storage.addMeasurement(measurement1);
            await storage.addMeasurement(measurement1);
            await storage.addMeasurement(measurement2);

            await ipfsStorage.retreiveCatalogFromHash(ipfsStorage.getCatalogHash());
            var measurements = await new MeasurementsStorage(ipfsStorage).getMeasurements();

            assert.deepEqual(measurements.sort(), [measurement1,measurement1,measurement2].sort()); 

            ipfs.stop(done);
        });
        
    });
});

describe('IPFSStorage', function() {

    it("adding to catalog", (done) => {
        var ipfs = new IPFS();

        ipfs.on('ready', async () => {
            var m = new IPFSStorage(ipfs);
            await m.createCatalog();
            
            var hash1 = await m.addFile('test');
            var hash2 = await m.addFile('test2');
            var links = m.ls();
            var data = await m.readAllData();

            assert.equal(links.length, 2);
            assert.equal(data.length, 2);
            assert.deepEqual(data.sort(), ['test', 'test2']);
            assert.deepEqual(links.map((l)=>l.multihash).sort(), [hash1,hash2].sort());

            ipfs.stop(done);
        });
        
    });

});
