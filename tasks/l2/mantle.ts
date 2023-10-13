import { BigNumber } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';
import { task } from 'hardhat/config';
import { ADDRESSES, CONSTANTS } from '../../helpers/gov-constants';

import { DRE } from '../../helpers/misc-utils';
import { eEthereumNetwork, eMantleNetwork } from '../../helpers/types';
import {
  Greeter__factory,
  ICrossDomainMessenger__factory,
  MantleBridgeExecutor__factory,
} from '../../typechain';

task(
  'mantle:initiate-greeting',
  'Queue a greeting in the governance executor on Mantle by transacting on L1'
).setAction(async (_, hre) => {
  await hre.run('set-DRE');

  if (DRE.network.name != eEthereumNetwork.goerli && DRE.network.name != eEthereumNetwork.main) {
    throw new Error('Only applicable on mainnet or goerli where mantle L2 exist');
  }

  const GAS_LIMIT = 1500000;
  const MESSAGE = 'Miguel was also here';

  let BVM_L1_MESSENGER = ADDRESSES['BVM_L1_MESSENGER_MAIN'];
  if (DRE.network.name == eEthereumNetwork.goerli) {
    BVM_L1_MESSENGER = ADDRESSES['BVM_L1_MESSENGER_GOERLI'];
  }

  const l2 = DRE.companionNetworks['mantle'];

  const { deployer: deployerAddress } = await DRE.getNamedAccounts();
  const deployer = await DRE.ethers.getSigner(deployerAddress);
  console.log(
    `Deployer address: ${deployer.address} (${formatUnits(await deployer.getBalance())})`
  );

  // Note, the contract is on the mantle network, but only used to encode so no issue
  const mantleGov = MantleBridgeExecutor__factory.connect(
    (await l2.deployments.get('MantleGov')).address,
    deployer
  );
  console.log(`Mantle Gov at ${mantleGov.address}`);

  // Note, the contract is on the mantle network, but only used to encode so no issue
  const greeter = Greeter__factory.connect((await l2.deployments.get('Greeter')).address, deployer);
  console.log(`Greeter at ${greeter.address}`);

  const messenger = ICrossDomainMessenger__factory.connect(BVM_L1_MESSENGER, deployer);
  console.log(`BVM_L1_MESSENGER at: ${messenger.address}`);

  const encodedGreeting = greeter.interface.encodeFunctionData('setMessage', [MESSAGE]);

  const targets: string[] = [greeter.address];
  const values: BigNumber[] = [BigNumber.from(0)];
  const signatures: string[] = [''];
  const calldatas: string[] = [encodedGreeting];
  const withDelegatecalls: boolean[] = [false];

  const encodedQueue = mantleGov.interface.encodeFunctionData('queue', [
    targets,
    values,
    signatures,
    calldatas,
    withDelegatecalls,
  ]);

  const tx = await messenger.sendMessage(mantleGov.address, encodedQueue, GAS_LIMIT);
  console.log(`Transaction initiated: ${tx.hash}`);
});

task('mantle:execute-greeting', '')
  .addParam('id', 'Id of the proposal to execute')
  .setAction(async (taskArg, hre) => {
    await hre.run('set-DRE');

    if (DRE.network.name != eMantleNetwork.main && DRE.network.name != eMantleNetwork.testnet) {
      throw new Error('Only applicable on mantle L2');
    }

    const id = taskArg.id;

    const { deployer: deployerAddress } = await DRE.getNamedAccounts();
    const deployer = await DRE.ethers.getSigner(deployerAddress);
    console.log(
      `Deployer address: ${deployer.address} (${formatUnits(await deployer.getBalance())})`
    );

    // Note, the contract is on the mantle network, but only used to encode so no issue
    const mantleGov = MantleBridgeExecutor__factory.connect(
      (await DRE.deployments.get('MantleGov')).address,
      deployer
    );
    console.log(`Mantle Gov at ${mantleGov.address}`);

    // Note, the contract is on the mantle network, but only used to encode so no issue
    const greeter = Greeter__factory.connect(
      (await DRE.deployments.get('Greeter')).address,
      deployer
    );
    console.log(`Greeter at ${greeter.address}`);

    const tx = await mantleGov.execute(id);

    console.log(`Transaction initiated: ${tx.hash}`);
  });
