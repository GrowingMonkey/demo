import { queryBasicProfile,queryHostoryPush, addBasicProfile, queryAdvancedProfile } from '@/services/api';
import {queryPullOpus,queryAllUser} from '@/services/api'
import { message } from 'antd';
import { addArray } from '@/utils/utils'
import from from '@/pages/List/models/from';
export default {
  namespace: 'pullopus',

  state: {
    basicGoods: [],
    advancedOperation1: [],
    advancedOperation2: [],
    advancedOperation3: [],
    datass: {
      list: [],
      pagination: {},
    },
    opusData:{
      list: [],
      pagination: {},
    },
    userData:{
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetchOpus({ payload }, { call, put }) {
      const response = yield call(queryPullOpus, payload);
      yield put({
        type: 'saveopus',
        payload: response.data,
      });
    },
    *fetchUser({ payload }, { call, put }) {
      const response = yield call(queryAllUser, payload);
      yield put({
        type: 'saveuser',
        payload: response.data,
      });
    },
    *pushfetch({ payload }, { call, put }) {
      const response = yield call(queryHostoryPush, payload);
      console.log(response);
      yield put({
        type: 'save',
        payload: response.data,
      });
    },
    *fetchAdvanced(_, { call, put }) {
      const response = yield call(queryAdvancedProfile);
      yield put({
        type: 'show',
        payload: response,
      });
    },
    *submitRegularForm({ payload }, { call, put,select }) {
      const response = yield call(addBasicProfile, payload);
      console.log(response);
      if(response.code!=0){
        message.error(response.message);
      }else{
        message.success('提交成功');
        const data = yield select(state=>state.profile.datass);
        const newlist=addArray(data.list,payload);
        console.log(newlist);
        yield put({
          type: 'save',
          payload: {
            ...data,
            list:newlist
          }
        });
      }
    },
  },

  reducers: {
    show(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    save(state, action) {
      console.log(action.payload);
      return {
        ...state,
        datass: action.payload,
      };
    },
    saveopus(state, action) {
      console.log(action.payload)
      return {
        ...state,
        opusData: action.payload,
      };
    },
    saveuser(state, action) {
      console.log(action.payload)
      return {
        ...state,
        userData: action.payload,
      };
    },
  },
};
