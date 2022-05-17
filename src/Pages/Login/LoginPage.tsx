import React from 'react';
import { useNavigate } from 'react-router-dom';
import OutlinedButton from '../../Components/Buttons/OutlinedButton';
import Input from '../../Components/Inputs/Input';
import CenteredBox from '../../Components/Layout/CenteredBox';

function LoginPage() {
  const navigate = useNavigate();

  function login(event: React.MouseEvent) {
    event.preventDefault();
    navigate('/manage');
  }

  return (
    <CenteredBox>
      <form>
        <h2 className='text-xl font-bold pb-5'>
          Esegui il login
        </h2>
        <div className='mb-2'>
          <label>Nome utente</label>
          <Input placeholder='Nome utente'></Input>
        </div>
        <div className='mb-2'>
          <label>Password</label>
          <Input type='password' placeholder='*********'></Input>
        </div>

        <div className='flex justify-end mt-5'>
          <OutlinedButton type='submit' onClick={login}>
            Login
          </OutlinedButton>
        </div>
      </form>
    </CenteredBox>
  );
}

export default LoginPage;
