import {createStore, combineReducers} from 'redux';
import userStore from './user';

const reducers = combineReducers({
  userStore,
});

const store = createStore(reducers);

export default store;
