import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { fakeAccountLogin, getFakeCaptcha, postLoginOut, getToken } from '@/services/api';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { reloadAuthorized } from '@/utils/Authorized';

export default {
  namespace: 'login',

  state: {
    list: [],
    status: undefined,
    currentUser: {},
  },
  // 登录接口
  effects: {
    *token({ payload }, { call, put }) {
      const response = yield call(getToken, payload);
      if (response.code == 0) {
        console.log(response.data.token);
        window.localStorage.setItem('token', response.data.token);
      }
      yield put({
        type: 'saveToken',
        payload: response.data.token,
      });
    },
    *login({ payload }, { call, put }) {
      const response = yield call(fakeAccountLogin, payload);
      (response.type = 'account'), (response.currentAuthority = 'user'), console.log(response);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      window.localStorage.setItem('CurrentUser', JSON.stringify(response.data));
      // yield put({
      //   type: 'saveCurrentUser',
      //   payload: response.data,
      // });
      // Login successfully
      if (response.code == 0) {
        reloadAuthorized();
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;
        console.log(redirect);
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            redirect = null;
          }
        }
        yield put(routerRedux.replace(redirect || '/'));
      }
    },

    *getCaptcha({ payload }, { call }) {
      yield call(getFakeCaptcha, payload);
    },

    *logout(_, { put }) {
      // let response = yield call(postLoginOut, payload);
      // if(response.code ==0){
        // let token=window.localStorage.getItem('token');
      window.localStorage.clear();
      // window.localStorage.setItem('token',token);
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: false,
          currentAuthority: 'guest',
        },
      });
      reloadAuthorized();
      // redirect
      if (window.location.pathname !== '/user/login') {
        yield put(
          routerRedux.replace({
            pathname: '/user/login',
            search: stringify({
              redirect: window.location.href,
            }),
          })
        );
      }
      // }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      console.log(1);
      setAuthority(payload.currentAuthority);
      return {
        ...state,
        status: payload.status,
        type: payload.type,
        currentUser: payload.data,
      };
    },
    saveCurrentUser(state, { payload }) {
      console.log(state, payload);
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
    saveToken(state, { payload }) {
      return {
        ...state,
        token: payload,
      };
    },
  },
};
