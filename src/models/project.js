import { queryProjectNotice, queryProjectLike } from '@/services/api';

export default {
  namespace: 'project',

  state: {
    notice: [],
    likes: [],
  },

  effects: {
    *fetchNotice({ payload }, { call, put }) {
      const response = yield call(queryProjectNotice, payload);
      console.log(response);
      yield put({
        type: 'saveNotice',
        payload: Array.isArray(response) ? response : [],
      });
    },
    *fetchLike({ payload }, { call, put }) {
      const response = yield call(queryProjectLike, payload);
      console.log(response);
      yield put({
        type: 'saveLikes',
        payload: Array.isArray(response) ? response : [],
      });
    },
  },

  reducers: {
    saveNotice(state, action) {
      return {
        ...state,
        notice: action.payload,
      };
    },
    saveLikes(state, action) {
      return {
        ...state,
        likes: action.payload,
      };
    },
  },
};
