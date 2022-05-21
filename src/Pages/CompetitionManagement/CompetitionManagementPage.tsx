import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import LargeButton from '../../Components/Buttons/LargeButton';
import CenteredBox from '../../Components/Layout/CenteredBox';

const CompetitionManagementPage: FC = () => {
  return (
    <CenteredBox>
      <h2 className='text-2xl bold pb-4'>
        Vuoi gestire un torneo o pesare gli atleti?
      </h2>

      <div className='flex flex-wrap max-w-lg'>
        <div className='w-full md:w-1/2 p-3'>
          <Link to='/tournament'>
            <LargeButton>
              Gestione torneo
            </LargeButton>
          </Link>
        </div>

        <div className='w-full md:w-1/2 p-3'>
          <Link to='/athletes'>
            <LargeButton>
              Sezione pesi
            </LargeButton>
          </Link>
        </div>
      </div>
    </CenteredBox>
  );
};

export default CompetitionManagementPage;
