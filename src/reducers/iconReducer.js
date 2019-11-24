import { GENERATE_ICONS, NEW_ICON, DELETE_ICON } from '../actions/types';

const initialState = {
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
        items: [...state.items, action.payload]
      };
    case DELETE_ICON:
      return {
        ...state,
        items: state.items.filter(item => item.tag !== action.payload)
      };
    default:
      return state;
  }
}
