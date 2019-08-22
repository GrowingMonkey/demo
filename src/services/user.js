import request from '@/utils/request';
import { stringify } from 'qs';
import { async } from 'q';
import { func } from 'prop-types';
export async function query() {
  return request('/api/users');
}
export async function queryUser(params) {
  return request(`/api/mg/user/detail/${params.user}`);
}
export async function queryCurrent() {
  return request('/api/currentUser');
}
export async function addReward(params) {
  return request(`/api/mg/user/reward/point`, {
    method: 'POST',
    data: stringify({
      ...params,
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}
