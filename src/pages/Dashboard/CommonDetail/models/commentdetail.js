import { queryRule,queryDetail,queryCommentDetail, removeRule, addRule, updateRule } from '@/services/api';

export default {
  namespace: 'details',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    info:{}
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryDetail, payload);
      console.log(response);
      yield put({
        type: 'saveinfo',
        payload: response,
      });
    },
    *commentfetch({ payload }, { call, put }) {
      const response = yield call(queryCommentDetail, payload);
      console.log(response);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
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
    saveinfo(state, action) {
      console.log(action.payload);
      return {
        ...state,
        info: action.payload,
      };
    },
  },
};
