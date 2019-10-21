import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
const {OSS_BURKET,OSS_END_POINT,API_ADDRESS,CDN_ADDRESS,API_ENV}=process.env;
import oss from 'ali-oss';
import 'braft-editor/dist/index.css';
import request from '@/utils/request';
import {
  Card,
  Form, 
  Input,
  Button,
  message,
  Collapse,
  Icon,
  Col,
  Row
} from 'antd';
const { Panel } = Collapse;
const { TextArea } = Input;
const FormItem = Form.Item;
import { router } from 'umi';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }
const client = self => {
    // const {token} = self.state
    // console.log(token);
    // 当时使用的插件版本为5.2
    /*
    return new oss.Wrapper({
      accessKeyId: token.access_key_id,
      accessKeySecret: token.access_key_secret,
      region: '', //
      bucket: '',//
    });
    */
    return request('/api/system/getSTSToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        token: window.localStorage.getItem('token'),
      },
    });
};
const UploadToOss = (self, path, file) => {
    const url = uploadPath(path, file);
    return new Promise((resolve, reject) => {
      client().then(res => {
        const obj = JSON.parse(res.data);
        console.log(obj);
        new oss({
          accessKeyId: obj.accessKeyId,
          accessKeySecret: obj.accessKeySecret,
          stsToken: obj.securityToken,
          endpoint: OSS_END_POINT?OSS_END_POINT:'http://oss-cn-shenzhen.aliyuncs.com',
          bucket: OSS_BURKET?OSS_BURKET:'imuguang-file',
        })
          .multipartUpload(url, file)
          .then(data => {
            resolve(data);
          })
          .catch(error => {
            reject(error);
          });
      });
    });
};
const uploadPath = (path, file) => {
    // 上传文件的路径，使用日期命名文件目录
    return `wh/keyword.txt`;
};
const uuid = () => {
    const s = [];
    const hexDigits = '56789abcdefghijk';
    for (let i = 0; i < 36; i++) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = '4'; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = '-';
    let uuid = s.join('');
    uuid = uuid.replace(/[-]/g, '');
    return uuid;
};
@connect(({ keyword, loading }) => ({
  keyword,
  loading: loading.models.keyword,
}))
@Form.create()
class KeyWord extends PureComponent {
    state={
        keywords:'',
        btnState:true
    }
    componentDidMount(){
        let that=this;
        this.Ajax(`${CDN_ADDRESS?CDN_ADDRESS:'http://imuguang-file.oss-cn-shenzhen.aliyuncs.com'}/wh/keyword.txt`,function(str){
           that.setState({
            keywords:str
           })
          
        },function(){})
    }
    handleUpdate=()=>{
        this.setState({
            btnState:false,
        })
        // document.querySelector('#context').focus();
    }
    Ajax=(url, fnSucc, fnFaild)=>{
        //1.创建ajax对象
        if (window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
            var oAjax = new XMLHttpRequest();
        } else { // code for IE6, IE5
            var oAjax = new ActiveXObject("Microsoft.XMLHTTP");
        }
        //2.链接服务器（打开服务器的连接）
        //open(方法，文件名，异步传输)
        oAjax.open('GET', url, true);
        //3.发送
        oAjax.send();
        //4.接收返回
        oAjax.onreadystatechange = function () {
            if (oAjax.readyState == 4) {
                if (oAjax.status == 200) {
                    fnSucc(oAjax.responseText);
                } else {
                    fnFaild(oAjax.status);
                }
            };
        };
    }
    sourceUploadFile=(file)=>{
      let form = new FormData()
      form.append('file',file)
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function () { 
          if(xhr.readyState == 4){  
              var data = xhr.responseText;
              console.log(data)
          }
      };
      // GET请求
      // xhr.open('GET', '/xhr_ajax?p=123');
      // xhr.send();
      // POST请求
      xhr.open('POST', `${CDN_ADDRESS?CDN_ADDRESS:'http://test.imuguang.com'}/${API_ENV=='aiyu'?'adminapi':'api'}/upload/keywords/modifyWord`); 
      // ajax.setRequestHeader("content-type","application/x-www-form-urlencoded")
      // 发送请求
      xhr.send(`Words=${fieldsValue}`);
    }
    handleUpload=()=>{
        const {dispatch,form}=this.props;
        form.validateFields((err, fieldsValue) => {
          if (err) return;
          form.resetFields();
          console.log(fieldsValue.file);
          let file = new File([`${fieldsValue.file}`], 'keywordcopy.txt', {
            type: 'text/plain',
        });
        dispatch({
          type:'keyword/update',
          payload:{
            words:fieldsValue.file
          }
        })
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
          // 使用ossupload覆盖默认的上传方法
          UploadToOss(this, 'wh', file).then(data => {
            if (data.res.status == 200) {
              console.log(data.res.requestUrls[0].split('?')[0]);
              message.success('上传成功');
            }
          });
        };
      });
    }
    render(){
      const { getFieldDecorator } = this.props.form;
        const {btnState,keywords}=this.state;
        return(
        <PageHeaderWrapper title="屏蔽词配置">
            <Card>
            <FormItem>
              {getFieldDecorator('file', {
                rules: [
                  {
                    required: true,
                  },
                ],
                initialValue:keywords
              })(<TextArea disabled={btnState} rows={24}/>)}
            </FormItem>
            </Card>
            <Button onClick={()=>this.handleUpdate()} type="primary"  style={{marginLeft:24,marginTop:4}}>修改</Button>
            <Button onClick={()=>this.handleUpload()} type="primary"  style={{marginLeft:24,marginTop:4}}>提交</Button>
        </PageHeaderWrapper>)
    }
}

export default KeyWord;
