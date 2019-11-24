import { PUSH_NOTIFICATION, DISMISS_NOTIFICATION } from './types';

export const pushError = text => dispatch => {
  dispatch({
    type: PUSH_NOTIFICATION,
    payload: text,
    isError: true
  });
};

export const pushNoti = text => dispatch => {
  dispatch({
    type: PUSH_NOTIFICATION,
    payload: text,
    isError: false
  });
};

export const dismissNoti = () => dispatch => {
  dispatch({
    type: DISMISS_NOTIFICATION
  });
};
