import {
  queryFakeList,
  queryFakeListC,
  queryFakeListV,
  queryFakeListA,
  removeFakeList,
  queryTalkList,
  addFakeList,
  updateFakeList,
} from '@/services/api';

export default {
  namespace: 'list',

  state: {
    picturelist: [],
    videolist: [],
    articlelist: [],
    collectlist: [],
    talklist:[],
    opuslist:[]
  },

  effects: {
    *fetchOpus({ payload }, { call, put }) {
      const response = yield call(queryTalkList, payload);
      yield put({
        type: 'opusList',
        payload: Array.isArray(response) ? response : [],
      });
    },
    *fetchT({ payload }, { call, put }) {
      const response = yield call(queryTalkList, payload);
      yield put({
        type: 'queryTList',
        payload: Array.isArray(response) ? response : [],
      });
    },
    *fetchP({ payload }, { call, put }) {
      const response = yield call(queryFakeList, payload);
      yield put({
        type: 'queryPList',
        payload: Array.isArray(response) ? response : [],
      });
    },
    *fetchV({ payload }, { call, put }) {
      const response = yield call(queryFakeListV, payload);
      yield put({
        type: 'queryVList',
        payload: Array.isArray(response) ? response : [],
      });
    },
    *fetchA({ payload }, { call, put }) {
      const response = yield call(queryFakeListA, payload);
      yield put({
        type: 'queryAList',
        payload: Array.isArray(response) ? response : [],
      });
    },
    *fetchC({ payload }, { call, put }) {
      const response = yield call(queryFakeListC, payload);
      yield put({
        type: 'queryCList',
        payload: Array.isArray(response) ? response : [],
      });
    },
    *appendFetch({ payload }, { call, put }) {
      const response = yield call(queryFakeList, payload);
      yield put({
        type: 'appendList',
        payload: Array.isArray(response) ? response : [],
      });
    },
    *submit({ payload }, { call, put }) {
      let callback;
      if (payload.id) {
        callback = Object.keys(payload).length === 1 ? removeFakeList : updateFakeList;
      } else {
        callback = addFakeList;
      }
      const response = yield call(callback, payload); // post
      yield put({
        type: 'queryList',
        payload: response,
      });
    },
  },

  reducers: {
    queryVList(state, action) {
      console.log(action.payload);
      return {
        ...state,
        videolist: action.payload,
      };
    },
    queryPList(state, action) {
      return {
        ...state,
        picturelist: action.payload,
      };
    },
    queryAList(state, action) {
      return {
        ...state,
        articlelist: action.payload,
      };
    },
    opusList(state, action) {
      return {
        ...state,
        opuslist: action.payload,
      };
    },
    queryCList(state, action) {
      return {
        ...state,
        collectlist: action.payload,
      };
    },
    queryTList(state, action) {
      return {
        ...state,
        talklist: action.payload,
      };
    },
    appendList(state, action) {
      return {
        ...state,
        list: state.list.concat(action.payload),
      };
    },
  },
};
