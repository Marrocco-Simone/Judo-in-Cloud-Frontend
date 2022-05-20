import React, { FC } from 'react';
import { Outlet } from 'react-router-dom';
import MainNav from './MainNav';

const MainLayout: FC = () => {
  return (
    <>
      <MainNav></MainNav>
      <div className='px-2 pt-2 md:px-4 h-full'>
        <Outlet></Outlet>
      </div>
    </>
  );
};

export default MainLayout;
