import request from '@/utils/request';
const {OSS_BURKET,OSS_END_POINT,API_ADDRESS,CDN_ADDRESS,API_ENV}=process.env;
let api_url_pre=API_ENV=='aiyu'?'adminapi':'api'
export default async function queryError(code) {
  return request(`/${api_url_pre}/${code}`);
}
