import {
    updateButton,
    updateKeyWord
  } from '@/services/api';
  
  export default {
    namespace: 'keyword',
  
    state: {
      data: {
        list: [],
        pagination: {},
      },
    },
  
    effects: {
      *update({ payload ,callback}, { call, put }) {
        const response = yield call(updateKeyWord, payload);
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
  