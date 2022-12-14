import React, { useState } from 'react';
import { useStore } from '@nanostores/react';
import { pageOpen } from '../store/mintStore.js';
import Image from 'next/image'
import UnknownCharacter from "../images/unknown-character.png";
import Character from "../images/character.png";


export default function WelcomePage() {
  const [connected, setConnected] = useState(false);

  const $pageOpen = useStore(pageOpen);

  function getName (){
    // .charCodeAt(0)
    // Convert all letters to numbers and sum in a map (by each split section of the address)
    // Get modulo of sum by total name options for that section
    return "Thor 'the Brave' Thadius";
  };

  return (
    <>
        <h1 className='text-4xl'>Welcome Traveller</h1>
        {
          !connected ?
          <Image
              src={UnknownCharacter}
              alt="Locked Character"
              width={128}
              height={192}
            /> :
            <Image
            src={Character}
            alt="Character"
            width={128}
            height={192}
          />
        }
        <p className='font-light text-xl'>{!connected ? "Before we proceed, please introduce yourself." : getName()}</p>
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
