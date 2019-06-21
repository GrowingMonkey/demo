import React, { PureComponent } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import oss from 'ali-oss';
import request from '@/utils/request';
import {
  Upload,
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  message,
  Card,
  InputNumber,
  Radio,
  Icon,
  Tooltip,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { promises } from 'fs';
import styles from "./style.less";
import mystyles from './AddAuthor.less';

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
const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

@connect(({ loading }) => ({
  submitting: loading.effects['form/submitRegularForm'],
}))
@Form.create()
class BasicForms extends PureComponent {
  state = {
    fileList: [],
  };

  handleSubmit = e => {
    const { dispatch, form } = this.props;
    const { fileList } = this.state;
    let strUrl = '';
    fileList.map((item, index) => (strUrl += `${item.imageUrl  },`));
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      console.log(values);
      if (!err) {
        dispatch({
          type: 'form/submitRegularForm',
          payload: {
            user: values.user,
            name: values.name,
            phone: values.phone,
            companyId: values.companyId,
            type: values.type,
            contractPath: strUrl,
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
    const content = (
      <div>
        <div className={mystyles.myButtonGroup}>
          <Button
            type="primary"
            icon="poweroff"
            onClick={this.handleButtonClick.bind(this, 'addAuthor')}
          >
            添加作者
          </Button>
          <Button
            type="danger"
            icon="poweroff"
            style={{ marginLeft: 24, backgroundColor: '#ff4d4f', color: '#fff' }}
            onClick={this.handleButtonClick.bind(this, 'addTeam')}
          >
            添加团队
          </Button>
        </div>
        {this.getReturnTitle('addAuthor')}
        <div />
      </div>
    );
    const fileProps = {
      name: 'file',
      showUploadList: false,
      onChange: this.handleChange,
      beforeUpload: this.beforeUpload,
    };
    const fileList = this.state ? this.state.fileList : '';
    return (
      <PageHeaderWrapper content={content}>
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label={<FormattedMessage id="作者名" />}>
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'validation.title.required' }),
                  },
                ],
              })(<Input placeholder={formatMessage({ id: 'form.title.placeholder' })} />)}
            </FormItem>
            <FormItem {...formItemLayout} label={<FormattedMessage id="手机号" />}>
              {getFieldDecorator('phone', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'validation.title.required' }),
                  },
                ],
              })(<Input placeholder={formatMessage({ id: 'form.title.placeholder' })} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="隶属公司">
              {getFieldDecorator('companyId')(
                <Select placeholder="请选择">
                  <Option value="0">关闭</Option>
                  <Option value="1">运行中</Option>
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="类型">
              {getFieldDecorator('type')(
                <Select placeholder="请选择">
                  <Option value="0">个人团队</Option>
                  <Option value="1">作者团队</Option>
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="等级">
              {getFieldDecorator('grade')(
                <Select placeholder="请选择">
                  <Option value="0">1</Option>
                  <Option value="1">2</Option>
                  <Option value="3">3</Option>
                  <Option value="4">4</Option>
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label={<FormattedMessage id="签约合同" />}>
              {getFieldDecorator('file', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'validation.title.required' }),
                  },
                ],
              })(
                <Upload {...fileProps} fileList={[]}>
                  <div>
                    <Button>
                      <Icon type="upload" /> 上传合同
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

export default BasicForms;
