import React, { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit'
import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi';
import { useIsMounted } from './api/useIsMounted'
import { minterABI } from "../contracts/MinterABI.ts";
import SEO from '../components/SEO';


const contractConfig = {
  address: '0x5F3eA712766849363c340cc49b8Cd24039680448',
  minterABI,
};

export default function Home() {
  // Basics for wagmi
  const mounted = useIsMounted();
  const { address, isConnected } = useAccount();

  // The variables below are used to query the price from the Minter contract in MinterABI.ts (https://goerli.etherscan.io/address/0x5F3eA712766849363c340cc49b8Cd24039680448)
  const [policyDays, setPolicyDays] = useState(30); // This can be either 30, 90, 180 or 365
  const [policyType, setPolicyType] = useState(0); // This can be either 0 or 1

  

  // First we get the policy (NFT) price from the Minter contract in MinterABI.ts
  // I've commented out the code below that was failing to work:

  // const { data: priceData, isSuccess: priceSuccess } = useContractRead({
  //   ...minterConfig,
  //   functionName: 'getPrice',
  //   args: [30, 0],
  // });
  // React.useEffect(() => {
  //   if (policyPrice) {
  //     setPolicyPrice(ethers.utils.formatEther(priceData));
  //   }
  // }, [priceData]);
  // const price = ethers.utils.formatEther(priceData);

  

  // Second we use the mint function from the Minter contract in MinterABI.ts
  // The arguments taken from above are policyDays, policyType & price
  // IMPORTANT: IF THE POLICY TYPE = 0 THEN IT NEEDS TO BE PAID IN ETH. IF THE POLICY TYPE = 1 THEN IT NEEDS TO BE PAID IN USDC
  // The USDC contract on Goerli is at https://goerli.etherscan.io/address/0x07865c6e87b9f70255377e024ace6630c1eaa37f#writeProxyContract
  // For the USDC mint, we need to first set the allowance for the price amount of tokens for the spender before then minting
  // Here's the existing code that's not working (just for the ETH payment with arguments hardcoded):

  // const { config: contractWriteConfig } = usePrepareContractWrite({
  //   ...contractConfig,
  //   functionName: 'mint',
  //   args: [180, 0, 60000000000000000],
  //   overrides: {
  //     overrides: {
  //       value: ethers.utils.parseEther("60000000000000000"),
  //     },
  //   }
  // });

  // const {
  //   data: mintData,
  //   write: mint,
  //   isLoading: isMintLoading,
  //   isSuccess: isMintStarted,
  //   error: mintError,
  // } = useContractWrite(contractWriteConfig);

  // const {
  //   data: txData,
  //   isSuccess: txSuccess,
  //   error: txError,
  // } = useWaitForTransaction({
  //   hash: mintData?.hash,
  // });

  // const isMinted = txSuccess;


  return (
    <>
      <SEO pageTitle="Homepage" pageDescription="Welcome to my website" />
      <main className='h-screen w-full flex flex-col items-center justify-center text-center'>
        <ConnectButton chainStatus={"none"} />

        {mounted && isConnected && !isMinted && (
              <button disabled={!mint || isMintLoading || isMintStarted} onClick={() => mint?.()}>
                {isMintLoading && 'Waiting for approval'}
                {isMintStarted && 'Minting...'}
                {!isMintLoading && !isMintStarted && 'Mint'}
              </button>
            )}

      </main>
    </>
  )
}
