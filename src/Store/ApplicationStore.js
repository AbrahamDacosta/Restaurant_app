import { createSlice, configureStore, createAsyncThunk } from '@reduxjs/toolkit';
import {
  NAVIGATION_STATE_FIRST_LAUNCH,
  NAVIGATION_STATE_NOT_CONNECTED,
  NAVIGATION_STATE_CONNTECTED
} from '../Navigation';
import Daos from '../Daos';


const applicationStore = createSlice({
  name: 'ApplicationStore',
  initialState: {
    appScreenState: NAVIGATION_STATE_NOT_CONNECTED,
    auth: undefined,
    user: undefined,
    appParams: undefined,
    isRefreshingToken: undefined
  },
  reducers: {
    updateTokenRefreshingState(state, isRefreshingToken) {
      state.isRefreshingToken = isRefreshingToken;
    },
    updateAppParams(state, action) {
      state.appParams = action.payload
    },
    introFinished(state) {
      state.appScreenState = NAVIGATION_STATE_NOT_CONNECTED;
    },
    setToken(state, action) {
      state.token = action.payload;
    },
    connectUser(state, action) {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.appScreenState = NAVIGATION_STATE_CONNTECTED;
    },
    deconnectUser(state) {
      state.token = undefined;
      state.user = undefined;
      state.appScreenState = NAVIGATION_STATE_NOT_CONNECTED;

    },
  },
});


const refreshToken = createAsyncThunk(
  'users/refresh-token',
  async (thunkAPI) => {
    const token = thunkAPI.getState().ApplicationStore.token;

    try {

      thunkAPI.dispatch(updateTokenRefreshingState(true));

      const response = await Daos.Auth.refreshToken(token.token);

      if (response.token != undefined) {

      } else if (response.error != undefined) {

      }


    } catch (e) {

    } finally {
      thunkAPI.dispatch(updateTokenRefreshingState(false));
    }
  },
)


export const { setToken, connectUser, deconnectUser, introFinished, updateAppParams, updateTokenRefreshingState } = applicationStore.actions;
export const ApplicationStore = applicationStore.reducer;
