import { query as queryUsers, queryCurrent, queryUser,addReward } from '@/services/user';

export default {
  namespace: 'user',

  state: {
    list: [],
    currentUser: {},
    findUser:{},
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(queryUsers, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *fetchCurrent(_, { call, put }) {
      // const response = yield call(queryCurrent);
      const response = JSON.parse(window.localStorage.getItem('CurrentUser'));
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
    },
    *fetchInfo({ payload, callback }, { call, put }) {
      // const response = yield call(queryCurrent);
      const response = yield call(queryUser, payload);
      yield put({
        type: 'saveFindUser',
        payload: response.data,
      });
    },
    *reward({ payload, callback }, { call, put }) {
      // const response = yield call(queryCurrent);
      const response = yield call(addReward, payload);
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    saveCurrentUser(state, action) {
      console.log(action);
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
    saveFindUser(state, action) {
      console.log(action);
      return {
        ...state,
        findUser: action.payload || {},
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
};
