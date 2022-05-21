import React, { FC, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../Services/Auth/AuthContext';
import OutlinedButton from '../Buttons/OutlinedButton';

const MainNav: FC = () => {
  const { user } = useContext(AuthContext);

  function loginButton() {
    if (user) {
      return (
        <NavLink to='/manage'>
          <OutlinedButton>
            Ciao <b>{user.username}</b>!
          </OutlinedButton>
        </NavLink>
      );
    }
    return (
      <NavLink to='login' className='mx-2'>
        <OutlinedButton>Login</OutlinedButton>
      </NavLink>
    );
  }

  return (
    <nav className='py-3 px-3 border-y dark:border-neutral-200 bg-neutral-100 flex items-center dark:bg-neutral-900 h-20'>
      <NavLink to='/'>
        <h1 className='text-3xl font-bold dark:text-neutral-100'>
          Judo in cloud
        </h1>
      </NavLink>
      <div className='flex-grow'></div>

      <NavLink
        to='match-timer'
        className='mx-2 text-sky-500 hover:text-sky-800 dark:text-sky-300 dark:hover:text-sky-500'
      >
        Match timer
      </NavLink>

      {loginButton()}
    </nav>
  );
};

export default MainNav;
