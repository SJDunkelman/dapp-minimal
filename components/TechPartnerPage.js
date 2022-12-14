import React, { useState } from 'react';
import { useStore } from '@nanostores/react';
import { pageOpen } from '../store/mintStore.js';
import Image from 'next/image'



export default function WelcomePage() {
  const $pageOpen = useStore(pageOpen);
  const [downloaded, setDownloaded] = useState(false);

  return (
    <>
        <h1 className='text-4xl'>Welcome Traveller</h1>
        {/* <Image
              src={UnknownCharacter}
              alt="Locked Character"
              width={128}
              height={192}
            />  */}
        
        <div className='flex flex-col space-y-2'>
          <button className='rounded-xl bg-slate-300 p-2' onClick={() => setConnected(true)}>{!connected ? "Connect Wallet" : "1 ETH 0x...abc"}</button>
          {
            connected ?
            <button onClick={() => pageOpen.set($pageOpen + 1)}>Next</button> :
            null
          }
        </div>
    </>
  )
}
