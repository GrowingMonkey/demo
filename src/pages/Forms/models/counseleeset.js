import {
    queryRule,
    queryPoint,
    queryCounselee,
    queryActivity,
    queryStopMoney,
    querySureMoney,
    removeComment,
    addRule,
    cancleComment,
    updateRule,
    queryComments,
    changeGame,
    changeActivity,
    updateCounseleeSet,
    queryConvert
  } from '@/services/api';
  
  export default {
    namespace: 'counseleeset',
  
    state: {
      data: {
        list: [],
        pagination: {},
      },
      counseleelist: {
        list: [],
        pagination: {},
      },
    },
  
    effects: {
      *fetch({ payload }, { call, put }) {
        const response = yield call(queryConvert, payload);
        console.log(response);
        yield put({
          type: 'save',
          payload: response,
        });
      },
      *convert({ payload }, { call, put }) {
        const response = yield call(queryConvert, payload);
        console.log(response);
        yield put({
          type: 'savecovert',
          payload: response,
        });
      },
      *stop({ payload }, { call, put }) {
        const response = yield call(queryStopMoney, payload);
        if(response.code==0){
          const resp = yield call(queryMoney);
          yield put({
            type: 'save',
            payload: resp,
          });
        }
        // yield put({
        //   type: 'save',
        //   payload: response,
        // });
      },
      *add({ payload, callback }, { call, put }) {
        const response = yield call(addRule, payload);
        yield put({
          type: 'save',
          payload: response,
        });
        if (callback) callback();
      },
      *stat({ payload, callback }, { call, put }) {
        const response = yield call(changeActivity, payload);
        if(response.code==0){
          const resp = yield call(queryActivity);
          yield put({
            type: 'save',
            payload: resp,
          });
        }
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
          const rep = yield call(queryComments, payload);
          yield put({
            type: 'save',
            payload: rep.data,
          });
        }
        if (callback) callback();
      },
      *update({ payload, callback }, { call, put }) {
        const response = yield call(updateCounseleeSet, payload);
        if(response.code==0){
            const resp = yield call(queryConvert, payload);
            console.log(resp);
            yield put({
              type: 'save',
              payload: resp,
            });
        }
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
          const rep = yield call(queryComments, payload);
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
      savecovert(state, action) {
        console.log(action.payload);
        return {
          ...state,
          counseleelist: action.payload,
        };
      },
    },
  };
  