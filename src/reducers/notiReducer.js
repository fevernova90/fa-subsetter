import { PUSH_NOTIFICATION, DISMISS_NOTIFICATION } from '../actions/types';

const initialState = {
  show: false,
  text: '',
  isError: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case PUSH_NOTIFICATION:
      return {
        show: true,
        text: action.payload,
        isError: action.isError || false
      };
    case DISMISS_NOTIFICATION:
      return {
        show: false,
        text: '',
        isError: false
      };
    default:
      return state;
  }
}
