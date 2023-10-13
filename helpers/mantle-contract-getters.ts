import { Signer, BigNumber } from 'ethers';
import {
  MantleBridgeExecutor,
  MantleBridgeExecutor__factory,
  MockBvmL1CrossDomainMessenger,
  MockBvmL1CrossDomainMessenger__factory,
  MockBvmL2CrossDomainMessenger,
  MockBvmL2CrossDomainMessenger__factory,
} from '../typechain';
import { tEthereumAddress } from './types';

export const deployBvmMessengers = async (
  signer: Signer
): Promise<[MockBvmL1CrossDomainMessenger, MockBvmL2CrossDomainMessenger]> => {
  const l1Messenger = await new MockBvmL1CrossDomainMessenger__factory(signer).deploy();
  const l2Messenger = await new MockBvmL2CrossDomainMessenger__factory(signer).deploy();
  await l1Messenger.deployTransaction.wait();
  await l2Messenger.deployTransaction.wait();
  await l1Messenger.setL2Messenger(l2Messenger.address);
  await l2Messenger.setL1Messenger(l1Messenger.address);
  return [l1Messenger, l2Messenger];
};

export const deployMantleBridgeExecutor = async (
  bvmMessenger: tEthereumAddress,
  ethereumExecutor: tEthereumAddress,
  delay: BigNumber,
  gracePeriod: BigNumber,
  minimumDelay: BigNumber,
  maximumDelay: BigNumber,
  guardian: tEthereumAddress,
  signer: Signer
): Promise<MantleBridgeExecutor> => {
  const mantleBridgeExecutorFactory = new MantleBridgeExecutor__factory(signer);
  const mantleBridgeExecutor = await mantleBridgeExecutorFactory.deploy(
    bvmMessenger,
    ethereumExecutor,
    delay,
    gracePeriod,
    minimumDelay,
    maximumDelay,
    guardian
  );
  await mantleBridgeExecutor.deployTransaction.wait();
  return mantleBridgeExecutor;
};
