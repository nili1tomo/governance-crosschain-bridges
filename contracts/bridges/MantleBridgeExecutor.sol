// SPDX-License-Identifier: AGPL-3.0
pragma solidity 0.8.10;

import {ICrossDomainMessenger} from '../dependencies/mantle/interfaces/ICrossDomainMessenger.sol';
import {L2BridgeExecutor} from './L2BridgeExecutor.sol';

/**
 * @title MantleBridgeExecutor
 * @author Aave
 * @notice Implementation of the Mantle Bridge Executor, able to receive cross-chain transactions from Ethereum
 * @dev Queuing an ActionsSet into this Executor can only be done by the Mantle L2 Cross Domain Messenger and having
 * the EthereumGovernanceExecutor as xDomainMessageSender
 */
contract MantleBridgeExecutor is L2BridgeExecutor {
  // Address of the Mantle L2 Cross Domain Messenger, in charge of redirecting cross-chain transactions in L2
  address public immutable BVM_L2_CROSS_DOMAIN_MESSENGER;

  /// @inheritdoc L2BridgeExecutor
  modifier onlyEthereumGovernanceExecutor() override {
    if (
      msg.sender != BVM_L2_CROSS_DOMAIN_MESSENGER ||
      ICrossDomainMessenger(BVM_L2_CROSS_DOMAIN_MESSENGER).xDomainMessageSender() !=
      _ethereumGovernanceExecutor
    ) revert UnauthorizedEthereumExecutor();
    _;
  }

  /**
   * @dev Constructor
   *
   * @param bvmL2CrossDomainMessenger The address of the Mantle L2CrossDomainMessenger
   * @param ethereumGovernanceExecutor The address of the EthereumGovernanceExecutor
   * @param delay The delay before which an actions set can be executed
   * @param gracePeriod The time period after a delay during which an actions set can be executed
   * @param minimumDelay The minimum bound a delay can be set to
   * @param maximumDelay The maximum bound a delay can be set to
   * @param guardian The address of the guardian, which can cancel queued proposals (can be zero)
   */
  constructor(
    address bvmL2CrossDomainMessenger,
    address ethereumGovernanceExecutor,
    uint256 delay,
    uint256 gracePeriod,
    uint256 minimumDelay,
    uint256 maximumDelay,
    address guardian
  )
    L2BridgeExecutor(
      ethereumGovernanceExecutor,
      delay,
      gracePeriod,
      minimumDelay,
      maximumDelay,
      guardian
    )
  {
    BVM_L2_CROSS_DOMAIN_MESSENGER = bvmL2CrossDomainMessenger;
  }
}
