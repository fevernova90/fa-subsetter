import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';
import { addIcon, deleteIcon } from './actions/iconActions';

// Mock fetch so thunks that use fetch don't crash in jsdom
beforeAll(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({ json: () => Promise.resolve([]) })
  );
});

function makeStore() {
  return createStore(rootReducer, applyMiddleware(thunk));
}

describe('Redux store', () => {
  it('initialises with correct shape', () => {
    const store = makeStore();
    const state = store.getState();
    expect(state.icons.items).toEqual([]);
    expect(state.icons.isSaving).toBe(false);
    expect(state.icons.isSaved).toBe(false);
    expect(state.icons.isDownloading).toBe(false);
    expect(state.icons.isDownloaded).toBe(false);
  });

  it('addIcon dispatches NEW_ICON and adds icon to items', () => {
    const store = makeStore();
    store.dispatch(addIcon({ title: 'Home', tag: 'home', type: 'fas' }));
    const items = store.getState().icons.items;
    expect(items).toHaveLength(1);
    expect(items[0].tag).toBe('home');
    expect(items[0].title).toBe('Home');
    expect(items[0].type).toBe('fas');
  });

  it('deleteIcon dispatches DELETE_ICON and removes icon from items', () => {
    const store = makeStore();
    store.dispatch(addIcon({ title: 'Home', tag: 'home', type: 'fas' }));
    store.dispatch(deleteIcon('home'));
    expect(store.getState().icons.items).toHaveLength(0);
  });
});
