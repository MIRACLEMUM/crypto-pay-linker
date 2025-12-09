import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, sepolia } from 'wagmi/chains';

// WalletConnect Project ID - Replace with your own from https://cloud.walletconnect.com
const WALLETCONNECT_PROJECT_ID = 'YOUR_PROJECT_ID';

export const config = getDefaultConfig({
  appName: 'PayLink',
  projectId: WALLETCONNECT_PROJECT_ID,
  chains: [mainnet, sepolia],
  ssr: false,
});

export { mainnet, sepolia };
