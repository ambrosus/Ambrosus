const MarketRepository = require('../../lib/MarketRepository.js');
const ProfileRepository = require('../../lib/ProfileRepository.js');


contract('Profile Interface', function(accounts) {

  it('should not fail', async () => {
    var market = await new MarketRepository().create();
    var profile = await new ProfileRepository().getInMarket(market.getAddress());
    assert.isOk(profile.profileContract);
  });
});