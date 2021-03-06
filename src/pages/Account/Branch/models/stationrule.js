import {
  queryRule,
  queryStation,
  removeRule,
  addRule,
  queryGrant,
  updateRule,
  queryBranch
} from '@/services/api';

export default {
  namespace: 'stationrule',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    deptoption:{
      list: [],
      pagination: {},
    },
    datagrant:{}
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryStation, payload);
      yield put({
        type: 'save',
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
    *grant({ payload }, { call, put }) {
      const response = yield call(queryGrant, payload);
      yield put({
        type: 'savegrant',
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
    savedept(state, action) {
      return {
        ...state,
        deptoption: action.payload,
      };
    },
    savegrant(state, action) {
      return {
        ...state,
        datagrant: action.payload,
      };
    }
  },
};
