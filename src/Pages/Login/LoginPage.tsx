import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OutlinedButton from '../../Components/Buttons/OutlinedButton';
import Input from '../../Components/Inputs/Input';
import CenteredBox from '../../Components/Layout/CenteredBox';
import { apiPost } from '../../Services/Api/api';
import { setToken } from '../../Services/Auth/token-service';

function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function login(event: React.MouseEvent) {
    event.preventDefault();
    setLoading(true);

    try {
      const data = ({
        username,
        password
      });
      const res = await apiPost<{ access_token: string}>('v1/auth/login', data);
      setToken(res.access_token);
      navigate('/manage');
    } catch (err) {
      console.error({ err });
    }
    setLoading(false);
  }

  return (
    <CenteredBox>
      <form>
        <h2 className='text-xl font-bold pb-5'>
          Esegui il login
        </h2>
        <div className='mb-2'>
          <label>Nome utente</label>
          <Input placeholder='Nome utente' value={username}
            onChange={event => setUsername(event.target.value)}></Input>
        </div>
        <div className='mb-2'>
          <label>Password</label>
          <Input type='password' placeholder='*********' value={password}
            onChange={event => setPassword(event.target.value)}></Input>
        </div>

        <div className='flex justify-end mt-5'>
          <OutlinedButton type='submit' onClick={login} disabled={loading}>
            Login
          </OutlinedButton>
        </div>
      </form>
    </CenteredBox>
  );
}

export default LoginPage;
