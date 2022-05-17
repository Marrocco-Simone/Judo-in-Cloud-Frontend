import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import OutlinedButton from './Components/Buttons/OutlinedButton';
function App() {
  return (
    <div className='w-full min-h-screen dark:bg-neutral-800 dark:text-neutral-200'>
      <nav className='py-3 px-3 border-y dark:border-neutral-200 flex items-center dark:bg-neutral-900'>
        <h1 className='text-3xl font-bold dark:text-neutral-100 mr-10'>
          Judo in cloud
        </h1>
        <div className='flex-grow'></div>

        <NavLink to='match-timer' className='mx-2 text-sky-500 hover:text-sky-800 dark:text-sky-300 dark:hover:text-sky-500'>
          Match timer
        </NavLink>

        <NavLink to='login' className='mx-2'>
          <OutlinedButton>
            Login
          </OutlinedButton>
        </NavLink>
      </nav>
      <div className='px-2 pt-2 md:px-4 h-full'>
        <Outlet></Outlet>
      </div>
    </div>
  );
}

export default App;
