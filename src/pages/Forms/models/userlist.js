import {
  queryRule,
  queryUserList,
  removeRule,
  addRule,
  updateRule,
  changeStatus,
  resetDeleteUser,
  queryUserListAuth,
  updateUserPower
} from '@/services/api';

export default {
  namespace: 'userlist',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryUserList, payload);
      yield put({
        type: 'save',
        payload: response.data,
      });
    },
    *fetchauth({ payload,callback }, { call, put }){
      const response = yield call(queryUserListAuth, payload);
      if (callback) callback(response);
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
    *updatepower({ payload, callback }, { call, put }) {
      const response=yield call(updateUserPower,payload)
      if (callback) callback(response);
    },
    *status({ payload, callback }, { call, put }) {
      const response = yield call(changeStatus, payload);
      console.log(response);
      if(response.code==0){
        const req = yield call(queryUserList);
        yield put({
          type: 'save',
          payload: req.data,
        });
      }
      if (callback) callback();
    },
    *reset({ payload, callback }, { call, put }) {
      const response = yield call(resetDeleteUser, payload);
      if(response.code==0){
        const req = yield call(queryUserList);
        yield put({
          type: 'save',
          payload: req.data,
        });
      }
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
