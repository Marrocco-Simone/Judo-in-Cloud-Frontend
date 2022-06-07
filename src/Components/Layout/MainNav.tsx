import React, { FC, useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Services/Auth/AuthContext';
import { deleteToken } from '../../Services/Auth/token-service';
import { deleteTatami } from '../../Services/TournamentManagement/tatami-service';
import DarkModeToggle from '../Buttons/DarkModeToggle';
import OutlinedButton from '../Buttons/OutlinedButton';

const MainNav: FC = () => {
  const { user, unsetUser } = useContext(AuthContext);
  const navigate = useNavigate();

  function logout() {
    deleteToken();
    deleteTatami();
    unsetUser();
    navigate('/login');
  }

  /**
   * either the login button or the button which only an authenticated user can view
   */
  function authButton() {
    if (user) {
      return (
        <>
          <NavLink to='/manage'>
            <OutlinedButton>
              Ciao <b>{user.username}</b>!
            </OutlinedButton>
          </NavLink>
          <span className='ml-2'>
            <OutlinedButton style='warn' onClick={logout}>
              Logout
            </OutlinedButton>
          </span>
        </>
      );
    }
    return (
      <NavLink to='login' className='mx-2'>
        <OutlinedButton>Login</OutlinedButton>
      </NavLink>
    );
  }

  return (
    <nav className='py-3 px-3 border-b dark:border-neutral-200 bg-neutral-100 flex items-center dark:bg-neutral-900 h-20'>
      <NavLink to='/'>
        <h1 className='text-3xl font-bold dark:text-neutral-100'>
          Judo in cloud
        </h1>
      </NavLink>
      <span className='text-2xl flex items-end ml-2'>
        <DarkModeToggle />
      </span>
      <div className='flex-grow'></div>

      {/* <NavLink
        to='match-timer'
        className='mx-2 text-sky-500 hover:text-sky-800 dark:text-sky-300 dark:hover:text-sky-500'
      >
        Match timer
      </NavLink> */}

      {authButton()}
    </nav>
  );
};

export default MainNav;
