import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Provider } from 'react-redux';

import Icons from './components/Icons';
import AddIconForm from './components/AddIconForm';
import Generator from './components/Generator';
import NotificationBar from './components/NotificationBar';

import store from './store';

function App() {
  return (
    <Provider store={store}>
      <div className='App'>
        <header className='App-header'>
          <img src={logo} className='App-logo' alt='logo' />
          <p>Welcome to Font-Awesome Subsetter</p>
        </header>
        <div className='App-body'>
          <NotificationBar />
          <div className='jumbo-bar'>
            <AddIconForm />
            <Generator />
          </div>
          <hr />
          <Icons />
        </div>
      </div>
    </Provider>
  );
}

export default App;
