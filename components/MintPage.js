import React, { useState } from 'react';
import { useStore } from '@nanostores/react';
import { pageOpen, policyType, policyDuration } from '../store/mintStore.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faToggleOn, faToggleOff } from '@fortawesome/free-solid-svg-icons'
import Image from 'next/image'



export default function MintPage() {
  const $pageOpen = useStore(pageOpen);
  // const [policyTypeSelection, setPolicyType] = useState(0);
  const $policyType = useStore(policyType);
  const $policyDuration = useStore(policyDuration);

  const price = 0.08;

  return (
    <>
        <h1 className='text-3xl'>Checkout</h1>
        <div className='flex flex-col'>
          <p>Length of Policy: {$policyDuration}</p>
          <p>Policy Type: {$policyType}</p>
          <p>Total: {$policyType == 1 ? '$' : null}{price} {$policyType == 0 ? 'ETH' : null}</p>
        </div>
        {/* <p className='font-light text-xl'></p> */}
        <button>Mint</button>
        <div className='flex space-x-4'>
          <button onClick={() => pageOpen.set($pageOpen - 1)}>Back</button>
        </div>
    </>
  )
}
