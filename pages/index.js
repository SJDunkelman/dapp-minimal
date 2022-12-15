import React, { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit'
import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from 'wagmi';
import { ethers } from 'ethers';
import classNames from 'classnames';
import BigNumber from 'bignumber.js';
import { useIsMounted } from './api/useIsMounted'
import { minterABI } from "../contracts/MinterABI.ts";
import { usdcABI } from "../contracts/UsdcABI.ts";
import { abi as HealthPotionABI } from "../contracts/HealthPotionABI";
import SEO from '../components/SEO';


const minterContractProps = {
  address: '0x5F3eA712766849363c340cc49b8Cd24039680448',
  abi: minterABI,
};

const usdcContractProps = {
  address: '0x07865c6E87B9F70255377e024ace6630C1Eaa37F',
  abi: usdcABI,
};

const healthPotionProps = {
  address: '0x3E645C0E0BCbA8F2cC53248221bE36f99eb3cB7e',
  abi: HealthPotionABI,
}

export default function Home() {
  const [isApproveLoading, setApproveLoading] = useState(false)
  const [isMintLoading, setMintLoading] = useState(false)
  const [notifyMessage, setNotifyMessage] = useState(null)
  const [hasError, setHasError] = useState(false)

  // Basics for wagmi
  const mounted = useIsMounted();
  const { address, isConnected } = useAccount();

  // The variables below are used to query the price from the Minter contract in MinterABI.ts (https://goerli.etherscan.io/address/0x5F3eA712766849363c340cc49b8Cd24039680448)
  const [policyDays, setPolicyDays] = useState(30); // This can be either 30, 90, 180 or 365
  const [policyType, setPolicyType] = useState(0); // This can be either 0 or 1

  const nftBalanceOfResult = useContractRead({
    ...healthPotionProps,
    functionName: 'balanceOf',
    args: [address]
  })

  const priceResult = useContractRead({
    ...minterContractProps,
    functionName: 'getPrice',
    args: [policyDays, policyType]
  })

  const usdcAllowanceResult = useContractRead({
    ...usdcContractProps,
    functionName: 'allowance',
    args: [address, minterContractProps.address]
  })

  const increaseAllowanceVal = priceResult.isSuccess && usdcAllowanceResult.isSuccess
    ? new BigNumber(priceResult.data?.toString() || '0').minus(
      new BigNumber(usdcAllowanceResult.data?.toString() || '0')
    )
    : new BigNumber('0')
  const { config: allowanceConfig } = usePrepareContractWrite({
    ...usdcContractProps,
    functionName: 'increaseAllowance',
    args: [
      minterContractProps.address,
      // TODO: can use ethers.constant.MaxUint256 instead
      increaseAllowanceVal.isGreaterThan(0) ? increaseAllowanceVal.toString() : '0',
    ]
  })

  const { writeAsync: approveCallback } = useContractWrite(allowanceConfig)
  const isApproveDisabled = isApproveLoading || isMintLoading || !approveCallback

  const { config: mintConfig } = usePrepareContractWrite({
    ...minterContractProps,
    functionName: 'mint',
    args: [
      policyDays,
      policyType,
      priceResult.data?.toString() || '0'
    ],
    overrides: {
      value: policyType === 0 ? ethers.utils.parseUnits(priceResult.data?.toString() || '0', 'wei') : '0x0'
    }
  })

  const { writeAsync: mintCallback } = useContractWrite(mintConfig)
  const isMintDisabled = isApproveLoading || isMintLoading || !mintCallback

  const handleChangeDays = (evt) => {
    setPolicyDays(Number(evt.target?.value))
  }
  
  const handleChangeType = (evt) => {
    setPolicyType(Number(evt.target?.value))
  }

  const scaleDown = (value, decimals = 18) => {
    if (!value || isNaN(value)) {
      return '0'
    }

    return new BigNumber(value).dividedBy(new BigNumber(10).pow(decimals)).decimalPlaces(6)
  }

  const handleApprove = async () => {
    setApproveLoading(true)

    setHasError(false)
    setNotifyMessage('Waiting for approval...')
    try {
      const tx = await approveCallback?.()
      if (tx && tx.hash) {
        await tx.wait(2)
        setNotifyMessage(`Approved: ${tx.hash}`)
      }
    } catch (err) {
      console.log('handleApprove', 'err', err)
      setHasError(true)
      setNotifyMessage(`Approve Error: ${err.toString()}`)
    }

    setApproveLoading(false)
  }

  const handleMint = async () => {
    if (!new BigNumber(nftBalanceOfResult.data?.toString() || '0').isEqualTo(0)) {
      setHasError(true)
      setNotifyMessage('Can only mint one token per wallet')
      return
    }

    setMintLoading(true)

    setHasError(false)
    setNotifyMessage('Waiting for minting...')
    try {
      const tx = await mintCallback?.()
      if (tx && tx.hash) {
        await tx.wait(2)
        setNotifyMessage(`Minted: ${tx.hash}`)
      }
    } catch (err) {
      console.log('handleMint', 'err', err)
      setHasError(true)
      setNotifyMessage(`Mint Error: ${err.toString()}`)
    }

    setMintLoading(false)
  }


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
  // const isMintLoading = false
  // const isMintStarted = false
  // const isMinted = false

  return (
    <>
      <SEO pageTitle="Homepage" pageDescription="Welcome to my website" />
      <main className='h-screen w-full flex flex-col items-center justify-center text-center'>
        <ConnectButton chainStatus={"none"} />

        {mounted && isConnected && (
          <div className='flex flex-col justify-center items-center mt-8 w-full'>
            <div className='flex flex-row justify-between items-center w-1/3 mb-3'>
              <div className='mr-4'>Select Policy Days:</div>
              <select value={policyDays} className="flex-1 border-2 border-neutral-900 rounded-lg px-6 py-3" onChange={handleChangeDays}>
                <option value={30}>30 days</option>
                <option value={90}>90 days</option>
                <option value={180}>180 days</option>
                <option value={365}>365 days</option>
              </select>
            </div>

            <div className='flex flex-row justify-between items-center w-1/3'>
              <div className='mr-4'>Select Currency:</div>
              <select value={policyType} className="flex-1 border-2 border-neutral-900 rounded-lg px-6 py-3" onChange={handleChangeType}>
                <option value={0}>ETH</option>
                <option value={1}>USDC</option>
              </select>
            </div>

            { notifyMessage && (
              <div className={classNames(
                'overflow-x-auto rounded-xl w-1/2 px-4 py-3 mt-4',
                hasError ? 'text-red-600 border-2 border-red-600' : ''
              )}>{notifyMessage}</div>
            ) }

            <div className='flex flex-col justify-center items-center w-1/3 mt-6'>
              { policyType === 1 && increaseAllowanceVal.isGreaterThan(0) && (
                <button
                className={classNames(
                  'border-2 border-neutral-900 rounded-lg hover:text-red-600 hover:border-red-600 h-12 w-2/3 px-6 mb-4',
                  isApproveDisabled ? 'cursor-not-allowed text-neutral-400 border-neutral-400 hover:text-neutral-400 hover:border-neutral-400' : ''
                )}
                  disabled={isApproveDisabled}
                  onClick={handleApprove}
                >
                  { isApproveLoading ? (
                    <div className='spinner text-red-600'></div>
                  ) : (
                    <div>Approve USDC</div>
                  ) }
                </button>
              ) }
              <button
                className={classNames(
                  'border-2 border-neutral-900 rounded-lg hover:text-red-600 hover:border-red-600 h-12 w-2/3 px-6',
                  isMintDisabled ? 'cursor-not-allowed text-neutral-400 border-neutral-400 hover:text-neutral-400 hover:border-neutral-400' : ''
                )}
                disabled={isMintDisabled}
                onClick={handleMint}
              >
                { isMintLoading ? (
                  <div className='spinner text-red-600'></div>
                ) : (
                  <div>
                    Mint { priceResult.isSuccess ? `(${scaleDown(priceResult.data.toString(), policyType === 0 ? 18 : 6)} ${policyType === 0 ? 'ETH' : 'USDC'})` : '' }
                  </div>
                ) }
              </button>
            </div>
          </div>
        )}

      </main>
    </>
  )
}
