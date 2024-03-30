import { combineReducers } from 'redux';
import todoReducer from './testSlice';
import activeUser from './Auth';
import dateTime from './dateTime';
import listedDressData from './ListedDressData'
import dressOrderData from './DressOrderData'

const rootReducer = combineReducers({
  todos: todoReducer,
  activeUser: activeUser,
  dateTime,
  listedDressData: listedDressData,
  dressOrderData: dressOrderData,
});

export default rootReducer;