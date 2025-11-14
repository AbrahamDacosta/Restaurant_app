import {createStore, combineReducers, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import {composeWithDevTools} from 'redux-devtools-extension';
import {persistStore, persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ApplicationStore} from './ApplicationStore';

let combinedStores = combineReducers({
  ApplicationStore,
});
// @ts-ignore
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['ApplicationStore'],
  timeout: null,
};

const rootPersistConfig = {
  key: 'root',
  storage: AsyncStorage,
  timeout: null,
};

const persistedStore = persistReducer(persistConfig, combinedStores);

const store = createStore(
  persistedStore,
  composeWithDevTools(applyMiddleware(thunk)),
);


const persistor = persistStore(store);

// persistor.purge();

export {persistor};
export default store;
