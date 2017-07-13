const IPFS = require('ipfs');
const MeasurementsStorage = require("../lib/MeasurementsStorage.js");
const IPFSMap = require("../lib/IPFSMap.js");
const Measurement = require("../lib/Measurement.js");
const assert = require('assert')

describe('MeasurementsStorage', function() {

    let measurement1 = new Measurement("Volume", 22, "delivery", 1491848127, "fmr01", "bch01", '0xa123a');
    let measurement2 = new Measurement("Color", 777, "shipping", 1491848135, "fmr02", "bch02", '0x12345678');
    var ipfs;
    
    beforeEach(()=>ipfs = new IPFS());    

    it("should save and restore measurements",  (done) => {
        ipfs.on('ready', async () => {
            var storage = new MeasurementsStorage(await IPFSMap.create(ipfs));

            await storage.addMeasurement(measurement1);
            await storage.addMeasurement(measurement1);
            await storage.addMeasurement(measurement2);
            var measurements = await storage.doGetMeasurements();
            var expected = [measurement1,measurement1,measurement2].sort();

            assert.deepEqual(measurements.sort(), expected);

            ipfs.stop(done);            
        });
        
    });

    it("should return empty array",  (done) => {
        ipfs.on('ready', async () => {
            var storage = new MeasurementsStorage(IPFSMap.create(ipfs));

            var measurements = await storage.doGetMeasurements();                                
            
            assert.deepEqual(measurements, []);

            ipfs.stop(done);            
        });
        
    });

    it("Should get IPFSMap from own hash", (done) => {
        ipfs.on('ready', async () => {
            var ipfsMap = await IPFSMap.create(ipfs);
            var storage = new MeasurementsStorage(ipfsMap);

            await storage.addMeasurement(measurement1);
            await storage.addMeasurement(measurement1);
            await storage.addMeasurement(measurement2);
            ipfsMap = await IPFSMap.createFromHash(ipfs, ipfsMap.getOwnHash());
            var measurements = await new MeasurementsStorage(ipfsMap).doGetMeasurements();
            var expected = [measurement1,measurement1,measurement2].sort();

            assert.deepEqual(measurements.sort(), expected);

            ipfs.stop(done);
        });
        
    });
});
