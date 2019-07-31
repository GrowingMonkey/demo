import {
    queryRule,
    deleteService,
    addroft,
    addService,
    removeRule,
    addRule,
    updateRule,
    queryService,
    queryMarketService,
    addActivity
  } from '@/services/api';
  
  export default {
    namespace: 'activitysend',
  
    state: {
      data: {
        list: [],
        pagination: {},
      },
      optionlist: [],
    },
  
    effects: {
      *fetch({ payload }, { call, put }) {
        const response = yield call(queryService, payload);
        // if (payload.type == 'mkurl') {
          yield put({
            type: 'save',
            payload: response,
          });
        // } 
      },
      *submitAddForm({ payload }, { call, put }) {
        const response = yield call(addActivity, payload);
        // if (payload.type == 'mkurl') {
          yield put({
            type: 'save',
            payload: response,
          });
        // } 
      },
      *marketfetch({ payload }, { call, put }) {
        const response = yield call(queryMarketService, payload);
        console.log(response);
        // if (payload.type == 'mkurl') {
        //   yield put({
        //     type: 'save',
        //     payload: response,
        //   });
        // } else {
          yield put({
            type: 'option',
            payload: response.list,
          });
        // }
        console.log(payload);
      },
      *addOptions({ payload }, { call, put ,select}) {
        const response = yield call(addService, payload);
        if(response.code==0){
          const resp = yield call(queryMarketService, {type: 'market'});
          yield put({
            type: 'option',
            payload: resp.list,
          });
        }
      },
      *add({ payload, callback }, { call, put }) {
        const response = yield call(addroft, payload);
        if(response.code==0){
          const resp = yield call(queryService, {type: 'mkurl'});
          yield put({
            type: 'save',
            payload: resp,
          });
        }
        //   yield put({
        //     type: 'save',
        //     payload: response,
        //   });
        //   if (callback) callback();
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
      *delete({ payload, callback }, { call, put }) {
        const response = yield call(deleteService, payload);
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
      option(state, action) {
        console.log(action.payload);
        return {
          ...state,
          optionlist: action.payload,
        };
      },
      addoption(state, action) {
        console.log(action.payload);
        return {
          ...state,
          optionlist: action.payload,
        };
      }
    },
  };
  