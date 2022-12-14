import React, { useState } from 'react';
import { useStore } from '@nanostores/react';
import { pageOpen } from '../store/mintStore.js';


export default function ExplainerPage() {
  const $pageOpen = useStore(pageOpen);

  return (
    <>
        <h1 className='text-3xl'>Health Potion 🧪✨</h1>
        <p>Health Potion is the first insurance policy for individual crypto investors to insure the assets in their wallet.</p>
        <div className='flex space-x-4'>
          <button onClick={() => pageOpen.set($pageOpen - 1)}>Back</button>
          <button onClick={() => pageOpen.set($pageOpen + 1)}>Next</button>
        </div>
    </>
  )
}
