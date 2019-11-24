import { combineReducers } from 'redux';
import iconReducer from './iconReducer';
import notiReducer from './notiReducer';

export default combineReducers({
  icons: iconReducer,
  notifications: notiReducer
});
