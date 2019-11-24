import { GENERATE_ICONS, NEW_ICON, DELETE_ICON } from './types';
import { pushError, pushNoti } from './notiActions';

export const getIcons = () => dispatch => {
  console.log('fetching');

  // Get icons from API
  fetch('/saved-icons')
    .then(data => data.json())
    .then(json => {
      dispatch({
        type: GENERATE_ICONS,
        payload: json
      });
    })
    .catch(err => {
      dispatch(
        pushError('Error fetching data from internal API server. ' + err)
      );
    });
  // Dispatch the fetched icon
};

export const addIcon = iconData => (dispatch, getState) => {
  console.log('Adding new icon and regenerate');

  // Add new icon to the library and regerate
  const prevIcons = getState().icons.items;
  const duplicated = prevIcons.find(icon => icon.tag === iconData.tag);
  if (duplicated) {
    console.log('duplicated');
    // Dispatch error notifications
    dispatch(pushError('Trying to add duplicated icon'));
    return;
  }

  // Dispatch new icon
  dispatch({
    type: NEW_ICON,
    payload: iconData
  });
};

export const deleteIcon = iconTagToDelete => dispatch => {
  dispatch({
    type: DELETE_ICON,
    payload: iconTagToDelete
  });
};

export const saveAndGenerate = currentIcons => dispatch => {
  console.log('Triggered save action');

  fetch('/gen-webfonts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(currentIcons)
  })
    .then(data => data.json())
    .then(json => {
      console.log('Client: ', currentIcons);
      console.log('Server: ', json);
      if (json.length === currentIcons.length) {
        console.log('Success saved and generate');
        // Dispatch Success notifications
        dispatch(
          pushNoti('Saved and generated css/webfonts, ready for download.')
        );
      } else {
        console.log('Discrepencies in fetch data between client and servers');
        // Dispatch error
        dispatch(pushError('Error while saving. Discrepencies of data.'));
      }
    })
    .catch(err => {
      console.log('Fetch error in saveAndGenerateAction');
      //Dispatch error
      dispatch(pushError('Fetch error in saveAndGenerateAction' + err));
    });
};
