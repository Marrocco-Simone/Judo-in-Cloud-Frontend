import React from 'react';
import { NavLink } from 'react-router-dom';

export default function WelcomePage() {
  return (
    <div className='welcome-page'>
      <h1 className='h1-title'>
        Il gestore di gare di Judo, semplice e moderno
      </h1>
      <div className='img-container'>
        <p>{`
          Gestisci in facilita' i tuoi atleti. 
          Inserisci i loro dati e verranno automaticamente assegnati alla loro categoria.
          Chiudi una classe d'eta', scegli i parametri dei loro incontri e inizia i tornei.
        `}</p>
        <img src='athletes-screenshot.png' />
      </div>
      <div className='img-container'>
        <img src='tournament-screenshot.png' />
        <p>{`
          Ogni tavolo puo' prenotare le sua categorie, iniziare un incontro di un torneo o 
          svolgere un'amichevole. Apri il tabellone dinamico per una visuale piu' compatta
        `}</p>
      </div>
      <div className='img-container'>
        <p>{`
          Grazie al tabellone moderno, e' possibile assegnare i punteggi ed iniziare i timer
          con un click o con la tastiera. La vittoria viene assegnata automaticamente, devi solo
          confermare!
        `}</p>
        <img src='match-timer-screenshot.jpg' />
      </div>
      <div className='img-container'>
        <img src='public-screenshot.png' className='vertical-img' />
        <p>
          {`
          Basta fogli svolazzanti e confusione! Grazie a Judo in Cloud,
          allenatori ed atleti potranno vedere dove devono combattere comodamente dal
          loro telefono
        `}
          <br />
          <NavLink to='gara-lavis' style={{ color: 'cornflowerblue' }}>
            Guarda qui un esempio
          </NavLink>
        </p>
      </div>
    </div>
  );
}
