import React from 'react';
import { useStore } from '@nanostores/react';
import { pageOpen, policyDuration } from '../store/mintStore.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faToggleOn, faToggleOff } from '@fortawesome/free-solid-svg-icons'



export default function PolicyLengthPage() {
  const $pageOpen = useStore(pageOpen);
  // const [policyTypeSelection, setPolicyType] = useState(0);
  const $policyDuration = useStore(policyDuration);

  return (
    <>
      <h1 className='text-3xl'>Policy Type</h1>
      <p className='font-light text-xl'>We pay out based on the value of assets stolen at the time of loss up to a maximum amount. The currency we pay you and the maximum depend on which policy you purchase:</p>
      <div className='flex space-x-12 w-4/5'>
        <div className='flex flex-col items-center relative border-2 w-1/4 h-48'>
          <div className='absolute top-0 right-0 translate-x-1/2 bg-green-300 p-1 rounded-xl px-2'>LIMITED</div>
          <p className='text-xl font-bold'>1 Month</p>
          <div class="mb-9 flex">
            <span class="mr-1 mt-0.5 font-heading font-semibold text-lg text-gray-900">$</span>
            <span class="font-heading font-semibold text-6xl sm:text-7xl text-gray-900">29</span>
            <span class="font-heading font-semibold self-end">/ m</span>
          </div>
          {$policyDuration == 30 ? 
            <FontAwesomeIcon icon={faToggleOn} size="2x"/> :
            <FontAwesomeIcon icon={faToggleOff} size="2x" onClick={() => policyDuration.set(30)} />
          }
        </div>
        <div className='flex flex-col items-center relative border-2 w-1/4 h-48'>
          <p className='text-xl font-bold'>1 Month</p>
          <div class="flex">
            <span class="mr-1 mt-0.5 font-heading font-semibold text-lg text-gray-900">$</span>
            <span class="font-heading font-semibold text-6xl sm:text-7xl text-gray-900">29</span>
            <span class="font-heading font-semibold self-end">/ m</span>
          </div>
          <p>Annual discount: </p>
          {$policyDuration == 90 ? 
            <FontAwesomeIcon icon={faToggleOn} size="2x"/> :
            <FontAwesomeIcon icon={faToggleOff} size="2x" onClick={() => policyDuration.set(90)} />
          }
        </div>
      </div>
      <div className='flex space-x-4'>
        <button onClick={() => pageOpen.set($pageOpen - 1)}>Back</button>
        <button onClick={() => pageOpen.set($pageOpen + 1)}>Next</button>
      </div>
    </>
  )
}
