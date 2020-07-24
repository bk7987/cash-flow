import cashFlow from '../../apis/cashFlow';
import { formatDate } from '../../util';

import {
  FETCH_OCCURRENCES,
  SET_STARTING_BALANCE,
  SET_START_DATE,
  SET_END_DATE,
} from '../types';

export const setStartingBalance = balance => {
  return { type: SET_STARTING_BALANCE, payload: balance };
};

export const setStartDate = startDate => {
  return { type: SET_START_DATE, payload: startDate };
};

export const setEndDate = endDate => {
  return { type: SET_END_DATE, payload: endDate };
};

export const fetchOccurrences = (startDate, endDate) => async (dispatch, getState) => {
  if (!startDate) {
    startDate = formatDate(getState().occurrenceList.startDate);
  }

  if (!endDate) {
    endDate = formatDate(getState().occurrenceList.endDate);
  }

  return cashFlow.get('/occurrences', {
    headers: {
      'Authorization': `Bearer ${ getState().auth.user.token }`
    },
    params: { startDate, endDate }
  }).then(res => {
    dispatch({ type: FETCH_OCCURRENCES, payload: res.data.data });
    return res.data;
  }).catch(error => {
    return error.response.data;
  });
};