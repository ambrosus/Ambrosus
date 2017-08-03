'use strict';

class Offer {
  
  constructor(params) {   
    if (params) {
      Object.assign(this, params);
    }
  }
}

module.exports = Offer;
