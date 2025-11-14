import React from 'react';
import {useSelector} from 'react-redux';

export default function useUser() {
  return useSelector(state => {
    return state.ApplicationStore.user;
  });
}
