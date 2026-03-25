/** @jest-environment jsdom */

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../reducers';
import Icons from './Icons';

const store = createStore(rootReducer, applyMiddleware(thunk));

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({ json: () => Promise.resolve([]) })
  );
});

afterEach(() => {
  global.fetch.mockRestore && global.fetch.mockRestore();
});

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <Provider store={store}>
      <Icons />
    </Provider>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
