pragma solidity ^0.4.11;

contract ECVerify {

    function verify(bytes32 _message, uint8 _v, bytes32 _r, bytes32 _s) constant returns (address) {
        return ecrecover(_message, _v, _r, _s);
    }
    
    function isCorrect(bytes32 _message, uint8 _v, bytes32 _r, bytes32 _s, address _address) constant returns (bool) {
        return ecrecover(_message, _v, _r, _s) == _address;
    }
}


