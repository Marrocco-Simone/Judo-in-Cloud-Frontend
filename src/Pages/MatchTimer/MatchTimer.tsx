import React, { useState, useEffect } from 'react';
import './match.css';
import { Params } from './types';
import { Modal } from './Modal';
import { ModifyParams } from './ModifyParams';

/* add line 'window.addEventListener("contextmenu", e => e.preventDefault());' to index.tsx */
/*
    TODOS:
    reusable modal info e form
    custom modal scroll -> in reusable modal info
    fix timers https:// stackoverflow.com/questions/29971898/how-to-create-an-accurate-timer-in-javascript
    aggiungere debouncing nel moodle dei parametri
    unire funzioni getInputNumberField e getInputMinuteField in ModifyParamsModal.tsx
    modificare osk_timer_button in un div anziche' un button
    qualcosa in UI per indicare che match_timer e' in pausa
    invio vincitore
    se gs finisce, modal per segnare il vincitore
    animazione apertura e chiusura modal
    In GS, se scatta Osk match_timer si ferma al wazaari (ma osk_timer continua correttamente fino a ippon)
    premere i button li mette in focus e perdo le key shortcut
*/

const refresh_rate = 200;
const index_to_name = ['none', 'red', 'white'];
const name_to_index = { none: 0, red: 1, white: 2 };
const shido_to_lose = 3;

