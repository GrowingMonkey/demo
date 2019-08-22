import {
  queryRule,
  queryUserList,
  removeRule,
  addRule,
  updateRule,
  changeStatus,
  resetDeleteUser,
  queryGrade,queryGradeInfo
} from '@/services/api';

export default {
  namespace: 'gradeinfo',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryGradeInfo, payload);
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
