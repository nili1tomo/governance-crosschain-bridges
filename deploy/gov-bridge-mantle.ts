import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { ADDRESSES, CONSTANTS } from '../helpers/gov-constants';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  log(`Deployer: ${deployer}\n`);

  const mantleGov = await deployments.getOrNull('MantleGov');

  if (mantleGov) {
    log(`Reusing mantle governance at: ${mantleGov.address}`);
  } else {
    await deploy('mantleGov', {
      args: [
        ADDRESSES['BVM_L2_MESSENGER'],
        ADDRESSES['ETHEREUM_GOV_EXECUTOR'],
        CONSTANTS['DELAY'],
        CONSTANTS['GRACE_PERIOD'],
        CONSTANTS['MIN_DELAY'],
        CONSTANTS['MAX_DELAY'],
        ADDRESSES['BVM_GUARDIAN'],
      ],
      contract: 'MantleBridgeExecutor',
      from: deployer,
      log: true,
    });
  }
};

export default func;
func.dependencies = [];
func.tags = ['MantleGov'];
