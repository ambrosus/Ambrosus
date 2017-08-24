const MarketRepository = require('../../lib/MarketRepository.js');
const ProfileRepository = require('../../lib/ProfileRepository.js');


contract('Profile Interface', function(accounts) {

  it('gets my profile from market', async () => {
    var market = await new MarketRepository().create();
    var profile = await new ProfileRepository().getMyProfileFromMarket(market.getAddress());
    assert.isOk(profile.profileContract);
  });

  it('should change username', async () => {
    var market = await new MarketRepository().create();
    await new ProfileRepository().setUserName(market.getAddress(), "Name1");
    var profile = await new ProfileRepository().getMyProfileFromMarket(market.getAddress());
    assert.equal(await profile.getUserName(), "Name1");
    await new ProfileRepository().setUserName(market.getAddress(), "Name2");
    assert.equal(await profile.getUserName(), "Name2");

  });

  it('unicode name', async () => {
    var market = await new MarketRepository().create();
    await new ProfileRepository().setUserName(market.getAddress(), "😀😀ЙЦ漢字");
    var profile = await new ProfileRepository().getMyProfileFromMarket(market.getAddress());
    assert.equal(await profile.getUserName(), "😀😀ЙЦ漢字");
  })
});
