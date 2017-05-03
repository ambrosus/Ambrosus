"use strict";

const FoodToken = artifacts.require("./FoodToken.sol");
const Contribution = artifacts.require("./Contribution.sol");
const assert = require('assert');
const testutils = require("./testutils.js");
const BigNumber = require('bignumber.js');

let contribution;
let foodToken;

contract('Contribiution', function(accounts) {

    const FOUNDER = "0x0000000000000000000000000000000000000001";
    const FOUNDER_STAKE = 1000;

    let startTime;
    let endTime;

    before('Init contracts', (done) => { 
        Contribution.deployed().then((deployed) => { 
            contribution = deployed;
            return contribution.foodToken()
        }).then((address) => {
            foodToken = FoodToken.at(address);
        }).then(done);
    });

    describe('DEPLOYMENT', () => {
        it ("preallocated tokens", () => {
            foodToken.preallocatedBalanceOf(FOUNDER).then( (balance) => {
                assert.equal(FOUNDER_STAKE, balance);
            })
        });

        it ("non-minter can't preallocate tokens", (done) => {
            testutils.expectedExceptionPromise( () => {
                return foodToken.preallocateToken.sendTransaction(FOUNDER, FOUNDER_STAKE, {gas: 4000000});
            }, 4000000).then(done);
        });
        
        it ("can't unlock prealoccated funds", (done) => {
            testutils.expectedExceptionPromise( () => {
                return foodToken.unlockBalance.sendTransaction(FOUNDER, {gas: 4000000});
            }, 4000000).then(done);
        });

        xit ("can't allocate above limit");
        xit ("minter preallocate tokens", () => {
            foodToken.preallocateToken.sendTransaction("0x0000000000000000000000000000000000000002", 2000, {gas: 4000000, from: Contribution.address});
        });
        xit ("can't allocate above limit");
    });

    describe('AFTER THAWING PERIOD', () => {
        it ("unlock preallocated funds", (done) => {
            foodToken.balanceOf(FOUNDER_STAKE)
              .then((balance) => {
                assert.equal(0, balance);
                return foodToken.unlockBalance(FOUNDER);
            }).then( () => {
                return foodToken.preallocatedBalanceOf(FOUNDER);
            }).then( (balance) => {
                assert.equal(0, balance);
            }).then( () => {
                return foodToken.balanceOf(FOUNDER);
            }).then( (balance) => {
                assert.equal(FOUNDER_STAKE, balance);
            }).then(done);
        });
    });

});
