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
import SEO from '../components/SEO';


const minterContractProps = {
  address: '0x88426e177F30263f7C716905b49c7499e83D162D',
  abi: minterABI,
};

const usdcContractProps = {
  address: '0xe0A9dfEF8c40CE8F74CD8C99EE889E15D5116157',
  abi: usdcABI,
};

const scaleDown = (value, decimals = 18) => {
  if (!value || isNaN(value)) {
    return '0'
  }

  return new BigNumber(value).dividedBy(new BigNumber(10).pow(decimals)).decimalPlaces(6)
}

export default function Home() {
  const [isLoading, setLoading] = useState(false)
  const [notifyMessage, setNotifyMessage] = useState(undefined)
  const [hasError, setHasError] = useState(false)

  // Basics for wagmi
  const mounted = useIsMounted();
  const { address, isConnected } = useAccount();

  // The variables below are used to query the price from the Minter contract in MinterABI.ts (https://goerli.etherscan.io/address/0x5F3eA712766849363c340cc49b8Cd24039680448)
  const [policyDays, setPolicyDays] = useState(30); // This can be either 30, 90, 180 or 365
  const [policyType, setPolicyType] = useState(0); // This can be either 0 or 1

  let price = new BigNumber(0)
  let approvedAmount = new BigNumber(0)
  try {
    const priceResult = useContractRead({
      ...minterContractProps,
      functionName: 'getPrice',
      args: [policyDays, policyType]
    })
    if (priceResult.data) {
      price = new BigNumber(priceResult.data.toString())
    }
  
    const usdcAllowanceResult = useContractRead({
      ...usdcContractProps,
      functionName: 'allowance',
      args: [address, minterContractProps.address],
      cacheOnBlock: true,
      watch: true,
    })
    if (usdcAllowanceResult.data) {
      approvedAmount = new BigNumber(usdcAllowanceResult.data.toString())
    }
  } catch (err) {
    
  }

  let approveCallback = undefined
  const errorMessages = []
  const pendingApprovalAmount = !price.isEqualTo(0) ? price.minus(approvedAmount) : new BigNumber('0')
  try {
    const { config: allowanceConfig, error: approveError } = usePrepareContractWrite({
      ...usdcContractProps,
      functionName: 'increaseAllowance',
      args: [
        minterContractProps.address,
        // TODO: can use ethers.constant.MaxUint256 instead
        pendingApprovalAmount.isGreaterThan(0) ? pendingApprovalAmount.toString() : '0',
      ],
    })
    errorMessages.push(approveError?.toString())
  
    const { writeAsync: _approveCallback } = useContractWrite(allowanceConfig)
    if (!!_approveCallback) {
      approveCallback = _approveCallback
    }
  } catch (err) {
    
  }
  
  let mintCallback = undefined
  try {
    const { config: mintConfig, error: mintError } = usePrepareContractWrite({
      ...minterContractProps,
      functionName: 'mint',
      args: [
        policyDays,
        policyType,
        price.toString() || '0'
      ],
      overrides: {
        value: policyType === 0 ? ethers.utils.parseUnits(price.toString() || '0', 'wei') : '0x0'
      },
    })
    errorMessages.push(mintError?.toString())
  
    const { writeAsync: _mintCallback } = useContractWrite(mintConfig)
    if (!!_mintCallback) {
      mintCallback = _mintCallback
    }
  } catch (err) {
    
  }

  let step = 0
  let btnText = 'Mint'
  if (policyType === 1) {
    step = 1
    btnText = 'Approve USDC'
  }
  if (policyType === 0 || pendingApprovalAmount.isLessThanOrEqualTo(0)) {
    step = 2
    btnText = `Mint (${scaleDown(price.toString(), policyType === 0 ? 18 : 6)} ${policyType === 0 ? 'ETH' : 'USDC'})`
  }

  const handleChangeDays = (evt) => {
    setPolicyDays(Number(evt.target?.value))
  }
  
  const handleChangeType = (evt) => {
    setPolicyType(Number(evt.target?.value))
  }

  const handleApprove = async () => {
    if (!approveCallback) {
      setHasError(true)
      setNotifyMessage(errorMessages[0])
      return
    }

    setLoading(true)
    setHasError(false)
    try {
      const tx = await approveCallback?.()
      setNotifyMessage(`Submitting (tx: ${tx.hash})...`)
      if (tx && tx.hash) {
        await tx.wait(2)
        setNotifyMessage(undefined)
      }
    } catch (err) {
      console.log('handleApprove', 'err', err)
      setHasError(true)
      setNotifyMessage(`Approve Error: ${err.toString()}`)
    }

    setLoading(false)
  }

  const handleMint = async () => {
    if (!mintCallback) {
      setHasError(true)
      setNotifyMessage(errorMessages[1])
      return
    }

    setLoading(true)
    setHasError(false)
    try {
      const tx = await mintCallback?.()
      setNotifyMessage(`Submitting (tx: ${tx.hash})...`)
      if (tx && tx.hash) {
        await tx.wait(2)
        setNotifyMessage(`Minted!`)
      }
    } catch (err) {
      console.log('handleMint', 'err', err)
      setHasError(true)
      setNotifyMessage(`Mint Error: ${err.toString()}`)
    }

    setLoading(false)
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
              <button
                className={classNames(
                  'border-2 border-neutral-900 rounded-lg hover:text-red-600 hover:border-red-600 h-12 w-2/3 px-6',
                  isLoading ? 'cursor-not-allowed text-neutral-400 border-neutral-400 hover:text-neutral-400 hover:border-neutral-400' : ''
                )}
                disabled={isLoading}
                onClick={step === 2 ? handleMint : handleApprove}
              >
                { isLoading ? (
                  <div className='spinner text-red-600'></div>
                ) : (
                  <div>{ btnText }</div>
                ) }
              </button>
            </div>
          </div>
        )}

      </main>
    </>
  )
}
