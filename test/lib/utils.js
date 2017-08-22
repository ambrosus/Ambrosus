const chai = require('chai');
const utils = require('../../lib/web3-utils');

contract('Utils', function(accounts) {

  it('convert number to bignum and back', () => {
    var bignum = utils.toBigNumberWithDecimals(12.3, 2);
    var number = utils.fromBigNumberWithDecimals(bignum, 2);
    assert.equal(bignum, 1230);
    assert.equal(number, 12.3);
  });

  it('check errors', () => {
    chai.expect(()=>utils.toBigNumberWithDecimals(12.412, 2)).to.throw(RangeError);
    chai.expect(()=>utils.toBigNumberWithDecimals(12, 2.2)).to.throw(TypeError);
    chai.expect(()=>utils.toBigNumberWithDecimals(12, "2.2")).to.throw(TypeError);
    chai.expect(()=>utils.toBigNumberWithDecimals(12, -3)).to.throw(TypeError);
    chai.expect(()=>utils.toBigNumberWithDecimals(12, "-3")).to.throw(TypeError);
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