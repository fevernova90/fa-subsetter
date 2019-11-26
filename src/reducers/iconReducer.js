import {
  GENERATE_ICONS,
  NEW_ICON,
  DELETE_ICON,
  SAVING,
  SAVED,
  RESET_SAVING,
  DOWNLOADING,
  DOWNLOADED,
  RESET_DOWNLOAD
} from '../actions/types';

const initialState = {
  isSaving: false,
  isSaved: false,
  isDownloading: false,
  isDownloaded: false,
  items: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GENERATE_ICONS:
      return {
        ...state,
        items: action.payload
      };
    case NEW_ICON:
      return {
        ...state,
        isSaved: false,
        isDownloaded: false,
        items: [...state.items, action.payload]
      };
    case DELETE_ICON:
      return {
        ...state,
        items: state.items.filter(item => item.tag !== action.payload)
      };
    case SAVING:
      return {
        ...state,
        isSaving: true,
        isSaved: false
      };
    case SAVED:
      return {
        ...state,
        isSaving: false,
        isSaved: true
      };
    case RESET_SAVING:
      return {
        ...state,
        isSaving: false,
        isSaved: false
      };
    case DOWNLOADING:
      return {
        ...state,
        isDownloading: true,
        isDownloaded: false
      };
    case DOWNLOADED:
      return {
        ...state,
        isDownloading: false,
        isDownloaded: true
      };
    case RESET_DOWNLOAD:
      return {
        ...state,
        isDownloading: false,
        isDownloaded: false
      };
    default:
      return state;
  }
}
