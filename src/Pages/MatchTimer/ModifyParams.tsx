import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Params } from './types';
import './modal.css';

export function ModifyParams(props: {
  handleClose: () => void;
  match_timer: number;
  setMatchTimer: (time: number) => void;
  params: Params;
  setParams: (params: Params) => void;
}) {
  const { handleClose, match_timer, setMatchTimer, params, setParams } = props;

  const getSec = (num: number) => Math.trunc(num % 60);
  const getMin = (num: number) => Math.trunc(num / 60);
  const getTotalSec = (min: number, sec: number) => min * 60 + sec;

  const [match_timer_min, setMatchTimerMin] = useState(getMin(match_timer));
  const [match_timer_sec, setMatchTimerSec] = useState(getSec(match_timer));
  const [total_time_min, setTotalTimeMin] = useState(getMin(params.total_time));
  const [total_time_sec, setTotalTimeSec] = useState(getSec(params.total_time));
  const [gs_time_min, setGsTimeMin] = useState(getMin(params.gs_time));
  const [gs_time_sec, setGsTimeSec] = useState(getSec(params.gs_time));
  const [ippon_to_win, setIpponToWin] = useState(params.ippon_to_win);
  const [wazaari_to_win, setWazaariToWin] = useState(params.wazaari_to_win);
  const [ippon_osk_time, setIpponOskTime] = useState(params.ippon_osk_time);
  const [wazaari_osk_time, setWazaariOskTime] = useState(
    params.wazaari_osk_time
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

        const new_params: Params = {
          total_time: getTotalSec(total_time_min, total_time_sec),
          gs_time: getTotalSec(gs_time_min, gs_time_sec),
          ippon_to_win,
          wazaari_to_win,
          ippon_osk_time,
          wazaari_osk_time,
        };

        setMatchTimer(getTotalSec(match_timer_min, match_timer_sec));
        setParams(new_params);
        handleClose();
      }}
    >
      <label className='timer-label'>
        <span className='input-description'>Tempo attuale</span>
        <div className='input-container'>
          {getInputMinuteField(match_timer_min, setMatchTimerMin)}:
          {getInputMinuteField(match_timer_sec, setMatchTimerSec)}
        </div>
      </label>
      <label className='timer-label'>
        <span className='input-description'>Tempo regolamentare</span>
        <div className='input-container'>
          {getInputMinuteField(total_time_min, setTotalTimeMin)}:
          {getInputMinuteField(total_time_sec, setTotalTimeSec)}
        </div>
      </label>
      <label className='timer-label'>
        <span className='input-description'>Tempo Golden Score</span>
        <div className='input-container'>
          {getInputMinuteField(gs_time_min, setGsTimeMin)}:
          {getInputMinuteField(gs_time_sec, setGsTimeSec)}
        </div>
      </label>
      <label className='timer-label'>
        <span className='input-description'>Ippon per vincere</span>
        <div className='input-container'>
          {getInputNumberField(ippon_to_win, setIpponToWin)}
        </div>
      </label>
      <label className='timer-label'>
        <span className='input-description'>Waza-ari per vincere</span>
        <div className='input-container'>
          {getInputNumberField(wazaari_to_win, setWazaariToWin)}
        </div>
      </label>
      <label className='timer-label'>
        <span className='input-description'>Osaekomi per Ippon</span>
        <div className='input-container'>
          {getInputNumberField(ippon_osk_time, setIpponOskTime)}
        </div>
      </label>
      <label className='timer-label'>
        <span className='input-description'>Osaekomi per Waza-ari</span>
        <div className='input-container'>
          {getInputNumberField(wazaari_osk_time, setWazaariOskTime)}
        </div>
      </label>
      <button className='orange' type='submit' form='params-form'>
        Salva
      </button>
    </form>
  );
}
