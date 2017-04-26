"use strict";

const DeliveryContract = artifacts.require("./DeliveryContract.sol");
const FoodToken = artifacts.require("./FoodToken.sol");
const assert = require('assert');
//const testutils = require("./testutils.js");
const BigNumber = require('bignumber.js');

let delivery;

let token;

function setup(accounts) {
  DeliveryContract.deployed("The Name", "The Code").then((deployed) => delivery = deployed );
  FoodToken.deployed().then((deployed) => token = deployed);
}

contract('DeliveryContract', function(accounts) {
  before('Init contracts', (done) => { setup(accounts); done(); });

  it("should listen to state machine", (done) => {

    delivery.enable_state_machine()
    .then(() => {
        delivery.state_machine_is_active()
      .then((result) => {
        assert.equal(result, true);
      })
      .then(() => {
        // Test New state is enforced.
        delivery.state_machine_is_active().then((result) => {
          console.log(result);
        });
        delivery.stage().then((result) => {
          console.log(result["c"][0]);
        });
        delivery.inviteParticipants([accounts[1], accounts[2]], [33, 67])
        .then(() => {
          delivery.getParticipants()
          .then((result) => {
            assert.equal(result[0].length, 0); // I.E. nothing was found [ [], [] ]
          });
        })

        // Test HasAttribute is enforced.
        .then(() => {
          return delivery.setAttributes(["Volume", "Color"], [22, 768], [24, 786])
          .then(() => {
            delivery.stage().then((result) => {
              assert.equal(result["c"][0], 1);
            });
          })
          .then(() => {
            return delivery.inviteParticipants([accounts[1], accounts[2]], [33, 67]);
          });
        })
        .then(() => {
          return delivery.getParticipants();
        })
        .then((result) => {
          console.log(result);
        });

        

      });
    }).then(done);

  });
});