export default function MatchTimer() {
  // should be in props
  const category = 'Cadetti U66 M';
  const red_name = 'Mario Rossi';
  const red_club = 'Judo Kodokan Roma';
  const white_name = 'Giuseppe Esposito';
  const white_club = 'Judo Club Napoli';

  // initial value from props
  const [ippon_to_win, setIpponToWin] = useState(1);
  const [wazaari_to_win, setWazaariToWin] = useState(2);
  const [total_time, setTotalTime] = useState(240);
  const [gs_time, setGsTime] = useState(Infinity);
  const [ippon_osk_time, setIpponOskTime] = useState(20);
  const [wazaari_osk_time, setWazaariOskTime] = useState(10);
  function setParams(params: Params) {
    setIpponToWin(params.ippon_to_win);
    setWazaariToWin(params.wazaari_to_win);
    setTotalTime(params.total_time);
    setGsTime(params.gs_time);
    setIpponOskTime(params.ippon_osk_time);
    setWazaariOskTime(params.wazaari_osk_time);
  }

  // value could be present in props (recover match)
  const [match_timer, setMatchTimer] = useState(total_time); // same props value of total_time or the recovered time
  const [is_match_on, setIsMatchOn] = useState(false);
  const [is_gs, setIsGs] = useState(false);

  const [red_ippon, setRedIppon] = useState(0);
  const [red_wazaari, setRedWazaari] = useState(0);
  const [red_shido, setRedShido] = useState(0);
  const [white_ippon, setWhiteIppon] = useState(0);
  const [white_wazaari, setWhiteWazaari] = useState(0);
  const [white_shido, setWhiteShido] = useState(0);

  const [osk_timer, setOskTimer] = useState(0);
  const [is_osk_on, setIsOskOn] = useState(false);
  const [osk_owner, setOskOwner] = useState(0);
  const [last_osk_timer, setLastOskTimer] = useState(0);
  const [has_osk_wazaari_given, setHasOskWazaariGiven] = useState(false);
  const [has_osk_ippon_given, setHasOskIpponGiven] = useState(false);

  const [winner, setWinner] = useState(0);

  const [is_info_open, setIsInfoOpen] = useState(false);
  const [is_modify_open, setIsModifyOpen] = useState(false);

  // // // // // /Points Functions // // // // // // // // // // // // // // // // // // // // // // // // // // 

  /** generic function to increase or decrease a point, checking it doesn't go over the limits */
  function increasePoint(
    increase: number,
    point: number,
    max_point: number,
    setPoint: (cb: (prevPoint: number) => number) => void
  ) {
    if (increase === 0) return;
    if (point + increase < 0) return;
    if (point + increase > max_point) return;
    setPoint((prevPoint) => prevPoint + increase);
  }

  const increaseRedIppon = (increase: number) =>
    increasePoint(increase, red_ippon, ippon_to_win, setRedIppon);
  const increaseRedWazaari = (increase: number) =>
    increasePoint(increase, red_wazaari, wazaari_to_win, setRedWazaari);
  const increaseRedShido = (increase: number) =>
    increasePoint(increase, red_shido, shido_to_lose, setRedShido);
  const increaseWhiteIppon = (increase: number) =>
    increasePoint(increase, white_ippon, ippon_to_win, setWhiteIppon);
  const increaseWhiteWazaari = (increase: number) =>
    increasePoint(increase, white_wazaari, wazaari_to_win, setWhiteWazaari);
  const increaseWhiteShido = (increase: number) =>
    increasePoint(increase, white_shido, shido_to_lose, setWhiteShido);

  function playMatchTimer() {
    if (!is_match_on) setLastOskTimer(0);
    setIsMatchOn((prec) => !prec);
  }

  function playOskTimer() {
    // Sonomama
    if (osk_timer > 0) setIsOskOn((prec) => !prec);
  }

  function startOsk(athlete: 'red' | 'white') {
    setIsOskOn(true);
    setOskOwner(name_to_index[athlete]);
    setLastOskTimer(0);
  }

  function endOsk() {
    setLastOskTimer(osk_timer);
    setIsOskOn(false);
    setOskOwner(name_to_index['none']);
    setHasOskIpponGiven(false);
    setHasOskWazaariGiven(false);
    setOskTimer(-0.2);
  }

  function switchOskOwner(athlete: 'red' | 'white') {
    const old_owner = index_to_name[osk_owner];
    if (index_to_name[osk_owner] === athlete) return;
    if (has_osk_ippon_given) {
      if (old_owner === 'red') {
        increaseWhiteIppon(1);
        increaseRedIppon(-1);
      }
      if (old_owner === 'white') {
        increaseRedIppon(1);
        increaseWhiteIppon(-1);
      }
    } else if (has_osk_wazaari_given) {
      if (old_owner === 'red') {
        increaseWhiteWazaari(1);
        increaseRedWazaari(-1);
      }
      if (old_owner === 'white') {
        increaseRedWazaari(1);
        increaseWhiteWazaari(-1);
      }
    }
    setOskOwner(name_to_index[athlete]);
  }

  function manageOskFromArrowKey(athlete: 'red' | 'white') {
    if (!is_osk_on) startOsk(athlete);
    else switchOskOwner(athlete);
  }

  // // // // // /Keyboard shortcuts// // // // // // // // // // // // // // // // // // // // // // // // // // 
  const keyboard_shortcuts: {
    [key: string]: {
      name: string;
      setFunction: () => void;
      translate?: string;
    };
  } = {
    Q: { name: 'Aggiungi Shido Rosso', setFunction: () => increaseRedShido(1) },
    W: { name: 'Aggiungi Ippon Rosso', setFunction: () => increaseRedIppon(1) },
    E: {
      name: 'Aggiungi Waza-ari Rosso',
      setFunction: () => increaseRedWazaari(1),
    },
    A: { name: 'Rimouvi Shido Rosso', setFunction: () => increaseRedShido(-1) },
    S: { name: 'Rimouvi Ippon Rosso', setFunction: () => increaseRedIppon(-1) },
    D: {
      name: 'Rimouvi Waza-ari Rosso',
      setFunction: () => increaseRedWazaari(-1),
    },

    U: {
      name: 'Aggiungi Ippon Bianco',
      setFunction: () => increaseWhiteIppon(1),
    },
    I: {
      name: 'Aggiungi Waza-ari Bianco',
      setFunction: () => increaseWhiteWazaari(1),
    },
    O: {
      name: 'Aggiungi Shido Bianco',
      setFunction: () => increaseWhiteShido(1),
    },
    J: {
      name: 'Rimouvi Ippon Bianco',
      setFunction: () => increaseWhiteIppon(-1),
    },
    K: {
      name: 'Rimouvi Waza-ari Bianco',
      setFunction: () => increaseWhiteWazaari(-1),
    },
    L: {
      name: 'Rimouvi Shido Bianco',
      setFunction: () => increaseWhiteShido(-1),
    },

    Space: {
      name: 'Inizia/Pausa Timer',
      translate: 'Barra Spaziatrice',
      setFunction: () => playMatchTimer(),
    },
    ArrowLeft: {
      name: 'Osaekomi Rosso',
      translate: 'Freccia Sinistra',
      setFunction: () => manageOskFromArrowKey('red'),
    },
    ArrowRight: {
      name: 'Osaekomi Bianco',
      translate: 'Freccia Destra',
      setFunction: () => manageOskFromArrowKey('white'),
    },
    ArrowDown: {
      name: 'Termina Osaekomi',
      translate: 'Freccia Giù',
      setFunction: () => endOsk(),
    },
    ArrowUp: {
      name: 'Sonomama Osaekomi',
      translate: 'Freccia Su',
      setFunction: () => playOskTimer(),
    },
  };

  /** get keyboard event and launch the corresponding function if it is a button we use */
  function keyboardEventShortcuts(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.repeat) return;
    const code = e.code.replace('Key', '');
    if (!!keyboard_shortcuts[code]) keyboard_shortcuts[code].setFunction();
  }

  /** write keyboard_shortcuts in a readable format */
  function getKeyboardShortcutInfo() {
    let kb_info_elem = [];
    for (let field in keyboard_shortcuts) {
      const tasto = keyboard_shortcuts[field].translate || field;
      const name = keyboard_shortcuts[field].name.padEnd(25, ' ');
      kb_info_elem.push(
        <span>
          {name}: {tasto}
        </span>
      );
    }
    return kb_info_elem;
  }

  // // // // // /TOP ROW// // // // // // // // // // // // // // // // // // // // // // // // // // 

  /** returns a function that calls @param setFunction to false. Used to pass to a modal as handleClose */
  const handleClose = (setFunction: Function) => {
    return () => setFunction(false);
  };

  /** get the button to open the information about the page */
  function getInfoButton() {
    return (
      <div id='info-button-container'>
        <button
          className='orange'
          id='info-button'
          onClick={() => setIsInfoOpen(true)}
        >
          Info
        </button>
        {is_info_open && (
          <Modal handleClose={handleClose(setIsInfoOpen)}>
            <div className='info'>{getKeyboardShortcutInfo()}</div>
          </Modal>
        )}
      </div>
    );
  }

  function getModifyParamsButton() {
    return (
      <div id='current-tournament-container'>
        <button
          className='white'
          id='current-tournament-button'
          onClick={() => setIsModifyOpen(true)}
        >
          {category}
          {<div className='seems-like-button orange'>Modifica Parametri</div>}
        </button>
        {is_modify_open && (
          <Modal handleClose={handleClose(setIsModifyOpen)}>
            <ModifyParams
              handleClose={handleClose(setIsModifyOpen)}
              match_timer={match_timer}
              setMatchTimer={setMatchTimer}
              params={{
                ippon_to_win,
                wazaari_to_win,
                total_time,
                gs_time,
                ippon_osk_time,
                wazaari_osk_time,
              }}
              setParams={setParams}
            ></ModifyParams>
          </Modal>
        )}
      </div>
    );
  }

  /** start timer. if it gets below zero, match ends and maybe golden score starts */
  useEffect(() => {
    if (is_match_on)
      setTimeout(() => {
        // activate golden score
        if (match_timer < 0) {
          setMatchTimer(0.6); // a little bit extra or the timer will need to be double started after gs
          if (!is_osk_on) setIsGs(true);
          setIsMatchOn(false);
        }

        // golden scoore is finished
        if (is_gs && match_timer > gs_time) return setIsMatchOn(false);

        // continue timer
        if (is_gs)
          setMatchTimer(
            (prev_timer) =>
              Math.trunc((prev_timer + refresh_rate / 1000) * 10) / 10
          );
        else
          setMatchTimer(
            (prev_timer) =>
              Math.trunc((prev_timer - refresh_rate / 1000) * 10) / 10
          );
      }, refresh_rate);
  }, [match_timer, is_match_on]);

  /** check if golden score is needed when match ends */
  useEffect(() => {
    // if both are even, the golden score will start
    if (is_gs && red_ippon === white_ippon && red_wazaari === white_wazaari)
      return;

    setIsGs(false);
    if (red_ippon > white_ippon) return setWinner(name_to_index.red);
    if (red_ippon < white_ippon) return setWinner(name_to_index.white);
    if (red_wazaari > white_wazaari) return setWinner(name_to_index.red);
    if (red_wazaari < white_wazaari) return setWinner(name_to_index.white);
  }, [is_gs]);

  /** convert math_timer seconds in a nice format */
  function getMatchTimer() {
    const min = Math.trunc(match_timer / 60);
    const sec = Math.trunc(match_timer % 60);
    const min_string = min < 10 ? `0${min}` : `${min}`;
    const sec_string = sec < 10 ? `0${sec}` : `${sec}`;
    const timer_string = `${min_string}:${sec_string}`;

    return (
      <div id='match-timer-container'>
        <button
          className='black'
          id='match-timer-button'
          onClick={() => playMatchTimer()}
        >
          {timer_string}
        </button>
      </div>
    );
  }

  // // // // // /SCORE ROW// // // // // // // // // // // // // // // // // // // // // // // // // // 

  /** returns the value given from the mouse */
  function getScoreIncrease(e: React.MouseEvent) {
    e.preventDefault();
    const MOUSE_CLICKS = [
      'LEFT_CLICK',
      'MIDDLE_CLICK',
      'RIGHT_CLICK',
      'ERROR',
      'ERROR',
    ];
    if (MOUSE_CLICKS[e.button] === 'LEFT_CLICK') return 1;
    if (MOUSE_CLICKS[e.button] === 'RIGHT_CLICK') return -1;
    return 0;
  }

  /** check if someone wins for score assignment */
  useEffect(() => {
    let winner = name_to_index['none'];
    if (red_ippon === ippon_to_win) winner = name_to_index.red;
    if (red_wazaari === wazaari_to_win) winner = name_to_index.red;
    if (white_shido === shido_to_lose) winner = name_to_index.red;
    if (is_gs && (red_ippon > white_ippon || red_wazaari > white_wazaari))
      winner = name_to_index.red;

    if (white_ippon === ippon_to_win) winner = name_to_index.white;
    if (white_wazaari === wazaari_to_win) winner = name_to_index.white;
    if (red_shido === shido_to_lose) winner = name_to_index.white;
    if (is_gs && (white_ippon > red_ippon || white_wazaari > red_wazaari))
      winner = name_to_index.white;

    if (winner != name_to_index['none']) setIsMatchOn(false);
    setWinner(winner);
  }, [
    red_ippon,
    red_wazaari,
    red_shido,
    white_ippon,
    white_wazaari,
    white_shido,
  ]);

  function getScoreRow() {
    return (
      <>
        <div
          className='shido-flexbox'
          id='red-shido'
          onMouseDown={(e) => increaseRedShido(getScoreIncrease(e))}
        >
          {red_shido > 0 && (
            <img className='shido-img' src='shido-yellow.png' alt='1 shido' />
          )}
          {red_shido > 1 && (
            <img className='shido-img' src='shido-yellow.png' alt='2 shido' />
          )}
          {red_shido > 2 && (
            <img className='shido-img' src='shido-red.png' alt='3 shido' />
          )}
        </div>
        <div
          className='score-point'
          id='red-ippon'
          onMouseDown={(e) => increaseRedIppon(getScoreIncrease(e))}
        >
          {red_ippon}
        </div>
        <div
          className='score-point'
          id='red-wazaari'
          onMouseDown={(e) => increaseRedWazaari(getScoreIncrease(e))}
        >
          {red_wazaari}
        </div>
        <div
          className='score-point'
          id='white-ippon'
          onMouseDown={(e) => increaseWhiteIppon(getScoreIncrease(e))}
        >
          {white_ippon}
        </div>
        <div
          className='score-point'
          id='white-wazaari'
          onMouseDown={(e) => increaseWhiteWazaari(getScoreIncrease(e))}
        >
          {white_wazaari}
        </div>
        <div
          className='shido-flexbox'
          id='white-shido'
          onMouseDown={(e) => increaseWhiteShido(getScoreIncrease(e))}
        >
          {white_shido > 0 && (
            <img className='shido-img' src='shido-yellow.png' alt='1 shido' />
          )}
          {white_shido > 1 && (
            <img className='shido-img' src='shido-yellow.png' alt='2 shido' />
          )}
          {white_shido > 2 && (
            <img className='shido-img' src='shido-red.png' alt='3 shido' />
          )}
        </div>
      </>
    );
  }

  function getTextRow() {
    return (
      <>
        <div className='score-text' id='red-shido-text'>
          {red_shido === shido_to_lose ? `Hansuko Make` : `${red_shido} Shido`}
        </div>
        <div className='score-text' id='red-ippon-text'>
          Ippon
        </div>
        <div className='score-text' id='red-wazaari-text'>
          Waza-Ari
        </div>
        <div className='score-text' id='white-ippon-text'>
          Ippon
        </div>
        <div className='score-text' id='white-wazaari-text'>
          Waza-Ari
        </div>
        <div className='score-text' id='white-shido-text'>
          {white_shido === shido_to_lose
            ? `Hansuko Make`
            : `${white_shido} Shido`}
        </div>
      </>
    );
  }

  // // // // // /OSAEKOMI ROW// // // // // // // // // // // // // // // // // // // // // // // // // // 

  /** start osk timer. if it's over the time for wazaari, it assigns it to the osk holder. if it's over the time for ippon, it stops the timer, remove the wazaari and assings ippon to the winner */
  useEffect(() => {
    if (is_osk_on)
      setTimeout(() => {
        if (!has_osk_wazaari_given && osk_timer > wazaari_osk_time) {
          if (osk_owner === name_to_index.red)
            setRedWazaari((prevWaz) => prevWaz + 1);
          if (osk_owner === name_to_index.white)
            setWhiteWazaari((prevWaz) => prevWaz + 1);
          setHasOskWazaariGiven(true);
        }

        if (!has_osk_ippon_given && osk_timer > ippon_osk_time) {
          if (osk_owner === name_to_index.red) {
            setRedIppon((prevWaz) => prevWaz + 1);
            setRedWazaari((prevWaz) => prevWaz - 1);
          }
          if (osk_owner === name_to_index.white) {
            setWhiteIppon((prevWaz) => prevWaz + 1);
            setWhiteWazaari((prevWaz) => prevWaz - 1);
          }
          setHasOskIpponGiven(true);
        }

        if (osk_timer < ippon_osk_time)
          setOskTimer((prev_timer) => prev_timer + refresh_rate / 1000);
      }, refresh_rate);
  }, [osk_timer, is_osk_on]);

  /** decide what to show on the osaekomi bar side: start, my bar, buttons to end or switch */
  function getOskBar(athlete: 'red' | 'white') {
    if (osk_timer <= 0)
      return (
        <div className='osk-buttons'>
          <button
            className='start_osk orange'
            onClick={() => startOsk(athlete)}
          >
            Inizia OsaeKomi
          </button>
        </div>
      );

    if (osk_owner === name_to_index[athlete])
      return (
        <div
          className='osk-bar'
          id={`${athlete}-osk-bar`}
          style={
            {
              '--width': (osk_timer / ippon_osk_time) * 100,
            } as React.CSSProperties
          }
        />
      );

    return (
      <div className='osk-buttons'>
        <button className='orange' onClick={() => endOsk()}>
          Termina Osaekomi
        </button>
        <button className='orange' onClick={() => switchOskOwner(athlete)}>
          Sbagliato lato
        </button>
      </div>
    );
  }

  /** decide whether to show the osaekomi timer or not */
  function getOskTimer() {
    let elem = null;
    if (osk_timer > 0)
      elem = (
        <button
          className='black'
          id='osk-timer-button'
          onClick={() => playOskTimer()}
        >
          {Math.trunc(osk_timer)}
        </button>
      );
    if (last_osk_timer !== 0)
      elem = (
        <button className='black' id='osk-timer-button'>
          {Math.trunc(last_osk_timer)}
        </button>
      );
    return <div id='osk-timer-container'>{elem}</div>;
  }

  // // // // // /NAME ROW// // // // // // // // // // // // // // // // // // // // // // // // // // 

  /** decide whether to show the names or the winner name */
  function getNameRow() {
    const default_row = (
      <div className='name-row-flexbox'>
        <div className='athlete-name' id='red-name'>
          {red_name}
        </div>
        <div className='athlete-club' id='red-club'>
          {red_club}
        </div>
        <div className='vertical-black-line'></div>
        <div className='athlete-name' id='white-name'>
          {white_name}
        </div>
        <div className='athlete-club' id='white-club'>
          {white_club}
        </div>
      </div>
    );

    const getWinnerName = () => {
      if (winner === name_to_index['none']) return 'ERROR';
      if (winner === name_to_index.red) return red_name;
      if (winner === name_to_index.white) return white_name;
    };
    const winner_name = getWinnerName();

    const winner_row = (
      <div className='name-row-flexbox'>
        <div id='winner-sign'>Winner</div>
        <div id='winner-name'>{winner_name}</div>
        <div id='send-match-data-container'>
          <button id='send-match-data' className='orange'>
            Conferma e Invia
          </button>
        </div>
      </div>
    );

    if (!winner) return default_row;
    return winner_row;
  }

  // // // // // /RETURN// // // // // // // // // // // // // // // // // // // // // // // // // // 

  return (
    <div
      className='wrapper'
      tabIndex={0}
      onKeyDown={(e) => keyboardEventShortcuts(e)}
      onContextMenu={(e) => e.preventDefault()}
    >
      <div className='half-colored-background'></div>
      <div className='grid-container'>
        {/* top row */}
        {getInfoButton()}
        <div id='gs-symbol'>{is_gs && 'GS'}</div>
        {getMatchTimer()}
        {getModifyParamsButton()}

        {/* score row */}
        {getScoreRow()}
        {getTextRow()}

        {/* osae-komi row */}
        {getOskBar('red')}
        {getOskTimer()}
        {getOskBar('white')}

        {/* name row */}
        {getNameRow()}
      </div>
    </div>
  );
}
