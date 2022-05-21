import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { UserI } from './models/user.model';
import { apiGet } from './Services/Api/api';
import { AuthContext, AuthContextI } from './Services/Auth/AuthContext';
import { getToken } from './Services/Auth/token-service';

function App() {
  const [user, setUser] = useState<UserI | null>(null);
  const authContext: AuthContextI = { user, setUser };

  useEffect(() => {
    // try loading the user
    const token = getToken();
    if (token !== null) {
      apiGet('v1/auth')
        .then((res: UserI) => {
          setUser(res);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, []);

  return (
    <AuthContext.Provider value={authContext}>
      <div className='w-full min-h-screen dark:bg-neutral-800 dark:text-neutral-200'>
        <Outlet></Outlet>
      </div>
    </AuthContext.Provider>
  );
}

export default App;
