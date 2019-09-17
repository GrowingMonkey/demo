import {
    queryMemberList,
    addMember,
    removeMember
  } from '@/services/api';
  
  export default {
    namespace: 'member',
  
    state: {
      data: {
        list: [],
        pagination: {},
      },
    },
  
    effects: {
      *fetch({ payload }, { call, put }) {
        const response = yield call(queryMemberList, payload);
        yield put({
          type: 'save',
          payload: response.data,
        });
      },
      *remove({ payload, callback }, { call, put }) {
        const response = yield call(removeMember, payload);
        if(response&&response.code==0){
          const resp= yield call(queryMemberList, payload);
          yield put({
            type: 'save',
            payload: resp.data,
          });
        }
        if (callback) callback();
      },
      *adduser({ payload, callback }, { call, put }) {
        const response = yield call(addMember, payload);
        console.log(response)
        if(response&&response.code==0){
          const resp= yield call(queryMemberList, payload);
          yield put({
            type: 'save',
            payload: resp.data,
          });
        }
        if (callback) callback();
      }
    },
  
    reducers: {
      save(state, action) {
        return {
          ...state,
          data: action.payload,
        };
      },
      add(state,action){
        let {data:{list}}=state;
        list.push(action.payload);
        return{
          ...state,
          data:list
        }
      }
    },
  };
  