import {
  queryRule,
  removeComment,
  addRule,
  cancleComment,
  updateRule,
  queryComments,
} from '@/services/api';

export default {
  namespace: 'comment',

  state: {
    data: {
      list: [],
      pageSize: 10,
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryComments, payload);
      console.log(response);
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
    *remove({ payload, callback }, { call, put, select }) {
      const response = yield call(removeComment, payload);
      // let data=yield select(state=>state.data);
      // for(let i in data.list){
      //   if(data.list[i].id===action.payload.id){
      //     data.list.splice(i,1);
      //     i--;
      //   }
      // }
      if (parseInt(response.code) === 0) {
        const rep = yield call(queryComments);
        yield put({
          type: 'save',
          payload: rep.data,
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
      const response = yield call(cancleComment, payload);
      // let data=yield select(state=>state.data);
      // for(let i in data.list){
      //   if(data.list[i].id===action.payload.id){
      //     data.list.splice(i,1);
      //     i--;
      //   }
      // }
      if (parseInt(response.code) === 0) {
        const rep = yield call(queryComments);
        yield put({
          type: 'save',
          payload: rep.data,
        });
      }
      if (callback) callback();
    },
  },

  reducers: {
    save(state, action) {
      console.log(action.payload);
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
