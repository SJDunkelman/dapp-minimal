import React, { useState } from 'react';
import { useStore } from '@nanostores/react';
import { pageOpen } from '../store/mintStore.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSquareXmark } from '@fortawesome/free-solid-svg-icons'



export default function NotCoverPage() {
  const $pageOpen = useStore(pageOpen);

  return (
    <>
        <h1 className='text-3xl'>What We Don't Cover</h1>
        <p>We don't cover lost or stolen private keys or the loss of investment.</p>
        <p>Examples of things not covered:</p>
        <div className='flex flex-col space-y-2'>
          <div className='flex items-center space-x-4'>
            <FontAwesomeIcon icon={faSquareXmark} size="2x" />
            <p>Hello</p>
          </div>
          <div className='flex items-center space-x-4'>
            <FontAwesomeIcon icon={faSquareXmark} size="2x" />
            <p>Hello</p>
          </div>
          <div className='flex items-center space-x-4'>
            <FontAwesomeIcon icon={faSquareXmark} size="2x" />
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
