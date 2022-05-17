import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import LargeButton from '../../Components/Buttons/LargeButton';

const TournamentsPage: FC = () => {
  const tournaments = [
    {
      id: 1,
      name: 'Cadetti U66 Maschile'
    },
    {
      id: 2,
      name: 'Cadetti U50 Maschile'
    },
    {
      id: 3,
      name: 'Esordienti A U35 Femminile'
    },
  ];

  return (
    <div className='grid grid-cols-3 -mx-3'>
      {tournaments.map(tournament => (
        <div className='p-3' key={tournament.id}>
          <Link to={`${tournament.id}`}>
            <LargeButton>
              {tournament.name}
            </LargeButton>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default TournamentsPage;
