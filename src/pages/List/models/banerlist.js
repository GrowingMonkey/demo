import {
  changeBannerStatus,
  queryBannerList,
  queryRule,
  removeRule,
  addRule,
  updateRule,
} from '@/services/advertisement';

export default {
  namespace: 'bannerlist',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryBannerList, payload);
      yield put({
        type: 'save',
        payload: response.data,
      });
    },
    *cancle({ payload }, { call, put }) {
      const response = yield call(changeBannerStatus, payload);
      if(response.code==0){
        const res = yield call(queryBannerList);
        yield put({
          type: 'save',
          payload: res.data,
        });
      }
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
  },
};
