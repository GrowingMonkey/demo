import request from '@/utils/request';

export async function query() {
  return request('/api/users');
}
export async function queryUser(params) {
  return request(`/api/mg/user/detail/${params.user}`);
}
export async function queryCurrent() {
  return request('/api/currentUser');
}
