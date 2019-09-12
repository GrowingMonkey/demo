import {
    addActivity,
    queryButton,
    updateButton
  } from '@/services/api';
  
  export default {
    namespace: 'buttonset',
  
    state: {
      data: {
        list: [],
        pagination: {},
      },
    },
  
    effects: {
      *fetch({ payload }, { call, put }) {
        const response = yield call(queryButton, payload);
        console.log(response);
        yield put({
          type: 'save',
          payload: response,
        });
      },
      *update({ payload ,callback}, { call, put }) {
        const response = yield call(updateButton, payload);
        if(callback) callback(response)
      }
    },
  
    reducers: {
      save(state, action) {
        return {
          ...state,
          data: action.payload,
        };
      },
    },
  };
  