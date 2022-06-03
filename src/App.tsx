import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { UserI } from './models/user.model';
import { apiGet } from './Services/Api/api';
import { AuthContext, AuthContextI } from './Services/Auth/AuthContext';
import { getToken } from './Services/Auth/token-service';
import { ThemeContext, ThemeContextI } from './Services/Theme/ThemeContext';
import { getTheme, ThemeT } from './Services/Theme/theme-service';

function App() {
  const [user, setUser] = useState<UserI | null>(null);
  const [theme, setTheme] = useState<ThemeT>(() => getTheme());
  const authContext: AuthContextI = { user, setUser, unsetUser: () => setUser(null) };
  const themeContext: ThemeContextI = { theme, setTheme };

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
    <ThemeContext.Provider value={themeContext}>
      <AuthContext.Provider value={authContext}>
        <div className={theme === 'dark' ? 'dark' : ''}>
          <div className='w-full min-h-screen dark:bg-neutral-800 dark:text-neutral-200'>
            <Outlet></Outlet>
          </div>
        </div>
      </AuthContext.Provider>
    </ThemeContext.Provider>
  );
}

export default App;
