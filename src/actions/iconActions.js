import {
  GENERATE_ICONS,
  NEW_ICON,
  DELETE_ICON,
  SAVED,
  SAVING,
  RESET_SAVING,
  DOWNLOADED,
  DOWNLOADING,
  RESET_DOWNLOAD
} from './types';
import { pushError, pushNoti } from './notiActions';

export const downloadFiles = () => dispatch => {
  dispatch({ type: DOWNLOADING });
  fetch('/download')
    .then(resp => resp.blob())
    .then(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      // the filename you want
      a.download = 'css_webfonts.zip';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      dispatch({ type: DOWNLOADED });
    })
    .catch(err => {
      dispatch({ type: RESET_DOWNLOAD });
      pushError('Failed fetching file for download.');
    });
};

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
  const duplicatedTag = prevIcons.find(icon => icon.tag === iconData.tag);
  const duplicatedTitle = prevIcons.find(icon => icon.title === iconData.title);
  if (duplicatedTag) {
    console.log('duplicated tag');
    // Dispatch error notifications
    dispatch(pushError('Found existing Tag name, change to different tag.'));
    return;
  }

  if (duplicatedTitle) {
    console.log('duplicated title');
    // Dispatch error notifications
    dispatch(pushError('Found existing Title name, change to different name.'));
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
  dispatch({
    type: SAVING
  });
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
        dispatch({
          type: SAVED
        });
      } else {
        console.log('Discrepencies in fetch data between client and servers');
        // Dispatch error
        dispatch(
          pushError('Error while saving. Discrepencies of data.' + json.error)
        );
        dispatch({
          type: RESET_SAVING
        });
      }
    })
    .catch(err => {
      console.log('Fetch error in saveAndGenerateAction');
      //Dispatch error
      dispatch(pushError('Fetch error in saveAndGenerateAction' + err));
      dispatch({
        type: RESET_SAVING
      });
    });
};
