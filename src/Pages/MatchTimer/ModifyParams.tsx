import React, { useState } from 'react';
import { Params } from './types';
import './modal.css';

export function ModifyParams(props: {
  handleClose: () => void;
  matchTimer: number;
  setMatchTimer: (time: number) => void;
  params: Params;
  setParams: (params: Params) => void;
}) {
  const { handleClose, matchTimer, setMatchTimer, params, setParams } = props;

  const getSec = (num: number) => Math.trunc(num % 60);
  const getMin = (num: number) => Math.trunc(num / 60);
  const getTotalSec = (min: number, sec: number) => min * 60 + sec;

  const [matchTimerMin, setMatchTimerMin] = useState(getMin(matchTimer));
  const [matchTimerSec, setMatchTimerSec] = useState(getSec(matchTimer));
  const [totalTimeMin, setTotalTimeMin] = useState(getMin(params.totalTime));
  const [totalTimeSec, setTotalTimeSec] = useState(getSec(params.totalTime));
  const [gsTimeMin, setGsTimeMin] = useState(getMin(params.gsTime));
  const [gsTimeSec, setGsTimeSec] = useState(getSec(params.gsTime));
  const [ipponToWin, setIpponToWin] = useState(params.ipponToWin);
  const [wazaariToWin, setWazaariToWin] = useState(params.wazaariToWin);
  const [ipponOskTime, setIpponOskTime] = useState(params.ipponOskTime);
  const [wazaariOskTime, setWazaariOskTime] = useState(
    params.wazaariOskTime
  );

  function getInputNumberField(num: number, setNum: Function) {
    return (
      <input
        type='number'
        className='.timer-input'
        value={num}
        onChange={(e) => {
          const value = Number(e.target.value);
          if (isNaN(value)) return;
          setNum(value);
        }}
      />
    );
  }

  function getInputMinuteField(num: number, setNum: Function) {
    return (
      <input
        type='number'
        className='.timer-input input-minute'
        value={num}
        onChange={(e) => {
          const value = Number(e.target.value);
          if (isNaN(value)) return;
          setNum(value);
        }}
      />
    );
  }

  return (
    <form
      id='params-form'
      onSubmit={(e) => {
        e.preventDefault();

        const newParams: Params = {
          totalTime: getTotalSec(totalTimeMin, totalTimeSec),
          gsTime: getTotalSec(gsTimeMin, gsTimeSec),
          ipponToWin,
          wazaariToWin,
          ipponOskTime,
          wazaariOskTime,
        };

        setMatchTimer(getTotalSec(matchTimerMin, matchTimerSec));
        setParams(newParams);
        handleClose();
      }}
    >
      <label className='timer-label'>
        <span className='input-description'>Tempo attuale</span>
        <div className='input-container'>
          {getInputMinuteField(matchTimerMin, setMatchTimerMin)}:
          {getInputMinuteField(matchTimerSec, setMatchTimerSec)}
        </div>
      </label>
      <label className='timer-label'>
        <span className='input-description'>Tempo regolamentare</span>
        <div className='input-container'>
          {getInputMinuteField(totalTimeMin, setTotalTimeMin)}:
          {getInputMinuteField(totalTimeSec, setTotalTimeSec)}
        </div>
      </label>
      <label className='timer-label'>
        <span className='input-description'>Tempo Golden Score</span>
        <div className='input-container'>
          {getInputMinuteField(gsTimeMin, setGsTimeMin)}:
          {getInputMinuteField(gsTimeSec, setGsTimeSec)}
        </div>
      </label>
      <label className='timer-label'>
        <span className='input-description'>Ippon per vincere</span>
        <div className='input-container'>
          {getInputNumberField(ipponToWin, setIpponToWin)}
        </div>
      </label>
      <label className='timer-label'>
        <span className='input-description'>Waza-ari per vincere</span>
        <div className='input-container'>
          {getInputNumberField(wazaariToWin, setWazaariToWin)}
        </div>
      </label>
      <label className='timer-label'>
        <span className='input-description'>Osaekomi per Ippon</span>
        <div className='input-container'>
          {getInputNumberField(ipponOskTime, setIpponOskTime)}
        </div>
      </label>
      <label className='timer-label'>
        <span className='input-description'>Osaekomi per Waza-ari</span>
        <div className='input-container'>
          {getInputNumberField(wazaariOskTime, setWazaariOskTime)}
        </div>
      </label>
      <button className='orange' type='submit' form='params-form'>
        Salva
      </button>
    </form>
  );
}
