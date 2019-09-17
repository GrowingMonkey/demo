import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import oss from 'ali-oss';
import request from '@/utils/request';
import {
    Card,
    Form, 
    Input,
    InputNumber,
    Button,
    message,
    Upload,
    Icon,
    Col,
    Row
  } from 'antd';
const FormItem = Form.Item;
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
          endpoint: 'http://oss-cn-shenzhen.aliyuncs.com',
          bucket: 'imuguang-file',
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
    return `${path}/${uuid()}${file.name}`;
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
@Form.create()
class InputForm extends PureComponent {
    constructor(props) {
        super(props);
        this.state={
           imgUrl:'',
           oldImgUrl:''
        };
      }
    componentDidMount(){
        const {sourceValue}=this.props;
    }
    toggle = () => {
        this.setState({
          disabled: !this.state.disabled,
        });
      };
    submitValue=()=>{
        
            console.log('提交')
    }
    handleChange = info => {
        if (info.file.status === 'uploading') {
          this.setState({ loading: true });
          return;
        }
        if (info.file.status === 'done') {
          // Get this url from response in real world.
          getBase64(info.file.originFileObj, imageUrl =>
            this.setState({
              imageUrl,
              loading: false,
            })
          );
        }
      };
      beforeUpload = file => {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          message.error('Image must smaller than 2MB!');
        }
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
          // 使用ossupload覆盖默认的上传方法
          UploadToOss(this, 'icon/app', file).then(data => {
            if (data.res.status == 200) {
            //   console.log(this.state);
            //   this.setState(prevState => ({
            //     fileList: [...prevState.fileList, { imageUrl: data.res.requestUrls[0].split('?')[0] }],
            //   }));
              console.log(data.res.requestUrls[0].split('?')[0]);
              this.setState(prevState => ({
                    imgUrl:  data.res.requestUrls[0].split('?')[0]
                  }));
              // this.setState({ imageUrl: data.res.requestUrls[0].split('?')[0] });
              message.success('上传成功');
            }
            console.log(this.state);
            // this.setState({ imageUrl: data.res.requestUrls });
          });
        };
        return false; // 不调用默认的上传方法
      };
      handleUpdate=(val)=>{
        this.setState({
          oldImgUrl:val
        })
      }
      handleSubmit=()=>{
        const {imgUrl,oldImgUrl}=this.state;
        const {code}=this.props;
        if(imgUrl==oldImgUrl){
          this.props.setValue(imgUrl,code);
        }else{
          message.error('请先上传图标，然后修改，再提交');
        }
      }
    render(){
        const fileProps = {
            name: 'file',
            showUploadList: false,
            onChange: this.handleChange,
            beforeUpload: this.beforeUpload,
          };
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
          labelCol: {
            xs: { span: 24 },
            sm: { span: 10},
          },
          wrapperCol: {
            xs: { span: 24 },
            sm: { span: 14 },
            // md: { span: 10 },
          },
        };
        const {title,sourceValue,msg,setValue}=this.props;
        const {imgUrl,oldImgUrl}=this.state;
        return(
            <div style={{display:'flex'}}>
            <FormItem {...formItemLayout} label={title?title:''}>
              {getFieldDecorator('file', {
                rules: [
                  {
                    required: true,
                  },
                ],
              })(
                <Upload {...fileProps}>
                  <div>
                    <Button >
                      <Icon type="upload" /> {msg}
                    </Button>
                  </div>
                </Upload>
              )}
            </FormItem>
            <div style={{display:'flex',flexDirection:'column'}}>
                <div style={{width:24,height:24,overflow:'hidden',marginLeft:24,marginTop:8,background:'#ddd'}}>
                    <img src={oldImgUrl}/>
                </div>
                <span style={{textAlign:'right',fontSize:12,color:'red'}}>原</span>
            </div>
            <div style={{display:'flex',flexDirection:'column'}}>
                <div style={{width:24,height:24,overflow:'hidden',marginLeft:24,marginTop:8,background:'#ddd'}}>
                    <img src={this.state.imgUrl}/>
                </div>
                <span style={{textAlign:'right',fontSize:12,color:'red'}}>新</span>
            </div>
            <Button onClick={()=>this.handleUpdate(imgUrl)} type="primary"  style={{marginLeft:24,marginTop:4}}>
                修改
            </Button>
            <Button onClick={()=>this.handleSubmit()} type="primary"  style={{marginLeft:24,marginTop:4}}>
                提交
            </Button>
          </div>
        )
    }
}
export default InputForm;