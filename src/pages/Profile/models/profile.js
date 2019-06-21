import { queryBasicProfile,queryHostoryPush, addBasicProfile, queryAdvancedProfile } from '@/services/api';

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
    *submitRegularForm({ payload }, { call, put }) {
      const response = yield call(addBasicProfile, payload);
      yield put({
        type: 'show',
        payload: response,
      });
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
