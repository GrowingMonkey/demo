import {
  queryRule,
  removeRule,
  addRule,
  updateRule,
  queryPicture,
  removePicture,
  canclePicture,
} from '@/services/api';
import {deleteArray} from '@/utils/utils'
export default {
  namespace: 'picture',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryPicture, payload);
      yield put({
        type: 'save',
        payload: response.data,
      });
    },
    *remove({ payload, callback }, { call, put, select }) {
      const response = yield call(removePicture, payload);
      // let data=yield select(state=>state.data);
      // for(let i in data.list){
      //   if(data.list[i].id===action.payload.id){
      //     data.list.splice(i,1);
      //     i--;
      //   }
      // }
      if (parseInt(response.code) === 0) {
        const data = yield select(state=>state.picture);
        const newComment=deleteArray(data,payload.id);
        yield put({
          type: 'save',
          payload: newComment,
        });
      }
      if (callback) callback();
    },
    *cancle({ payload, callback }, { call, put, select }) {
      const response = yield call(canclePicture, payload);
      // let data=yield select(state=>state.data);
      // for(let i in data.list){
      //   if(data.list[i].id===action.payload.id){
      //     data.list.splice(i,1);
      //     i--;
      //   }
      // }
      if (parseInt(response.code) === 0) {
        const data = yield select(state=>state.picture);
        const newComment=deleteArray(data,payload.id);
        yield put({
          type: 'save',
          payload: newComment,
        });
      }
      if (callback) callback();
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addRule, payload);
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
    delete(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};
