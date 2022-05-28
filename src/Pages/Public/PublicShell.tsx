import React, { FC, useEffect, useState } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { CompetitionI } from '../../models/competition.model';
import { apiGet } from '../../Services/Api/api';

export interface PublicOutletContext {
  competition: CompetitionI;
}

const PublicShell: FC = () => {
  // load the competition from the slug
  const { slug } = useParams();
  const [competition, setCompetition] = useState<CompetitionI | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    apiGet(`v2/competitions/find/${slug}`).then(
      (res) => {
        setCompetition(res);
      },
      () => {
        // there was an error
        navigate('/');
      }
    );
  }, [slug]);

  if (competition === null) {
    return <>Caricamento in corso...</>;
  }
  const context: PublicOutletContext = {
    competition
  };

  return <Outlet context={context}></Outlet>;
};

export default PublicShell;
