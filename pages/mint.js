import React, { useState } from 'react';
import WelcomePage from "../components/WelcomePage.js";
import ExplainerPage from "../components/ExplainerPage.js";
import CoverPage from "../components/CoverPage.js";
import NotCoverPage from "../components/NotCoverPage.js";
import PolicyTypePage from "../components/PolicyTypePage.js";
import PolicyLengthPage from "../components/PolicyLengthPage.js";
import MintPage from "../components/MintPage.js";
import { useStore } from '@nanostores/react';
import { pageOpen } from '../store/mintStore.js';

export default function Mint() {
  const $pageOpen = useStore(pageOpen);

  return (
    <main className='h-screen w-full flex flex-col items-center justify-center text-center px-32'>
      <div className='border-2 border-black flex flex-col justify-center items-center space-y-4 py-6 px-16 w-full h-3/4'>
        {$pageOpen == 0 ? <WelcomePage /> : null}
        {$pageOpen == 1 ? <ExplainerPage /> : null}
        {$pageOpen == 2 ? <CoverPage /> : null}
        {$pageOpen == 3 ? <NotCoverPage /> : null}
        {$pageOpen == 4 ? <PolicyTypePage /> : null}
        {$pageOpen == 5 ? <PolicyLengthPage /> : null}
        {$pageOpen == 6 ? <MintPage /> : null}
      </div>
    </main>
  )
}
