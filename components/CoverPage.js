import React, { useState } from 'react';
import { useStore } from '@nanostores/react';
import { pageOpen } from '../store/mintStore.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSquareCheck } from '@fortawesome/free-solid-svg-icons'



export default function CoverPage() {
  const $pageOpen = useStore(pageOpen);

  return (
    <>
        <h1 className='text-3xl'>What We Cover</h1>
        <p>We protect you from the loss of ERC20 & ERC721 tokens due to interacting with a malicious smart contract.</p>
        <p>Examples we cover:</p>
        <div className='flex flex-col space-y-2'>
          <div className='flex items-center space-x-4'>
            <FontAwesomeIcon icon={faSquareCheck} size="2x" />
            <p>Hello</p>
          </div>
          <div className='flex items-center space-x-4'>
            <FontAwesomeIcon icon={faSquareCheck} size="2x" />
            <p>Hello</p>
          </div>
          <div className='flex items-center space-x-4'>
            <FontAwesomeIcon icon={faSquareCheck} size="2x" />
            <p>Hello</p>
          </div>
        </div>
        <div className='flex space-x-4'>
          <button onClick={() => pageOpen.set($pageOpen - 1)}>Back</button>
          <button onClick={() => pageOpen.set($pageOpen + 1)}>Next</button>
        </div>
    </>
  )
}
