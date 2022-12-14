import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { mainnet, goerli } from 'wagmi/chains';
import { infuraProvider } from 'wagmi/providers/infura';
import { publicProvider } from 'wagmi/providers/public';


import '../styles/globals.css'

// Connectors
// 
const { chains, provider } = configureChains(
  [mainnet, goerli],
  [
    infuraProvider({ apiKey: "793dd6daea97483daafab5919e3f7ec2" }),
    publicProvider()
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'Health Potion',
  chains
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
})

function MyApp({ Component, pageProps }) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>
  )
}

export default MyApp
