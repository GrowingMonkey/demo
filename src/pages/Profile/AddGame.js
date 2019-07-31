import React, { PureComponent } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import oss from 'ali-oss';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import request from '@/utils/request';
import {
  Upload,
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Card,
  InputNumber,
  message,
  Radio,
  Icon,
  Tooltip,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { promises } from 'fs';
import styles from "./style.less";
import mystyles from './AddGame.less';

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
const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

@connect(({ loading }) => ({
  submitting: loading.effects['myform/submitRegularFormTwo'],
}))
@Form.create()
class BasicFormss extends PureComponent {
  state = {
    fileList: [],
    fileListTwo: [],
  };

  handleSubmit = e => {
    console.log(111);
    const { dispatch, form } = this.props;
    const { fileList, fileListTwo } = this.state;
    let strUrl = '';
    let strUrltwo = '';
    fileList.map((item, index) => (strUrl += `${item.imageUrl  },`));
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'myform/submitRegularFormTwo',
          payload: {
            name: values.name,
            detail: values.detail,
            detailImg:strUrl,
            usePoint:values.usePoint,
            getPoint:values.getPoint,
            url: values.url,
          },
        });
        
      }
    });
  };

  handleButtonClick = key => {
    const { match } = this.props;
    console.log(this.props);
    console.log(key);
    switch (key) {
      case 'addAuthor':
        router.push(`/form/addauthor`);
        break;
      case 'addTeam':
        router.push(`/form/addteam`);
        break;
      default:
        break;
    }
  };

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

  getReturnTitle = key => {
    let el;
    switch (key) {
      case 'addAuthor':
        el = <div>新增作者</div>;
        break;
      case 'addTeam':
        el = <div>新增公司</div>;
        break;
      default:
        break;
    }
    return el;
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
      UploadToOss(this, 'admin/contract', file).then(data => {
        if (data.res.status == 200) {
          console.log(this.state);
          this.setState(prevState => ({
            fileList: [...prevState.fileList, { imageUrl: data.res.requestUrls[0].split('?')[0] }],
          }));
          console.log(this.state);
          // this.setState({ imageUrl: data.res.requestUrls[0].split('?')[0] });
          message.success('上传成功');
        }
        console.log(this.state);
        // this.setState({ imageUrl: data.res.requestUrls });
      });
    };
    return false; // 不调用默认的上传方法
  };

  beforeUploadTwo = file => {
    const isJPG = file.type === 'image/jpeg';
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      // 使用ossupload覆盖默认的上传方法
      UploadToOss(this, 'admin/company', file).then(data => {
        if (data.res.status == 200) {
          console.log(this.state);
          this.setState(prevState => ({
            fileListTwo: [
              ...prevState.fileListTwo,
              { imageUrl: data.res.requestUrls[0].split('?')[0] },
            ],
          }));
          console.log(this.state);
          // this.setState({ imageUrl: data.res.requestUrls[0].split('?')[0] });
          message.success('上传成功');
        }
        console.log(this.state);
        // this.setState({ imageUrl: data.res.requestUrls });
      });
    };
    return false; // 不调用默认的上传方法
  };

  render() {
    const { submitting } = this.props;
    const {
      form: { getFieldDecorator, getFieldValue },
    } = this.props;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };
    const fileProps = {
      name: 'file',
      showUploadList: false,
      onChange: this.handleChange,
      beforeUpload: this.beforeUpload,
    };
    const fileList = this.state ? this.state.fileList : '';
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label="游戏名称">
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'validation.title.required' }),
                  },
                ],
              })(<Input placeholder={formatMessage({ id: 'form.title.placeholder' })} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="游戏url">
              {getFieldDecorator('url', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'validation.title.required' }),
                  },
                ],
              })(<Input placeholder={formatMessage({ id: 'form.title.placeholder' })} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="游戏说明">
            {getFieldDecorator('detail', {
              rules: [{
                required: true,
                message: '请输入游戏说明',
              }],
            })(
              <TextArea size="large" placeholder="请输入游戏说明" rows={4} />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="游戏消耗积分说明">
            {getFieldDecorator('usePoint', {
              rules: [{
                required: true,
                message: '请输入游戏消耗积分说明',
              }],
            })(
              <TextArea size="large" placeholder="请输入游戏消耗积分说明" rows={4} />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="游戏获取积分说明">
            {getFieldDecorator('getPoint', {
              rules: [{
                required: true,
                message: '请输入游戏获取积分说明',
              }],
            })(
              <TextArea size="large" placeholder="请输入游戏获取积分说明" rows={4} />
            )}
          </FormItem>
            <FormItem {...formItemLayout} label="游戏介绍图">
              {getFieldDecorator('file', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'validation.title.required' }),
                  },
                ],
              })(
                <Upload {...fileProps}>
                  <div>
                    <Button>
                      <Icon type="upload" /> 上传文件
                    </Button>
                  </div>
                </Upload>
              )}
            </FormItem>
            <FormItem wrapperCol={{ span: 12, offset: 7 }}>
              <div>
                {fileList.map(function(item, index) {
                  return (
                    <img
                      src={item ? item.imageUrl : ''}
                      style={{ width: 100, height: 100, marginRight: 20 }}
                      key={index}
                    />
                  );
                })}
              </div>
            </FormItem>
            <FormItem wrapperCol={{ span: 12, offset: 7 }}>
              <Button type="primary" htmlType="submit">
                确定
              </Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default BasicFormss;
