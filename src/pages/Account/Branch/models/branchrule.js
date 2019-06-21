import { queryRule,changeBranch,addBranch, queryBranch, removeRule, addRule, updateRule } from '@/services/api';

export default {
  namespace: 'branchrule',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryBranch, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addBranch, payload);
      if(response.code==0){
        const resp = yield call(queryBranch);
        yield put({
          type: 'save',
          payload: resp,
        });
      }
      if (callback) callback();
    },
    *stat({ payload, callback }, { call, put }) {
      const response = yield call(changeBranch, payload);
      if(response.code==0){
        const resp = yield call(queryBranch);
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
      const response = yield call(updateRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
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
  },
};
