/** @jest-environment jsdom */

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import rootReducer from '../reducers';
import AddIconForm from './AddIconForm';

const store = createStore(rootReducer);

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <Provider store={store}>
      <AddIconForm />
    </Provider>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
