import { stringify } from 'qs';
import request from '@/utils/request';
const {OSS_BURKET,OSS_END_POINT,API_ADDRESS,CDN_ADDRESS,API_ENV}=process.env;
let api_url_pre=API_ENV=='aiyu'?'adminapi':'api'
// 获取广告列表
export async function queryBannerList(params) {
  return request(`/${api_url_pre}/advertisement/list?${stringify(params)}`);
}
export async function changeBannerStatus(params) {
  return request(`/${api_url_pre}/advertisement/change/${params.oprType}`, {
    method: 'POST',
    data: stringify(params),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}
export async function queryProjectNotice(params) {
  return request(`/${api_url_pre}/advertisement/change/${params.type}`, {
    method: 'POST',
    data: stringify(params),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}

export async function queryActivities() {
  return request(`/${api_url_pre}/activities`);
}

export async function queryRule(params) {
  return request(`/${api_url_pre}/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request(`/${api_url_pre}/rule`, {
    method: 'POST',
    data: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request(`/${api_url_pre}/rule`, {
    method: 'POST',
    data: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateRule(params = {}) {
  return request(`/${api_url_pre}/rule?${stringify(params.query)}`, {
    method: 'POST',
    data: {
      ...params.body,
      method: 'update',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request(`/${api_url_pre}/forms`, {
    method: 'POST',
    data: params,
  });
}

export async function fakeChartData() {
  return request(`/${api_url_pre}/fake_chart_data`);
}

export async function queryTags() {
  return request(`/${api_url_pre}/tags`);
}

export async function queryBasicProfile(id) {
  return request(`/${api_url_pre}/profile/basic?id=${id}`);
}

export async function queryAdvancedProfile() {
  return request(`/${api_url_pre}/profile/advanced`);
}

export async function queryFakeList(params) {
  return request(`/${api_url_pre}/fake_list?${stringify(params)}`);
}

export async function removeFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/${api_url_pre}/fake_list?count=${count}`, {
    method: 'POST',
    data: {
      ...restParams,
      method: 'delete',
    },
  });
}

export async function addFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/${api_url_pre}/fake_list?count=${count}`, {
    method: 'POST',
    data: {
      ...restParams,
      method: 'post',
    },
  });
}

export async function updateFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/${api_url_pre}/fake_list?count=${count}`, {
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
  // return request(`/${api_url_pre}/login/account`, {
  //   method: 'POST',
  //   data: params,
  // });
  // /${api_url_pre}/login/account
  return request(`/${api_url_pre}/system/login`, {
    method: 'POST',
    data: stringify(newParams),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}
export async function postLoginOut(params) {
  console.log(params);
  return request(`/${api_url_pre}/system/login`, {
    method: 'POST',
    data: params,
  });
}
export async function fakeRegister(params) {
  return request(`/${api_url_pre}/register`, {
    method: 'POST',
    data: params,
  });
}

export async function queryNotices(params = {}) {
  return request(`/${api_url_pre}/notices?${stringify(params)}`);
}

export async function getFakeCaptcha(mobile) {
  return request(`/${api_url_pre}/captcha?mobile=${mobile}`);
}
