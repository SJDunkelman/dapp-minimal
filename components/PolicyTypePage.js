import React, { useState } from 'react';
import { useStore } from '@nanostores/react';
import { pageOpen, policyType } from '../store/mintStore.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faToggleOn, faToggleOff } from '@fortawesome/free-solid-svg-icons'
import Image from 'next/image'
import ETHLogo from "../images/eth.png";
import USDCLogo from "../images/usdc.png";



export default function PolicyTypePage() {
  const $pageOpen = useStore(pageOpen);
  // const [policyTypeSelection, setPolicyType] = useState(0);
  const $policyType = useStore(policyType);

  return (
    <>
        <h1 className='text-3xl'>Policy Type</h1>
        <p className='font-light text-xl'>We pay out based on the value of assets stolen at the time of loss up to a maximum amount. The currency we pay you and the maximum depend on which policy you purchase:</p>
        <div className='flex space-x-12'>
          <div className='flex flex-col space-y-2 items-center'>
            <Image
              src={ETHLogo}
              alt="Picture of the author"
              width={64}
              height={64}
            />
            <p>Payout currency: ETH</p>
            <p>Max. payout: 1 ETH</p>
            {$policyType == 0 ? 
            <FontAwesomeIcon icon={faToggleOn} size="2x"/> :
            <FontAwesomeIcon icon={faToggleOff} size="2x" onClick={() => policyType.set(0)} />}
          </div>
          <div className='flex flex-col space-y-2 items-center'>
            <Image
              src={USDCLogo}
              alt="Picture of the author"
              width={64}
              height={64}
            />
            <p>Payout currency: USDC</p>
            <p>Max. payout: $1000 USDC</p>
            {$policyType == 1 ? 
            <FontAwesomeIcon icon={faToggleOn} size="2x"/> :
            <FontAwesomeIcon icon={faToggleOff} size="2x" onClick={() => policyType.set(1)} />}
          </div>
          
        </div>
        <div className='flex space-x-4'>
          <button onClick={() => pageOpen.set($pageOpen - 1)}>Back</button>
          <button onClick={() => pageOpen.set($pageOpen + 1)}>Next</button>
        </div>
    </>
  )
}
