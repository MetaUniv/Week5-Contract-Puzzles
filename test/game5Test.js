const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { assert } = require('chai');

describe('Game5', function () {
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory('Game5');
    const game = await Game.deploy();

    
    return { game };
  }

  async function getWinnerAddress() {
    const threshold = "0x00FfFFfFFFfFFFFFfFfFfffFFFfffFfFffFfFFFf";
    let winnerAddress;

    while (!winnerAddress) {
      const wallet = ethers.Wallet.createRandom().connect(ethers.provider);
      const address = await wallet.getAddress();

      if (address < threshold) {
        winnerAddress = address;
        // Send Ether to the winner address to cover gas fees
        const [signer] = await ethers.getSigners();
        await signer.sendTransaction({
          to: winnerAddress,
          value: ethers.utils.parseEther("1.0"), // Sends exactly 1.0 ether
        });
        return wallet;
      }
    }
  }


  it('should be a winner', async function () {
    const { game,wallet } = await loadFixture(deployContractAndSetVariables);
    const winnerWallet = await getWinnerAddress();
    console.log(`Winner address found: ${winnerWallet.address}`);
    
    // good luck

    await game.connect(wallet).win();

    // leave this assertion as-is
    assert(await game.isWon(), 'You did not win the game');
  });
});
