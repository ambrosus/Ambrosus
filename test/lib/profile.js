const MarketRepository = require('../../lib/MarketRepository.js');
const ProfileRepository = require('../../lib/ProfileRepository.js');


contract('Profile Interface', function(accounts) {

  it('gets my profile from market', async () => {
    var market = await new MarketRepository().create();
    var profile = await new ProfileRepository().getMyProfileFromMarket(market.getAddress());
    assert.isOk(profile.profileContract);
  });
});