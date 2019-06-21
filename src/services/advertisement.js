import { stringify } from 'qs';
import request from '@/utils/request';
// 获取广告列表
export async function queryBannerList(params) {
  return request(`/api/advertisement/list?${stringify(params)}`);
}
export async function changeBannerStatus(params) {
  return request(`/api/advertisement/change/${params.oprType}`, {
    method: 'POST',
    data: stringify(params),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}
export async function queryProjectNotice(params) {
  return request(`/api/advertisement/change/${params.type}`, {
    method: 'POST',
    data: stringify(params),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateRule(params = {}) {
  return request(`/api/rule?${stringify(params.query)}`, {
    method: 'POST',
    data: {
      ...params.body,
      method: 'update',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    data: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile(id) {
  return request(`/api/profile/basic?id=${id}`);
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function removeFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    data: {
      ...restParams,
      method: 'delete',
    },
  });
}

export async function addFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    data: {
      ...restParams,
      method: 'post',
    },
  });
}

export async function updateFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    data: {
      ...restParams,
      method: 'update',
    },
  });
}

export async function fakeAccountLogin(params) {
  const newParams = {
    phone: params.mobile,
    code: params.captcha,
  };
  // return request('/api/login/account', {
  //   method: 'POST',
  //   data: params,
  // });
  // /api/login/account
  return request('/api/system/login', {
    method: 'POST',
    data: stringify(newParams),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}
export async function postLoginOut(params) {
  console.log(params);
  return request('/api/system/login', {
    method: 'POST',
    data: params,
  });
}
export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    data: params,
  });
}

export async function queryNotices(params = {}) {
  return request(`/api/notices?${stringify(params)}`);
}

export async function getFakeCaptcha(mobile) {
  return request(`/api/captcha?mobile=${mobile}`);
}
