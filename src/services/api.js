import { stringify } from 'qs';
import request from '@/utils/request';
import { async } from 'q';
import { func } from 'prop-types';
export async function queryUserAccount(params) {
  const rep = await request(`/api/system/admin/list?${stringify(params)}`);
  return rep.data;
}
export async function queryDetail(params) {
  const rep = await request(`/api/opus/detail/${params.id}?${stringify(params)}`);
  return rep.data;
}
export async function queryCommentDetail(params) {
  const rep = await request(`/api/opus/list/to/${params.idType}?${stringify(params)}`);
  return rep.data;
}
export async function queryScanBranch(params) {
  console.log(params);
  const rep = await request(`/api/system/admin/list?${stringify(params)}`);
  return rep.data;
}
export async function queryScanStation(params) {
  console.log(params);
  const rep = await request(`/api/system/job/list?${stringify(params)}`);
  return rep.data;
}
export async function queryBranch(params) {
  const rep = await request(`/api/system/dept/list?${stringify(params)}`);
  return rep.data;
}
export async function queryGrant(params) {
  const rep = await request(`/api/system/grant/list?${stringify(params)}`);
  return rep.data;
}
queryGrant
export async function queryStation(params) {
  console.log(params);
  const rep = await request(`/api/system/job/list?${stringify(params)}`);
  return rep.data;
}
export async function queryActivity(params) {
  const rep = await request(`/api/service/activity/list?${stringify(params)}`);
  return rep.data;
}
export async function queryGradeInfo(params) {
  console.log(params);
  if(!params.id){
    params.id=window.location.search.slice(4);
    console.log(params.id);
  }
  const rep = await request(`/api/mg/user/point/detail/${params.id}?${stringify(params)}`);
  return rep.data;
}
export async function queryGrade(params) {
  const rep = await request(`/api/mg/user/level/grant?${stringify(params)}`);
  return rep.data;
}
export async function queryCounselee(params) {
  const rep = await request(`/api/mg/user/extend/list?${stringify(params)}`);
  return rep.data;
}
export async function queryCounseleeDetail(params) {
  console.log(params);
  const rep = await request(`/api/mg/user/extend/detail/${params.aid}`);
  return rep.data;
}
export async function queryConvert(params) {
  const rep = await request(`/api/service/extend/convert?${stringify(params)}`);
  return rep.data;
}
export async function queryPoint(params) {
  const rep = await request(`/api/mg/user/task/point/list?${stringify(params)}`);
  return rep.data;
}
export async function fetchlPoint(params) {
  const rep = await request(`/api/service/point/convert?${stringify(params)}`);
  return rep.data;
}
export async function queryGame(params) {
  const rep = await request(`/api/service/game/list?${stringify(params)}`);
  return rep.data;
}
export async function queryTag(params) {
  const rep = await request(`/api/service/tag/list?${stringify(params)}`);
  return rep.data;
}
export async function queryMoney(params) {
  const rep = await request(`/api/service/rp/order/list?${stringify(params)}`);
  return rep.data;
}
export async function  queryHistoryMoney(params) {
  const rep = await request(`/api/service/rp/order/list?${stringify(params)}`);
  return rep.data;
}
export async function queryStopMoney(params) {
  return request(`/api/service/rp/verify/${params.oprType}`, {
    method: 'POST',
    data: stringify({
      ...params,
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      token: params,
    },
  });
  return rep.data;
}
export async function addActivity(params){
  return request('/api/service/add/activity', {
    method: 'POST',
    data: stringify(params),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}
export async function queryProjectNotice(params) {
  const rep = await request(`/api/mg/user/follow/${params.id}`);
  return rep.data.list;
}
export async function queryProjectLike(params) {
  const rep = await request(`/api/mg/user/fans/${params.id}`);
  return rep.data.list;
}
export async function getToken() {
  return request('/api/system/getToken', {
    method: 'POST',
  });
}
export async function fakeSTStoken(params) {
  console.log(params);
  return request('http://www.imuguang.com/api/upload/pic/getSTSToken', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      token: params,
    },
  });
}
export async function addUserAccount(params) {
  console.log(params);
  return request('/api/system/admin/add', {
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
export async function updateUser(params) {
  return request('/api/system/admin/modify',{
    method: 'POST',
    data: stringify(params),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}
export async function queryService(params) {
  const rep = await request(`/api/service/ps/list/${params.type}?${stringify(params)}`);
  return rep.data;
}
export async function queryMarketService(params) {
  const rep = await request(`/api/service/ps/list/${params.type}?${stringify(params)}`);
  return rep.data;
}
export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}
export async function updateStatus(params) {
  return request(`/api/mg/user/apply/opr/${params.oprType}/${params.id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}
export async function queryAuthor(params) {
  const rep = await request(`/api/mg/user/apply/list?${stringify(params)}`);
  return rep.data;
}
export async function queryTeam(params) {
  const rep = await request(`/api/mg/user/company/list?${stringify(params)}`);
  return rep.data;
}
export async function queryAuth(params) {
  const rep = await request(`/api/mg/user/role/list?${stringify(params)}`);
  return rep.data;
  // return request(`/api/rule?${stringify(params)}`);
}
export async function querySettled(params) {
  const rep = await request(`/api/mg/user/author/list?${stringify(params)}`);
  return rep.data;
}
// 查询举报管理页面数据
export async function queryComments(params) {
  return request(`/api/opus/report/comment?${stringify(params)}`);
}
// 查询图片列表
export async function queryPicture(params) {
  return request(`/api/opus/report/image?${stringify(params)}`);
}
// 查询视频列表
export async function queryVideo(params) {
  console.log(params);
  return request(`/api/opus/report/video?${stringify(params)}`);
}
export async function queryTalk(params) {
  return request(`/api/opus/report/stalk?${stringify(params)}`);
}
export async function queryArticle(params) {
  return request(`/api/opus/report/article?${stringify(params)}`);
}
export async function queryUserList(params) {
  return request(`/api/mg/user/list?${stringify(params)}`);
}
export async function queryUserListAuth(params) {
  return request(`/api/mg/user/grant?${stringify(params)}`);
}
export async function changeStatus(params) {
  return request(`/api/mg/user/account/change?`, {
    method: 'POST',
    data: stringify({
      userId: params.id,
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}
export async function resetDeleteUser(params) {
  console.log(params);
  return request(`/api/mg/user/account/opr`, {
    method: 'POST',
    data: stringify({
      userId: params.userId,
      type: params.type,
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
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
export async function deleteService(params) {}
export async function addService(params) {
  return request('/api/service/add/market', {
    method: 'POST',
    data: stringify({
      ...params,
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
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
export async function setPoint(params) {
  return request(`/api/service/push/${params.pushType}`, {
    method: 'POST',
    data: stringify({
      ...params,
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}
export async function addBasicProfile(params) {
  return request(`/api/service/push/${params.pushType}`, {
    method: 'POST',
    data: stringify({
      ...params,
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}
//修改积分
export async function updatePoint(params) {
  return request('/api/mg/user/task/point/set', {
    method: 'POST',
    data: stringify({
      ...params,
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}
//新增标签
export async function addTag(params) {
  return request('/api/service/add/tag', {
    method: 'POST',
    data: stringify({
      ...params,
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}
//新增标签
export async function addroft(params) {
  return request('/api/service/add/market/url', {
    method: 'POST',
    data: stringify({
      ...params,
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}
export async function addAuth(params) {
  return request('/api/mg/user/role/add', {
    method: 'POST',
    data: stringify({
      ...params,
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}
export async function addBranch(params) {
  return request(`/api/system/dept/add`, {
    method: 'POST',
    data: stringify({
      ...params,
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}
export async function changeBranch(params){
  return request(`/api/system/${params.oprType}/stat`, {
    method: 'POST',
    data: stringify({
      ...params,
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}
export async function changeGame(params){
  return request(`/api/service/update/game`, {
    method: 'POST',
    data: stringify({
      ...params,
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}
export async function changeActivity(params){
  return request(`/api/service/update/activity`, {
    method: 'POST',
    data: stringify({
      ...params,
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}
export async function updateUserPower(params){
  return request(`/api/mg/user/grant/update`, {
    method: 'POST',
    data: stringify({
      ...params,
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}
export async function updateRule(params) {
  return request(`/api/mg/user/role/modify/${params.id}`, {
    method: 'POST',
    data: stringify({
      ...params,
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}
export async function updateCounseleeSet(params) {
  return request(`/api/service/param/setting`, {
    method: 'POST',
    data: stringify({
      ...params,
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}
export async function addGrade(params = {}) {
  const newParams = {
    level:params.level,
    pic: params.pic,
    article:params.article,
    video:params.video,
    stalk:params.stalk,
    videoTimes:params.videoTimes,
    uploadTimes:params.uploadTimes,
  };
  return request(`/api/mg/user/add/level/grant`,{
    method: 'POST',
    data: stringify(newParams),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}
export async function updateGrade(params = {}) {
  const newParams = {
    id: params.id,
    pic: params.pic,
    article:params.article,
    video:params.video,
    stalk:params.stalk,
    videoTimes:params.videoTimes,
    uploadTimes:params.uploadTimes,
  };
  return request(`/api/mg/user/update/level/grant`,{
    method: 'POST',
    data: stringify(newParams),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}
export async function updateTag(params = {}) {
  console.log();
  const newParams = {
    id: params.id,
    type: params.type,
    name:params.name,
    detail:params.detail,
  };
  return request(`/api/service/update/tag`,{
    method: 'POST',
    data: stringify(newParams),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}
// 撤销举报
export async function cancleComment(params = {}) {
  console.log();
  const newParams = {
    id: params.id,
    type: 'cancel-report',
  };
  return request(`/api/opus/comment/opr`, {
    method: 'POST',
    data: stringify(newParams),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}
export async function canclePicture(params = {}) {
  const newParams = {
    id: params.id,
    type: 'cancel-report',
  };
  return request(`/api/opus/opr`, {
    method: 'POST',
    data: stringify(newParams),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}
export async function cancleVideo(params = {}) {
  const newParams = {
    id: params.id,
    type: 'cancel-report',
  };
  return request(`/api/opus/opr`, {
    method: 'POST',
    data: stringify(newParams),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}
export async function cancleArticle(params = {}) {
  const newParams = {
    id: params.id,
    type: 'cancel-report',
  };
  return request(`/api/opus/opr`, {
    method: 'POST',
    data: stringify(newParams),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}
// 删除举报
export async function removeComment(params = {}) {
  console.log();
  const newParams = {
    id: params.id,
    type: 'report-delete',
  };
  return request(`/api/opus/comment/opr`, {
    method: 'POST',
    data: stringify(newParams),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}
export async function removePicture(params = {}) {
  const newParams = {
    id: params.id,
    type: 'report-delete',
  };
  return request(`/api/opus/opr`, {
    method: 'POST',
    data: stringify(newParams),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}
export async function removeVideo(params = {}) {
  const newParams = {
    id: params.id,
    type: 'report-delete',
  };
  return request(`/api/opus/opr`, {
    method: 'POST',
    data: stringify(newParams),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}
export async function removeArticle(params = {}) {
  const newParams = {
    id: params.id,
    type: 'report-delete',
  };
  return request(`/api/opus/opr`, {
    method: 'POST',
    data: stringify(newParams),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}
export async function fakeSubmitForm(params) {
  return request('/api/advertisement/add', {
    method: 'POST',
    data: stringify(params),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}
export async function fakeChartIndexData() {
  return request('/api/home/info');
}
export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile(id) {
  return request(`/api/service/rp/list/${id}`);
}
export async function queryHostoryPush(params) {
  return request(`/api/service/push/list`, {
    method: 'POST',
    data: stringify({
      ...params,
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}
export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  const rep = await request(`/api/mg/user/opus/${params.id}?${stringify(params)}`);
  return rep.data.list;
}
export async function queryFakeListV(params) {
  const rep = await request(`/api/mg/user/opus/${params.id}?${stringify(params)}`);
  return rep.data.list;
}
export async function queryFakeListC(params) {
  const rep = await request(`/api/mg/user/opus/${params.id}?${stringify(params)}`);
  return rep.data.list;
}
export async function queryFakeListA(params) {
  const rep = await request(`/api/mg/user/opus/${params.id}?${stringify(params)}`);
  return rep.data.list;
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
export async function submitAddAuthor(params) {
  return request(`/api/mg/user/author/add`, {
    method: 'POST',
    data: stringify({
      ...params,
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}
export async function submitAddGame(params) {
  return request(`/api/service/add/game`, {
    method: 'POST',
    data: stringify({
      ...params,
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}

export async function submitAddTeam(params) {
  return request(`/api/mg/user/company/add`, {
    method: 'POST',
    data: stringify({
      ...params,
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
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
// 登录接口
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
// 获取手机验证码
export async function getFakeCaptcha(mobile) {
  const newParams = {
    phone: mobile,
  };
  return request(`/api/system/getPhoneCode`, {
    method: 'POST',
    data: stringify(newParams),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}
