// Configuração de rede Sui para dApp Kit
import { getFullnodeUrl } from '@mysten/sui.js/client';
import { createNetworkConfig } from '@mysten/dapp-kit';

const { networkConfig, useNetworkVariable, useNetworkVariables } =
  createNetworkConfig({
    devnet: {
      url: getFullnodeUrl('devnet'),
      variables: {
        packageId: '0xPACKAGE_ID_AQUI',
        platformAddress: '0xPLATFORM_ADDRESS',
      },
    },
    testnet: {
      url: getFullnodeUrl('testnet'),
      variables: {
        packageId: '0xPACKAGE_ID_TESTNET',
        platformAddress: '0xPLATFORM_ADDRESS_TESTNET',
      },
    },
    mainnet: {
      url: getFullnodeUrl('mainnet'),
      variables: {
        packageId: '0xPACKAGE_ID_MAINNET',
        platformAddress: '0xPLATFORM_ADDRESS_MAINNET',
      },
    },
  });

export { useNetworkVariable, useNetworkVariables, networkConfig };
