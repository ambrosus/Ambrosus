const utils = require('../../lib/web3-utils');

contract('Utils', function(accounts) {

  it('convert number to bignum and back', () => {
    var bignum = utils.toBigNumberWithDecimals(12.3, 2);
    var number = utils.fromBigNumberWithDecimals(bignum, 2);
    assert.equal(bignum, 1230);
    assert.equal(number, 12.3);
  });

  it('check errors', () => {
    assert.throws(()=>utils.toBigNumberWithDecimals(12.412, 2), RangeError);
    assert.throws(()=>utils.toBigNumberWithDecimals(12, 2.2), TypeError);
    assert.throws(()=>utils.toBigNumberWithDecimals(12, "2.2"), TypeError);
    assert.throws(()=>utils.toBigNumberWithDecimals(12, -3), TypeError);
    assert.throws(()=>utils.toBigNumberWithDecimals(12, "-3"), TypeError);
  });

  it('string and bignum to bignum', () => {
    var bignum = utils.toBigNumberWithDecimals("12.3", '2');
    var bigbignum = utils.toBigNumberWithDecimals(bignum);
    var biggernum = utils.toBigNumberWithDecimals(bignum, 1);
    assert.equal(bignum, 1230);
    assert.deepEqual(bignum, bigbignum);
    assert.deepEqual(bignum.times(10), biggernum);
  });
});