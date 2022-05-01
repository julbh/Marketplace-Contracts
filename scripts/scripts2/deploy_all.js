// to deploy locally
// run: npx hardhat node on a terminal
// then run: npx hardhat run --network localhost scripts/12_deploy_all.js
async function main(network) {

    console.log('network: ', network.name);

    const [deployer] = await ethers.getSigners();
    const deployerAddress = await deployer.getAddress();
    console.log(`Deployer's address: `, deployerAddress);
  
    const { TREASURY_ADDRESS, PLATFORM_FEE, REWARD_OWNER_ADDRESS, WRAPPED_ETH_MAINNET, WRAPPED_ETH_TESTNET, REWARDFEE } = require('../constants');
  
    ////////////
    // const Xana = await ethers.getContractFactory('Xana');
    // const xana = await Xana.deploy(REWARD_OWNER_ADDRESS, '2000000000000000000');
  
    // await xana.deployed();  
    // console.log('Xana deployed at', xana.address);
    ///////////

    // const RewardToken = await ethers.getContractFactory('XanaToken');
    // const rewardToken = await RewardToken.deploy();
  
    // await rewardToken.deployed();  
    // console.log('RewardToken deployed at', rewardToken.address);
    // const "0x9b047C59EFc87B10E37eB1562329E10c3D87036B" = rewardToken.address;

    ////////
    // const AddressRegistry = await ethers.getContractFactory('XanaAddressRegistry');
    // const addressRegistry = await AddressRegistry.deploy();

    // await addressRegistry.deployed();

    // console.log('XanaAddressRegistry deployed to', addressRegistry.address);
    // const "0xA219D088Fdd958ED30aF8a9b85c82e188260D237" = addressRegistry.address;
    ////////

    //////////
    // const ProxyAdmin = await ethers.getContractFactory('ProxyAdmin');
    // const proxyAdmin = await ProxyAdmin.deploy();
    // await proxyAdmin.deployed();

    // const PROXY_ADDRESS = proxyAdmin.address;

    // console.log('ProxyAdmin deployed to:', proxyAdmin.address);

    const AdminUpgradeabilityProxyFactory = await ethers.getContractFactory('AdminUpgradeabilityProxy');
    //////////

    /////////
    const Marketplace = await ethers.getContractFactory('XanaMarketplace');
    const marketplaceImpl = await Marketplace.deploy();
    await marketplaceImpl.deployed();

    console.log('XanaMarketplace deployed to:', marketplaceImpl.address);
    
    const marketplaceProxy = await AdminUpgradeabilityProxyFactory.deploy(
        marketplaceImpl.address,
        "0xA219D088Fdd958ED30aF8a9b85c82e188260D237",
        []
    );
    await marketplaceProxy.deployed();
    console.log('Marketplace Proxy deployed at ', marketplaceProxy.address);
    const MARKETPLACE_PROXY_ADDRESS = marketplaceProxy.address;
    const marketplace = await ethers.getContractAt('XanaMarketplace', marketplaceProxy.address);
    
    await marketplace.initialize(TREASURY_ADDRESS, PLATFORM_FEE, "0x9b047C59EFc87B10E37eB1562329E10c3D87036B", REWARD_OWNER_ADDRESS, "0xA219D088Fdd958ED30aF8a9b85c82e188260D237", REWARDFEE);
    console.log('Marketplace Proxy initialized');
    
    /////////

    /////////
    const BundleMarketplace = await ethers.getContractFactory(
        'XanaBundleMarketplace'
      );
    const bundleMarketplaceImpl = await BundleMarketplace.deploy();
    await bundleMarketplaceImpl.deployed();
    console.log('XanaBundleMarketplace deployed to:', bundleMarketplaceImpl.address);
    
    const bundleMarketplaceProxy = await AdminUpgradeabilityProxyFactory.deploy(
        bundleMarketplaceImpl.address,
        "0xA219D088Fdd958ED30aF8a9b85c82e188260D237",
        []
      );
    await bundleMarketplaceProxy.deployed();
    console.log('Bundle Marketplace Proxy deployed at ', bundleMarketplaceProxy.address);  
    const BUNDLE_MARKETPLACE_PROXY_ADDRESS = bundleMarketplaceProxy.address;
    const bundleMarketplace = await ethers.getContractAt('XanaBundleMarketplace', bundleMarketplaceProxy.address);
    
    await bundleMarketplace.initialize(TREASURY_ADDRESS, PLATFORM_FEE, "0x9b047C59EFc87B10E37eB1562329E10c3D87036B", REWARD_OWNER_ADDRESS, "0xA219D088Fdd958ED30aF8a9b85c82e188260D237", REWARDFEE);
    console.log('Bundle Marketplace Proxy initialized');
    
    ////////

    ////////
    const Auction = await ethers.getContractFactory('XanaAuction');
    const auctionImpl = await Auction.deploy();
    await auctionImpl.deployed();
    console.log('XanaAuction deployed to:', auctionImpl.address);

    const auctionProxy = await AdminUpgradeabilityProxyFactory.deploy(
        auctionImpl.address,
        "0xA219D088Fdd958ED30aF8a9b85c82e188260D237",
        []
      );

    await auctionProxy.deployed();
    console.log('Auction Proxy deployed at ', auctionProxy.address);
    const AUCTION_PROXY_ADDRESS = auctionProxy.address;
    const auction = await ethers.getContractAt('XanaAuction', auctionProxy.address);
    
    await auction.initialize(TREASURY_ADDRESS, "0x9b047C59EFc87B10E37eB1562329E10c3D87036B", REWARD_OWNER_ADDRESS, "0xA219D088Fdd958ED30aF8a9b85c82e188260D237", REWARDFEE);
    console.log('Auction Proxy initialized');
   
    ////////

    ////////
    const Factory = await ethers.getContractFactory('XanaNFTFactory');
    const factory = await Factory.deploy(
        AUCTION_PROXY_ADDRESS,
        MARKETPLACE_PROXY_ADDRESS,
        BUNDLE_MARKETPLACE_PROXY_ADDRESS,
        '1000000000000000',
        TREASURY_ADDRESS,
        '5000000000000000'
    );
    await factory.deployed();
    console.log('XanaNFTFactory deployed to:', factory.address);

    const PrivateFactory = await ethers.getContractFactory(
        'XanaNFTFactoryPrivate'
    );
    const privateFactory = await PrivateFactory.deploy(
        AUCTION_PROXY_ADDRESS,
        MARKETPLACE_PROXY_ADDRESS,
        BUNDLE_MARKETPLACE_PROXY_ADDRESS,
        '1000000000000000',
        TREASURY_ADDRESS,
        '5000000000000000'
    );
    await privateFactory.deployed();
    console.log('XanaNFTFactoryPrivate deployed to:', privateFactory.address);
    ////////    

    ////////
    const NFTTradable = await ethers.getContractFactory('XanaNFTTradable');
    const nft = await NFTTradable.deploy(
        'Xana',
        'ART',
        AUCTION_PROXY_ADDRESS,
        MARKETPLACE_PROXY_ADDRESS,
        BUNDLE_MARKETPLACE_PROXY_ADDRESS,
        '1000000000000000',
        TREASURY_ADDRESS
    );
    await nft.deployed();
    console.log('XanaNFTTradable deployed to:', nft.address);

    const NFTTradablePrivate = await ethers.getContractFactory(
        'XanaNFTTradablePrivate'
    );
    const nftPrivate = await NFTTradablePrivate.deploy(
        'IXana',
        'IART',
        AUCTION_PROXY_ADDRESS,
        MARKETPLACE_PROXY_ADDRESS,
        BUNDLE_MARKETPLACE_PROXY_ADDRESS,
        '1000000000000000',
        TREASURY_ADDRESS
    );
    await nftPrivate.deployed();
    console.log('XanaNFTTradablePrivate deployed to:', nftPrivate.address);
    ////////

    ////////
    const TokenRegistry = await ethers.getContractFactory('XanaTokenRegistry');
    const tokenRegistry = await TokenRegistry.deploy();

    await tokenRegistry.deployed();

    console.log('XanaTokenRegistry deployed to', tokenRegistry.address);
    ////////

    ////////
    const PriceFeed = await ethers.getContractFactory('XanaPriceFeed');
    const WRAPPED_ETH = network.name === 'mainnet' ? WRAPPED_ETH_MAINNET : WRAPPED_ETH_TESTNET;
    const priceFeed = await PriceFeed.deploy(
      "0xA219D088Fdd958ED30aF8a9b85c82e188260D237",
      WRAPPED_ETH
    );
  
    await priceFeed.deployed();
  
    console.log('XanaPriceFeed deployed to', priceFeed.address);
    ////////

    ////////
    const ArtTradable = await ethers.getContractFactory('XanaArtTradable');
    const artTradable = await ArtTradable.deploy(
        'XanaArt',
        'FART',
        '2000000000000000',
        TREASURY_ADDRESS,
        MARKETPLACE_PROXY_ADDRESS,
        BUNDLE_MARKETPLACE_PROXY_ADDRESS
    );
    await artTradable.deployed();
    console.log('XanaArtTradable deployed to:', artTradable.address);

    const ArtTradablePrivate = await ethers.getContractFactory(
        'XanaArtTradablePrivate'
    );
    const artTradablePrivate = await ArtTradablePrivate.deploy(
        'XanaArt',
        'FART',
        '2000000000000000',
        TREASURY_ADDRESS,
        MARKETPLACE_PROXY_ADDRESS,
        BUNDLE_MARKETPLACE_PROXY_ADDRESS
    );
    await artTradablePrivate.deployed();
    console.log('XanaArtTradablePrivate deployed to:', artTradablePrivate.address);
    ////////

    ////////
    const ArtFactory = await ethers.getContractFactory('XanaArtFactory');
    const artFactory = await ArtFactory.deploy(
        MARKETPLACE_PROXY_ADDRESS,
        BUNDLE_MARKETPLACE_PROXY_ADDRESS,
        '2000000000000000',
        TREASURY_ADDRESS,
        '1000000000000000'
     );
    await artFactory.deployed();
    console.log('XanaArtFactory deployed to:', artFactory.address);

    const ArtFactoryPrivate = await ethers.getContractFactory(
        'XanaArtFactoryPrivate'
    );
    const artFactoryPrivate = await ArtFactoryPrivate.deploy(
        MARKETPLACE_PROXY_ADDRESS,
        BUNDLE_MARKETPLACE_PROXY_ADDRESS,
        '2000000000000000',
        TREASURY_ADDRESS,
        '1000000000000000'
    );
    await artFactoryPrivate.deployed();
    console.log('XanaArtFactoryPrivate deployed to:', artFactoryPrivate.address);
    ////////
    
    await marketplace.updateAddressRegistry("0xA219D088Fdd958ED30aF8a9b85c82e188260D237");   
    await bundleMarketplace.updateAddressRegistry("0xA219D088Fdd958ED30aF8a9b85c82e188260D237");
    
    await auction.updateAddressRegistry("0xA219D088Fdd958ED30aF8a9b85c82e188260D237");
    
    await addressRegistry.updateXana(xana.address);
    await addressRegistry.updateAuction(auction.address);
    await addressRegistry.updateMarketplace(marketplace.address);
    await addressRegistry.updateBundleMarketplace(bundleMarketplace.address);
    await addressRegistry.updateNFTFactory(factory.address);
    await addressRegistry.updateTokenRegistry(tokenRegistry.address);
    await addressRegistry.updatePriceFeed(priceFeed.address);
    await addressRegistry.updateArtFactory(artFactory.address);   

    await tokenRegistry.add(WRAPPED_ETH);

  }
  
  // We recommend this pattern to be able to use async/await everywhere
  // and properly handle errors.
  main(network)
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
  

