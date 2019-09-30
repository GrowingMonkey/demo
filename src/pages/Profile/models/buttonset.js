import {
    addActivity,
    queryButton,
    updateButton,
    addBasicProfile
  } from '@/services/api';
  import { message } from 'antd';
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
      },
      *buttonpull({ payload }, { call, put,select }) {
        const response = yield call(addBasicProfile, payload);
        if(response.code!=0){
          message.error(response.message);
        }else{
          message.success('推送成功');
        }
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
  