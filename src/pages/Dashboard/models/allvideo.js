import {
  queryRule,
  removeRule,
  addRule,
  updateRule,
  queryVideo,
  cancleVideo,
  removeVideo,
} from '@/services/api';
import {deleteArray} from '@/utils/utils'
export default {
  namespace: 'allvideo',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryVideo, payload);
      yield put({
        type: 'save',
        payload: response.data,
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
    *remove({ payload, callback }, { call, put,select }) {
      console.log('删除');
      const response = yield call(removeVideo, payload);
      // let data=yield select(state=>state.data);
      // for(let i in data.list){
      //   if(data.list[i].id===action.payload.id){
      //     data.list.splice(i,1);
      //     i--;
      //   }
      // }
      if (parseInt(response.code) == 0) {
        const data = yield select(state=>state.allvideo);
        const newComment=deleteArray(data,payload.id);
        yield put({
          type: 'save',
          payload: newComment,
        });
      }
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
    *cancle({ payload, callback }, { call, put, select }) {
      const response = yield call(cancleVideo, payload);
      if (parseInt(response.code) == 0) {
        const data = yield select(state=>state.allvideo);
        const newComment=deleteArray(data,payload.id);
        yield put({
          type: 'save',
          payload: newComment,
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
