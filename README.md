[![Build Status](https://travis-ci.org/qualisuch/Qualit.svg?branch=master)](https://travis-ci.org/qualisuch/Qualit)

# Ambrosus protocol

This repository contains smart contracts constituting Qualisuch protocol, in particular:
- Amber - ERC20 Token representing powering Ambrosus protocol
- ICO Contribution contract
- Smart contracts constituting Ambrosus protocol.

## Installation and testing

1. Clone repository
    ```
    git clone git@github.com:ambrosus/Qualit.git
    cd Qualit
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


