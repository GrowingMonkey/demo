import { queryBasicProfile,queryHostoryPush, addBasicProfile, queryAdvancedProfile } from '@/services/api';
import { message } from 'antd';
import { addArray } from '@/utils/utils'
export default {
  namespace: 'profile',

  state: {
    basicGoods: [],
    advancedOperation1: [],
    advancedOperation2: [],
    advancedOperation3: [],
    datass: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetchBasic({ payload }, { call, put }) {
      const response = yield call(queryBasicProfile, payload);
      yield put({
        type: 'show',
        payload: response,
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
  },
};
