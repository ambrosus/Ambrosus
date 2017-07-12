module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    }
  },
  mocha:{
  	files:{
  		rootDirectory: 'mocha-test'

  	}
  }
};
