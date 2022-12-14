import React, { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount, usePrepareContractWrite, useContractWrite, useContractRead, useWaitForTransaction } from 'wagmi'
import { useIsMounted } from './api/useIsMounted'
import { minterABI } from "../contracts/MinterABI.ts";
import SEO from '../components/SEO';
const { ethers } = require("ethers");


const minterConfig = {
  address: '0x5F3eA712766849363c340cc49b8Cd24039680448',
  minterABI,
};

export default function Home() {
  // Page 1
  const mounted = useIsMounted();
  const { address, isConnected } = useAccount();

  // Page 2 (select policy type)
  const [policyType, setpolicyType] = useState(0);

  // Page 3 (select policy duration)
  const [policyDuration, setpolicyDuration] = useState(0);

  // Page 4 (mint)
  const { config } = usePrepareContractWrite({
    ...minterConfig,
    functionName: "mint",
    args: [30, 0, 15000000000000000],
    overrides: {
      value: ethers.utils.parseEther("15000000000000000"),
    },
  });

  const { data, write, error: writeError } = useContractWrite(config);

  const priceArguments = [30, 0]

  const [policyPrice, setPolicyPrice] = React.useState(0);

  const { data: priceData, isSuccess: priceSuccess } = useContractRead({
    ...minterConfig,
    functionName: 'getPrice',
    args: [30, 0],
  });

  // React.useEffect(() => {
  //   if (policyPrice) {
  //     setPolicyPrice(ethers.utils.formatEther(priceData));
  //   }
  // }, [priceData]);

  // console.log(ethers.utils.formatEther(priceData));

  const isMinted = true;

  // const mintArguments = [policyDuration, policyType, ];

  return (
    <>
      <SEO pageTitle="Homepage" pageDescription="Welcome to my website" />
      <main className='h-screen w-full flex flex-col items-center justify-center text-center'>
        <div className='flex flex-col space-y-4 pb-4'>
          <h1>1.</h1>
          <ConnectButton chainStatus={"none"} />

          {mounted ? address && <p>Hello!</p> : null}
        </div>

        <h1>2.</h1>
        <div className='flex space-x-4 pb-4'>
            <div className='flex flex-col space-y-2'>
              <h5>ETH</h5>
              <div className={`${policyType == 0 ? "bg-green-400" : "bg-slate-300"} p-4`} onClick={() => setpolicyType(0)} />
            </div>
            <div className='flex flex-col space-y-2'>
              <h5>USDC</h5>
              <div className={`${policyType == 1 ? "bg-green-400" : "bg-slate-300"} p-4`} onClick={() => setpolicyType(1)} />
            </div>
          </div>

        <h1>3.</h1>
        <div className='flex space-x-4 pb-8'>
          <div className='flex flex-col space-y-2'>
            <h5>1 Month</h5>
            <div className={`${policyDuration == 30 ? "bg-green-400" : "bg-slate-300"} p-4`} onClick={() => setpolicyDuration(30)} />
          </div>
          <div className='flex flex-col space-y-2'>
            <h5>3 Months</h5>
            <div className={`${policyDuration == 90 ? "bg-green-400" : "bg-slate-300"} p-4`} onClick={() => setpolicyDuration(90)} />
          </div>
          <div className='flex flex-col space-y-2'>
            <h5>6 Months</h5>
            <div className={`${policyDuration == 180 ? "bg-green-400" : "bg-slate-300"} p-4`} onClick={() => setpolicyDuration(180)} />
          </div>
          <div className='flex flex-col space-y-2'>
            <h5>12 Months</h5>
            <div className={`${policyDuration == 365 ? "bg-green-400" : "bg-slate-300"} p-4`} onClick={() => setpolicyDuration(365)} />
          </div>
        </div>

        <h1>4.</h1>
          {policyPrice}
          {/* <p>{priceSuccess ? priceData : "Failed to get price"}</p> */}
          <div className={`w-24 h-48 mb-4 ${isMinted ? "bg-green-600" : "bg-slate-300"}`} />
          {mounted ? isConnected && 
          <button className='px-2 py-1 rounded-xl bg-blue-400' onClick={() => write?.()}>Mint</button>
          : null}
      </main>
    </>
  )
}
