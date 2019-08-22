import { queryRule,queryBranch,updateUser, removeRule,addUserAccount,queryStation, queryUserAccount, addRule, updateRule } from '@/services/api';

export default {
  namespace: 'usermanage',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    datass:{
      list: [],
      pagination: {},
    },
    deptoption:{
      list: [],
      pagination: {},
    }
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryUserAccount, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *stationrulefetch({ payload }, { call, put }) {
      const response = yield call(queryStation, payload);
      yield put({
        type: 'savedata',
        payload: response,
      });
    },
    *fetchdept({ payload }, { call, put }) {
      const response = yield call(queryBranch, payload);
      yield put({
        type: 'savedept',
        payload: response,
      });
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addUserAccount, payload);
      if(response.code==0){
        const resp = yield call(queryUserAccount, payload);
        yield put({
          type: 'save',
          payload: resp,
        });
      }
      if (callback) callback();
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(updateUser, payload);
      if(response.code==0){
        const resp = yield call(queryUserAccount);
        yield put({
          type: 'save',
          payload: resp,
        });
      }
      // yield put({
      //   type: 'save',
      //   payload: response,
      // });
      if (callback) callback();
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    savedata(state, action) {
      return {
        ...state,
        datass: action.payload,
      };
    },
    savedept(state, action) {
      return {
        ...state,
        deptoption: action.payload,
        datass:{}
      };
    }
  },
};
