import request from '@/utils/request';
import { stringify } from 'qs';
import { async } from 'q';
import { func } from 'prop-types';
const {OSS_BURKET,OSS_END_POINT,API_ADDRESS,CDN_ADDRESS,API_ENV}=process.env;
let api_url_pre=API_ENV=='aiyu'?'adminapi':'api'
export async function query() {
  return request(`/${api_url_pre}/users`);
}
export async function queryUser(params) {
  return request(`/${api_url_pre}/mg/user/detail/${params.user}`);
}
export async function queryCurrent() {
  return request(`/${api_url_pre}/currentUser`);
}
export async function addReward(params) {
  return request(`/${api_url_pre}/mg/user/reward/point`, {
    method: 'POST',
    data: stringify({
      ...params,
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}
