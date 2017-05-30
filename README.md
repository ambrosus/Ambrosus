[![Build Status](https://travis-ci.com/marekkirejczyk/foodtoken.svg?token=xjj4U84eSFwEsYLTc5Qe&branch=master)](https://travis-ci.com/marekkirejczyk/foodtoken)

# FoodCoin

This repository contains smart contracts constituting FoodCoin protocol, in particular:
- FoodCoin - ERC20 Token representing FoodCoin
- Contribution contract
- Delivery Contract, which is a stub for Food Blockchain XYZ protocol to be developed in near future.

## Installation and testing

1. Clone repository
    ```
    git clone git@github.com:foodblockchainxyz/FoodCoin.git
    cd FoodCoin
    ```

2. Install global dependencies, such as [Truffle](https://github.com/ConsenSys/truffle) (requires NodeJS 5.0+) and [Testrpc](https://github.com/ethereumjs/testrpc), then install local dependencies:
    ```
    npm install
	```

3. Before running tests make sure testrpc is up:
    ```
    testrpc
	```

4. Running tests
    ```
    truffle test
	```


## Acknowledgements

Contribution and token contracts have been influenced by the work of [MelonPort](https://github.com/melonproject/melon/) and by [Condition-Orientated Programming](https://medium.com/@gavofyork/condition-orientated-programming-969f6ba0161a) approach.


