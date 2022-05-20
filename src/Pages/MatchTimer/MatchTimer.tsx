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
    modificare oskTimer_button in un div anziche' un button
    qualcosa in UI per indicare che matchTimer e' in pausa
    invio vincitore
    se gs finisce, modal per segnare il vincitore
    animazione apertura e chiusura modal
    In GS, se scatta Osk matchTimer si ferma al wazaari (ma oskTimer continua correttamente fino a ippon)
    premere i button li mette in focus e perdo le key shortcut
*/

const refreshRate = 200;
const indexToName = ['none', 'red', 'white'];
const nameToIndex = { none: 0, red: 1, white: 2 };
const shidoToLose = 3;

export default function MatchTimer() {
  // should be in props
  const category = 'Cadetti U66 M';
  const redName = 'Mario Rossi';
  const redClub = 'Judo Kodokan Roma';
  const whiteName = 'Giuseppe Esposito';
  const whiteClub = 'Judo Club Napoli';

  // initial value from props
  const [ipponToWin, setIpponToWin] = useState(1);
  const [wazaariToWin, setWazaariToWin] = useState(2);
  const [totalTime, setTotalTime] = useState(240);
  const [gsTime, setGsTime] = useState(Infinity);
  const [ipponOskTime, setIpponOskTime] = useState(20);
  const [wazaariOskTime, setWazaariOskTime] = useState(10);
  function setParams(params: Params) {
    setIpponToWin(params.ipponToWin);
    setWazaariToWin(params.wazaariToWin);
    setTotalTime(params.totalTime);
    setGsTime(params.gsTime);
    setIpponOskTime(params.ipponOskTime);
    setWazaariOskTime(params.wazaariOskTime);
  }

  // value could be present in props (recover match)
  const [matchTimer, setMatchTimer] = useState(totalTime); // same props value of totalTime or the recovered time
  const [isMatchOn, setIsMatchOn] = useState(false);
  const [isGs, setIsGs] = useState(false);

  const [redIppon, setRedIppon] = useState(0);
  const [redWazaari, setRedWazaari] = useState(0);
  const [redShido, setRedShido] = useState(0);
  const [whiteIppon, setWhiteIppon] = useState(0);
  const [whiteWazaari, setWhiteWazaari] = useState(0);
  const [whiteShido, setWhiteShido] = useState(0);

  const [oskTimer, setOskTimer] = useState(0);
  const [isOskOn, setIsOskOn] = useState(false);
  const [oskOwner, setOskOwner] = useState(0);
  const [lastOskTimer, setLastOskTimer] = useState(0);
  const [hasOskWazaariGiven, setHasOskWazaariGiven] = useState(false);
  const [hasOskIpponGiven, setHasOskIpponGiven] = useState(false);

  const [winner, setWinner] = useState(0);

  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isModifyOpen, setIsModifyOpen] = useState(false);

  // // // // // /Points Functions // // // // // // // // // // // // // // // // // // // // // // // // // //

  /** generic function to increase or decrease a point, checking it doesn't go over the limits */
  function increasePoint(
    increase: number,
    point: number,
    maxPoint: number,
    setPoint: (cb: (prevPoint: number) => number) => void
  ) {
    if (increase === 0) return;
    if (point + increase < 0) return;
    if (point + increase > maxPoint) return;
    setPoint((prevPoint) => prevPoint + increase);
  }

  const increaseRedIppon = (increase: number) =>
    increasePoint(increase, redIppon, ipponToWin, setRedIppon);
  const increaseRedWazaari = (increase: number) =>
    increasePoint(increase, redWazaari, wazaariToWin, setRedWazaari);
  const increaseRedShido = (increase: number) =>
    increasePoint(increase, redShido, shidoToLose, setRedShido);
  const increaseWhiteIppon = (increase: number) =>
    increasePoint(increase, whiteIppon, ipponToWin, setWhiteIppon);
  const increaseWhiteWazaari = (increase: number) =>
    increasePoint(increase, whiteWazaari, wazaariToWin, setWhiteWazaari);
  const increaseWhiteShido = (increase: number) =>
    increasePoint(increase, whiteShido, shidoToLose, setWhiteShido);

  function playMatchTimer() {
    if (!isMatchOn) setLastOskTimer(0);
    setIsMatchOn((prec) => !prec);
  }

  function playOskTimer() {
    // Sonomama
    if (oskTimer > 0) setIsOskOn((prec) => !prec);
  }

  function startOsk(athlete: 'red' | 'white') {
    setIsOskOn(true);
    setOskOwner(nameToIndex[athlete]);
    setLastOskTimer(0);
  }

  function endOsk() {
    setLastOskTimer(oskTimer);
    setIsOskOn(false);
    setOskOwner(nameToIndex.none);
    setHasOskIpponGiven(false);
    setHasOskWazaariGiven(false);
    setOskTimer(-0.2);
  }

  function switchOskOwner(athlete: 'red' | 'white') {
    const oldOwner = indexToName[oskOwner];
    if (indexToName[oskOwner] === athlete) return;
    if (hasOskIpponGiven) {
      if (oldOwner === 'red') {
        increaseWhiteIppon(1);
        increaseRedIppon(-1);
      }
      if (oldOwner === 'white') {
        increaseRedIppon(1);
        increaseWhiteIppon(-1);
      }
    } else if (hasOskWazaariGiven) {
      if (oldOwner === 'red') {
        increaseWhiteWazaari(1);
        increaseRedWazaari(-1);
      }
      if (oldOwner === 'white') {
        increaseRedWazaari(1);
        increaseWhiteWazaari(-1);
      }
    }
    setOskOwner(nameToIndex[athlete]);
  }

  function manageOskFromArrowKey(athlete: 'red' | 'white') {
    if (!isOskOn) startOsk(athlete);
    else switchOskOwner(athlete);
  }

  // // // // // /Keyboard shortcuts// // // // // // // // // // // // // // // // // // // // // // // // // //
  const keyboardShortcuts: {
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
    if (keyboardShortcuts[code]) keyboardShortcuts[code].setFunction();
  }

  /** write keyboardShortcuts in a readable format */
  function getKeyboardShortcutInfo() {
    const kbInfoElem = [];
    for (const field in keyboardShortcuts) {
      const tasto = keyboardShortcuts[field].translate || field;
      const name = keyboardShortcuts[field].name.padEnd(25, ' ');
      kbInfoElem.push(
        <span>
          {name}: {tasto}
        </span>
      );
    }
    return kbInfoElem;
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
          className='timer-button orange'
          id='info-button'
          onClick={() => setIsInfoOpen(true)}
        >
          Info
        </button>
        {isInfoOpen && (
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
          className='timer-button white'
          id='current-tournament-button'
          onClick={() => setIsModifyOpen(true)}
        >
          {category}
          {<div className='seems-like-button orange'>Modifica Parametri</div>}
        </button>
        {isModifyOpen && (
          <Modal handleClose={handleClose(setIsModifyOpen)}>
            <ModifyParams
              handleClose={handleClose(setIsModifyOpen)}
              matchTimer={matchTimer}
              setMatchTimer={setMatchTimer}
              params={{
                ipponToWin,
                wazaariToWin,
                totalTime,
                gsTime,
                ipponOskTime,
                wazaariOskTime,
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
    if (isMatchOn) {
      setTimeout(() => {
        // activate golden score
        if (matchTimer < 0) {
          setMatchTimer(0.6); // a little bit extra or the timer will need to be double started after gs
          if (!isOskOn) setIsGs(true);
          setIsMatchOn(false);
        }

        // golden scoore is finished
        if (isGs && matchTimer > gsTime) return setIsMatchOn(false);

        // continue timer
        if (isGs) {
          setMatchTimer(
            (prevTimer) =>
              Math.trunc((prevTimer + refreshRate / 1000) * 10) / 10
          );
        } else {
          setMatchTimer(
            (prevTimer) =>
              Math.trunc((prevTimer - refreshRate / 1000) * 10) / 10
          );
        }
      }, refreshRate);
    }
  }, [matchTimer, isMatchOn]);

  /** check if golden score is needed when match ends */
  useEffect(() => {
    // if both are even, the golden score will start
    if (isGs && redIppon === whiteIppon && redWazaari === whiteWazaari) {
      return;
    }

    setIsGs(false);
    if (redIppon > whiteIppon) return setWinner(nameToIndex.red);
    if (redIppon < whiteIppon) return setWinner(nameToIndex.white);
    if (redWazaari > whiteWazaari) return setWinner(nameToIndex.red);
    if (redWazaari < whiteWazaari) return setWinner(nameToIndex.white);
  }, [isGs]);

  /** convert mathTimer seconds in a nice format */
  function getMatchTimer() {
    const min = Math.trunc(matchTimer / 60);
    const sec = Math.trunc(matchTimer % 60);
    const minString = min < 10 ? `0${min}` : `${min}`;
    const secString = sec < 10 ? `0${sec}` : `${sec}`;
    const timerString = `${minString}:${secString}`;

    return (
      <div id='match-timer-container'>
        <button
          className='timer-button black'
          id='match-timer-button'
          onClick={() => playMatchTimer()}
        >
          {timerString}
        </button>
      </div>
    );
  }

  // // // // // /SCORE ROW// // // // // // // // // // // // // // // // // // // // // // // // // //

  /** returns the value given from the mouse */
  function getScoreIncrease(e: React.MouseEvent) {
    e.preventDefault();
    const MOUSECLICKS = [
      'LEFTCLICK',
      'MIDDLECLICK',
      'RIGHTCLICK',
      'ERROR',
      'ERROR',
    ];
    if (MOUSECLICKS[e.button] === 'LEFTCLICK') return 1;
    if (MOUSECLICKS[e.button] === 'RIGHTCLICK') return -1;
    return 0;
  }

  /** check if someone wins for score assignment */
  useEffect(() => {
    let winner = nameToIndex.none;
    if (redIppon === ipponToWin) winner = nameToIndex.red;
    if (redWazaari === wazaariToWin) winner = nameToIndex.red;
    if (whiteShido === shidoToLose) winner = nameToIndex.red;
    if (isGs && (redIppon > whiteIppon || redWazaari > whiteWazaari)) {
      winner = nameToIndex.red;
    }

    if (whiteIppon === ipponToWin) winner = nameToIndex.white;
    if (whiteWazaari === wazaariToWin) winner = nameToIndex.white;
    if (redShido === shidoToLose) winner = nameToIndex.white;
    if (isGs && (whiteIppon > redIppon || whiteWazaari > redWazaari)) {
      winner = nameToIndex.white;
    }

    if (winner !== nameToIndex.none) setIsMatchOn(false);
    setWinner(winner);
  }, [
    redIppon,
    redWazaari,
    redShido,
    whiteIppon,
    whiteWazaari,
    whiteShido,
  ]);

  function getScoreRow() {
    return (
      <>
        <div
          className='shido-flexbox'
          id='red-shido'
          onMouseDown={(e) => increaseRedShido(getScoreIncrease(e))}
        >
          {redShido > 0 && (
            <img className='shido-img' src='shido-yellow.png' alt='1 shido' />
          )}
          {redShido > 1 && (
            <img className='shido-img' src='shido-yellow.png' alt='2 shido' />
          )}
          {redShido > 2 && (
            <img className='shido-img' src='shido-red.png' alt='3 shido' />
          )}
        </div>
        <div
          className='score-point'
          id='red-ippon'
          onMouseDown={(e) => increaseRedIppon(getScoreIncrease(e))}
        >
          {redIppon}
        </div>
        <div
          className='score-point'
          id='red-wazaari'
          onMouseDown={(e) => increaseRedWazaari(getScoreIncrease(e))}
        >
          {redWazaari}
        </div>
        <div
          className='score-point'
          id='white-ippon'
          onMouseDown={(e) => increaseWhiteIppon(getScoreIncrease(e))}
        >
          {whiteIppon}
        </div>
        <div
          className='score-point'
          id='white-wazaari'
          onMouseDown={(e) => increaseWhiteWazaari(getScoreIncrease(e))}
        >
          {whiteWazaari}
        </div>
        <div
          className='shido-flexbox'
          id='white-shido'
          onMouseDown={(e) => increaseWhiteShido(getScoreIncrease(e))}
        >
          {whiteShido > 0 && (
            <img className='shido-img' src='shido-yellow.png' alt='1 shido' />
          )}
          {whiteShido > 1 && (
            <img className='shido-img' src='shido-yellow.png' alt='2 shido' />
          )}
          {whiteShido > 2 && (
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
          {redShido === shidoToLose ? 'Hansuko Make' : `${redShido} Shido`}
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
          {whiteShido === shidoToLose
            ? 'Hansuko Make'
            : `${whiteShido} Shido`}
        </div>
      </>
    );
  }

  // // // // // /OSAEKOMI ROW// // // // // // // // // // // // // // // // // // // // // // // // // //

  /** start osk timer. if it's over the time for wazaari, it assigns it to the osk holder. if it's over the time for ippon, it stops the timer, remove the wazaari and assings ippon to the winner */
  useEffect(() => {
    if (isOskOn) {
      setTimeout(() => {
        if (!hasOskWazaariGiven && oskTimer > wazaariOskTime) {
          if (oskOwner === nameToIndex.red) {
            setRedWazaari((prevWaz) => prevWaz + 1);
          }
          if (oskOwner === nameToIndex.white) {
            setWhiteWazaari((prevWaz) => prevWaz + 1);
          }
          setHasOskWazaariGiven(true);
        }

        if (!hasOskIpponGiven && oskTimer > ipponOskTime) {
          if (oskOwner === nameToIndex.red) {
            setRedIppon((prevWaz) => prevWaz + 1);
            setRedWazaari((prevWaz) => prevWaz - 1);
          }
          if (oskOwner === nameToIndex.white) {
            setWhiteIppon((prevWaz) => prevWaz + 1);
            setWhiteWazaari((prevWaz) => prevWaz - 1);
          }
          setHasOskIpponGiven(true);
        }

        if (oskTimer < ipponOskTime) {
          setOskTimer((prevTimer) => prevTimer + refreshRate / 1000);
        }
      }, refreshRate);
    }
  }, [oskTimer, isOskOn]);

  /** decide what to show on the osaekomi bar side: start, my bar, buttons to end or switch */
  function getOskBar(athlete: 'red' | 'white') {
    if (oskTimer <= 0) {
      return (
        <div className='osk-buttons'>
          <button
            className='timer-button startOsk orange'
            onClick={() => startOsk(athlete)}
          >
            Inizia OsaeKomi
          </button>
        </div>
      );
    }

    if (oskOwner === nameToIndex[athlete]) {
      return (
        <div
          className='osk-bar'
          id={`${athlete}-osk-bar`}
          style={
            {
              '--width': (oskTimer / ipponOskTime) * 100,
            } as React.CSSProperties
          }
        />
      );
    }

    return (
      <div className='osk-buttons'>
        <button className='timer-button orange' onClick={() => endOsk()}>
          Termina Osaekomi
        </button>
        <button
          className='timer-button orange'
          onClick={() => switchOskOwner(athlete)}
        >
          Sbagliato lato
        </button>
      </div>
    );
  }

  /** decide whether to show the osaekomi timer or not */
  function getOskTimer() {
    let elem = null;
    if (oskTimer > 0) {
      elem = (
        <button
          className='timer-button black'
          id='osk-timer-button'
          onClick={() => playOskTimer()}
        >
          {Math.trunc(oskTimer)}
        </button>
      );
    }
    if (lastOskTimer !== 0) {
      elem = (
        <button className='timer-button black' id='osk-timer-button'>
          {Math.trunc(lastOskTimer)}
        </button>
      );
    }
    return <div id='osk-timer-container'>{elem}</div>;
  }

  // // // // // /NAME ROW// // // // // // // // // // // // // // // // // // // // // // // // // //

  /** decide whether to show the names or the winner name */
  function getNameRow() {
    const defaultRow = (
      <div className='name-row-flexbox'>
        <div className='athlete-name' id='red-name'>
          {redName}
        </div>
        <div className='athlete-club' id='red-club'>
          {redClub}
        </div>
        <div className='vertical-black-line'></div>
        <div className='athlete-name' id='white-name'>
          {whiteName}
        </div>
        <div className='athlete-club' id='white-club'>
          {whiteClub}
        </div>
      </div>
    );

    const getWinnerName = () => {
      if (winner === nameToIndex.none) return 'ERROR';
      if (winner === nameToIndex.red) return redName;
      if (winner === nameToIndex.white) return whiteName;
    };
    const winnerName = getWinnerName();

    const winnerRow = (
      <div className='name-row-flexbox'>
        <div id='winner-sign'>Winner</div>
        <div id='winner-name'>{winnerName}</div>
        <div id='send-match-data-container'>
          <button id='timer-button send-match-data' className='orange'>
            Conferma e Invia
          </button>
        </div>
      </div>
    );

    if (!winner) return defaultRow;
    return winnerRow;
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
        <div id='gs-symbol'>{isGs && 'GS'}</div>
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
