import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import 'braft-editor/dist/index.css';
import BraftEditor from 'braft-editor';
import { ContentUtils } from 'braft-utils'
import { ImageUtils } from 'braft-finder'
import { Upload } from 'antd';
import oss from 'ali-oss';
import request from '@/utils/request';
import {
  Card,
  Form, 
  Input,
  Button,
  message,
  Icon
} from 'antd';
const FormItem = Form.Item;
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from '../Forms/style.less';
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
  // return new Promise((resolve, reject) => {
  //   client().then(res=>{
  //     console.log(res);
  //     return new oss({
  //         accessKeyId: res.accessKeyId,
  //         accessKeySecret: res.accessKeySecret,
  //         stsToken: res.securityToken,
  //         endpoint: "http://oss-cn-shenzhen.aliyuncs.com",
  //         bucket: "imuguang-file"
  //       });

  //   }).then(oss=>{
  //     console.log(file);
  //     console.log(url);
  //     oss.multipartUpload(url, file).then(data => {
  //       resolve(data);
  //     }).catch(error => {
  //       reject(error)
  //     })
  //   })
  // })
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
@connect(({ serviceset, loading }) => ({
  serviceset,
  submitting: loading.effects['form/submitRegularForm'],
}))
@Form.create()
class ServiceSet extends PureComponent {
  state = {
    editorState: BraftEditor.createEditorState(null),
    cover:''
  }
  beforeUpload = (file,cover) => {
    const isJPG = file.type === 'image/jpeg';
    console.log(file.type);
    const isLt2M = file.size / 1024 / 1024 < 2;
    // if (!isLt2M) {
    //   message.error('Image must smaller than 2MB!');
    // }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    let mediaType=file.type.indexOf('video/')>-1?'video':(file.type.indexOf('image/')>-1?'image':(file.type.indexOf('audio/')>-1?'audio':'other'));
    reader.onloadend = () => {
      // 使用ossupload覆盖默认的上传方法
      UploadToOss(this, `admin/${mediaType}`, file).then(data => {
        if (data.res.status == 200) {
          console.log(data.res);
          // this.setState(prevState => ({
          //   fileList: [...prevState.fileList, { imageUrl: data.res.requestUrls[0].split('?')[0] }],
          // }));
          console.log(mediaType);
          // this.setState({ imageUrl: data.res.requestUrls[0].split('?')[0] });
          message.success('上传成功');
          if(!cover){
            this.setState({
              editorState: ContentUtils.insertMedias(this.state.editorState, [{
                type: mediaType.toUpperCase(),
                url:  data.res.requestUrls[0].split('?')[0]
              }])
            })
          }else{
          this.setState({
            cover: data.res.requestUrls[0].split('?')[0]
          })
          console.log(this.state);
        }
        }
        console.log(this.state);
        // this.setState({ imageUrl: data.res.requestUrls });
      });
    };
    return false; // 不调用默认的上传方法
  };
//   componentDidMount () {

//     // 异步设置编辑器内容
//     setTimeout(() => {
//       this.props.form.setFieldsValue({
//         content: BraftEditor.createEditorState('<p>Hello <b>World!</b></p>')
//       })
//     }, 1000)

//   }
//    handleSubmit = (event) => {

//     event.preventDefault()

//     this.props.form.validateFields((error, values) => {
//       if (!error) {
//         const submitData = {
//           title: values.title,
//           content: values.content.toRAW() // or values.content.toHTML()
//         }
//         console.log(submitData)
//       }
//     })

//   }
preview = () => {

  if (window.previewWindow) {
    window.previewWindow.close()
  }

  window.previewWindow = window.open()
  window.previewWindow.document.write(this.buildPreviewHtml())
  window.previewWindow.document.close()

}
handleChange = (editorState) => {
  console.log(this.state.editorState);
  this.setState({ editorState })
}
uploadHandler = (param) => {
  // console.log(e.tartget);
  console.log(param);
  if (!param.file) {
    console.log('112')
    return false
  }
  //图片IMAGE
  //视频VIDEO
  //音频AUDIO
  this.beforeUpload(param.file);
}
uploadCoverHandler = (param) => {
  // console.log(e.tartget);
  console.log(param);
  if (!param.file) {
    console.log('112')
    return false
  }
  //图片IMAGE
  //视频VIDEO
  //音频AUDIO
  this.beforeUpload(param.file,1);
}
buildPreviewHtml () {

  return `
    <!Doctype html>
    <html>
      <head>
        <title>Preview Content</title>
        <style>
          html,body{
            height: 100%;
            margin: 0;
            padding: 0;
            overflow: auto;
            background-color: #f1f2f3;
          }
          .container{
            box-sizing: border-box;
            width: 1000px;
            max-width: 100%;
            min-height: 100%;
            margin: 0 auto;
            padding: 30px 20px;
            overflow: hidden;
            background-color: #fff;
            border-right: solid 1px #eee;
            border-left: solid 1px #eee;
          }
          .container img,
          .container audio,
          .container video{
            max-width: 100%;
            height: auto;
          }
          .container p{
            white-space: pre-wrap;
            min-height: 1em;
          }
          .container pre{
            padding: 15px;
            background-color: #f1f1f1;
            border-radius: 5px;
          }
          .container blockquote{
            margin: 0;
            padding: 15px;
            background-color: #f1f1f1;
            border-left: 3px solid #d1d1d1;
          }
        </style>
      </head>
      <body>
        <div class="container">${this.state.editorState.toHTML()}</div>
      </body>
    </html>
  `

}
handleSubmit(){
  e => {
    const { dispatch, form } = this.props;
    const { cover} = this.state;
    let htmlContent=this.preview();
    console.log(cover);
    console.log(htmlContent);
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      console.log(values);
      if (!err) {
        // 提交数据
        // dispatch({
        //   type: 'form/submitRegularForm',
        //   payload: {
        //     user: values.user,
        //     name: values.name,
        //     phone: values.phone,
        //     companyId: values.companyId,
        //     type: values.type,
        //     contractPath: strUrl,
        //   },
        // });
      }
    });
  };
}
  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 3},
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
        // md: { span: 10 },
      },
    };
    const controls = [ 'undo', 'redo', 'separator',
    'font-size', 'line-height', 'letter-spacing', 'separator',
    'text-color', 'bold', 'italic', 'underline', 'strike-through', 'separator',
    'superscript', 'subscript', 'remove-styles', 'emoji',  'separator', 'text-indent', 'text-align', 'separator',
    'headings', 'list-ul', 'list-ol', 'blockquote', 'code', 'separator',
    'link', 'separator', 'hr', 'separator', 'separator',  'clear' ]
    const extendControls = [
      {
        key: 'antd-uploader',
        type: 'component',
        component: (
          <Upload
            showUploadList={false}
            customRequest={this.uploadHandler}
          >
            {/* 这里的按钮最好加上type="button"，以避免在表单容器中触发表单提交，用Antd的Button组件则无需如此 */}
            <button type="button" className="control-item button upload-button" data-title="插入图片">
              <Icon type="picture" theme="filled" />
            </button>
          </Upload>
        )
      },
      {
        key: 'custom-button',
        type: 'button',
        text: '预览',
        onClick: this.preview
      }
    ]
    const fileProps={
      name: 'file',
      accept:"image/*",
      showUploadList:false
    }
    return (
      <PageHeaderWrapper title="活动发布">
        <Card bordered={false}>
          <div className="demo-container">
        <Form onSubmit={this.handleSubmit}>
          <FormItem {...formItemLayout} label="活动标题">
            {getFieldDecorator('title', {
              rules: [{
                required: true,
                message: '请输入标题',
              }],
            })(
              <Input size="large" placeholder="请输入标题"/>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="活动内容">
            {/* {getFieldDecorator('content', {
              validateTrigger: 'onBlur',
              rules: [{
                required: true,
                validator: (_, value, callback) => {
                  if (value.isEmpty()) {
                    callback('请输入正文内容')
                  } else {
                    callback(value)
                  }
                }
              }],
              initialValue:'请输入正文'
            })( */}
              <BraftEditor
                value={this.state.editorState}
                onChange={this.handleChange}
                className="my-editor"
                style={{border:'1px solid #ddd'}}
                controls={controls}
                placeholder="请输入正文内容"
                extendControls={extendControls}
              />
            {/* )} */}
          </FormItem>
          <FormItem {...formItemLayout} label="活动封面">
              {getFieldDecorator('file', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'validation.title.required' }),
                  },
                ],
              })(
                <Upload {...fileProps} fileList={[]} customRequest={this.uploadCoverHandler}>
                  <div>
                    <Button>
                      <Icon type="upload" /> 上传封面
                    </Button>
                  </div>
                </Upload>
              )}
            </FormItem>
            <FormItem wrapperCol={{ span: 24, offset: 3 }}>
              <div>
               <img src={this.state.cover ? this.state.cover: ''} style={{width:200,height:'auto'}}/>
              </div>
            </FormItem>
          <FormItem {...formItemLayout} wrapperCol={{ span: 24, offset: 3 }}>
            <Button size="large" type="primary" htmlType="submit">提交</Button>
          </FormItem>
        </Form>
      </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default ServiceSet;
