import React, { useContext } from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';
import { storeTheme, ThemeT } from '../../Services/Theme/theme-service';
import { ThemeContext } from '../../Services/Theme/ThemeContext';

function DarkModeToggle () {
  const { theme, setTheme } = useContext(ThemeContext);

  function getIcon () {
    return theme === 'dark'
      ? <FaSun></FaSun>
      : <FaMoon></FaMoon>;
  }

  function toggleTheme() {
    const newTheme: ThemeT = theme === 'dark'
      ? 'light'
      : 'dark';
    setTheme(newTheme);
    storeTheme(newTheme);
  }

  return (
    <button onClick={() => toggleTheme()}>
      {getIcon()}
    </button>
  );
}

export default DarkModeToggle;
