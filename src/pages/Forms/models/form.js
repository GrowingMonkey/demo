import { routerRedux } from 'dva/router';
import { fakeSTStoken, submitAddAuthor, submitAddTeam } from '@/services/api';
import { message } from 'antd';
import { fakeSubmitForm } from '@/services/api';

export default {
  namespace: 'form',

  state: {
    step: {
      payAccount: 'ant-design@alipay.com',
      receiverAccount: 'test@example.com',
      receiverName: 'Alex',
      amount: '500',
    },
    STStoken: {},
  },

  effects: {
    *submitRegularForm({ payload }, { call }) {
      const response = yield call(submitAddAuthor, payload);
      console.log(payload);
      console.log(response);
      yield call(fakeSubmitForm, payload);
      message.success('提交成功');
    },
    *submitRegularFormTwo({ payload }, { call }) {
      const response = yield call(submitAddTeam, payload);
      console.log(payload);
      console.log(response);
      yield call(fakeSubmitForm, payload);
      message.success('提交成功');
    },
    *submitStepForm({ payload }, { call, put }) {
      yield call(fakeSubmitForm, payload);
      yield put({
        type: 'saveStepFormData',
        payload,
      });
      yield put(routerRedux.push('/form/step-form/result'));
    },
    *submitAdvancedForm({ payload }, { call }) {
      yield call(fakeSubmitForm, payload);
      message.success('提交成功');
    },
    *getSTStoken({ payload }, { call }) {
      const response = yield call(fakeSTStoken, payload);
      console.log(response);
      yield call(fakeSubmitForm, payload);
      message.success('提交成功');
    },
  },

  reducers: {
    saveStepFormData(state, { payload }) {
      return {
        ...state,
        step: {
          ...state.step,
          ...payload,
        },
      };
    },
  },
};
