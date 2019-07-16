import React, { PureComponent, Suspense } from 'react';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import { connect } from 'dva';
import moment from 'moment';
import PageLoading from '@/components/PageLoading';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import {
  List,
  Avatar,
  Dropdown,
  Progress,
  Menu,
  Row,
  Col,
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Card,
  InputNumber,
  Radio,
  Icon,
  Tooltip,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
// import styles from '../Forms/style.less';
import styles from './PullSend.less';
Date.prototype.Format = function (fmt) { //author: meizz 
  var o = {
      "M+": this.getMonth() + 1, //月份 
      "d+": this.getDate(), //日 
      "h+": this.getHours(), //小时 
      "m+": this.getMinutes(), //分 
      "s+": this.getSeconds(), //秒 
      "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
      "S": this.getMilliseconds() //毫秒 
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
  if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}
console.log(styles);
const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const ListContent = ({ data: { createdAt, subDescription } }) => (
  <div className={styles.listContent} style={{ flex: 5 }}>
    {subDescription}
    {/* <span>开始时间</span>
      <p>{moment(createdAt).format('YYYY-MM-DD HH:mm')}</p> */}
  </div>
);
// @connect(({ loading }) => ({
//   submitting: loading.effects['form/submitRegularForm'],
// }))
@connect(({ profile, loading }) => ({
  profile,
  loading: loading.models.profile,
}))
@Form.create()
class BasicForms extends PureComponent {
  handleSubmit = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    console.log(1111);
    form.validateFieldsAndScroll((err, values) => {
      console.log(new Date(parseInt(values.pushTime.valueOf())+2*60*1000).Format("yyyy-MM-dd hh:mm:ss"));
      if (!err) {
        console.log(111);
        dispatch({
          type: 'profile/submitRegularForm',
          payload: {
            title: values.title,
            sys: values.sys,
            pushType: values.pushType,
            pushTime: new Date(parseInt(values.pushTime.valueOf())+2*60*1000).Format("yyyy-MM-dd hh:mm:ss"),
            content: values.content,
          },
        });
        
      }
    });
  };

  componentDidMount() {
    console.log(111);
    const { dispatch } = this.props;
    dispatch({
      type: 'profile/pushfetch',
    });
  }
  columns = [
    {
      title: '推送时间',
      dataIndex: 'pushTime',
    },
    {
      title: '推送内容',
      dataIndex: 'content',
    },
  ];

  render() {
    const {
      profile: { profile },
      loading,
    } = this.props;
    console.log(this.props);
    const { submitting } = this.props;
    const{profile: { datass }}=this.props;
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
    const disabledDate=(current)=> {
      // Can not select days before today and today
      console.log(moment().endOf('day'));
      return current < moment().startOf('day');
      
    }
    const disabledDateTime=()=>{
      const hours=moment().hours();
      const minutes=moment().minutes();
      return {
        disabledHours: () => range(0, 24).splice(0, hours),
        disabledMinutes: () => range(0, 60).splice(0,minutes+2),
        // disabledSeconds: () => [55, 56],
      };
    }
    const range=(start, end)=>{
      const result = [];
      for (let i = start; i < end; i++) {
        result.push(i);
      }
      return result;
    }
    
    return (
      <PageHeaderWrapper title="推送设置">
        <div className={styles.standardList}>
          <GridContent>
            <Suspense fallback={<PageLoading />}>
              <Card bordered={false} title="推送发布">
                <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
                  <FormItem label="标题" {...formItemLayout}>
                    {getFieldDecorator('title')(<Input placeholder="请输入" />)}
                  </FormItem>
                  <FormItem label="平台" {...formItemLayout}>
                    {getFieldDecorator('sys')(
                      <Select placeholder="请选择">
                        <Option value="0">全部</Option>
                        <Option value="1">安卓</Option>
                        <Option value="2">ios</Option>
                      </Select>
                    )}
                  </FormItem>
                  <FormItem {...formItemLayout} label="推送类型">
                    {getFieldDecorator('pushType', {
                      rules: [
                        {
                          required: true,
                          message: formatMessage({ id: 'validation.date.required' }),
                        },
                      ],
                    })(
                      <Select placeholder="请选择">
                        <Option value="broadcast">广播推送</Option>
                      </Select>
                    )}
                  </FormItem>
                  <FormItem {...formItemLayout} label="推送时间">
                    {getFieldDecorator('pushTime', {
                      rules: [
                        {
                          required: true,
                          message: formatMessage({ id: 'validation.date.required' }),
                        },
                      ],
                    })(
                      // <DatePicker showTime placeholder="请选择推送时间" style={{ width: '100%' }} />
                      <DatePicker
                      format="YYYY-MM-DD HH:mm:ss"
                      placeholder="请选择推送时间"
                      style={{ width: '100%' }}
                      disabledDate={disabledDate}
                      disabledTime={disabledDateTime}
                      showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                    />
                      // <DatePicker showTime placeholder="请选择推送时间" style={{ width: '100%' }}  disabledDate={disabledDate} disabledTime={disabledDateTime}/>
                    )}
                  </FormItem>
                  <FormItem {...formItemLayout} label="内容">
                    {getFieldDecorator('content', {
                      rules: [
                        {
                          required: true,
                          message: formatMessage({ id: 'validation.goal.required' }),
                        },
                      ],
                    })(
                      <TextArea
                        style={{ minHeight: 32 }}
                        placeholder={formatMessage({ id: 'form.goal.placeholder' })}
                        rows={4}
                      />
                    )}
                  </FormItem>

                  <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
                    <Button type="primary" htmlType="submit" loading={submitting}>
                      <FormattedMessage id="form.submit" />
                    </Button>
                  </FormItem>
                </Form>
              </Card>
            </Suspense>
            <Suspense fallback={null}>
              <Card bordered={false} style={{ marginTop: 8 }}>
              <h1>历史配置</h1>
                {/* <List
                  size="large"
                  rowKey="id"
                  loading={loading}
                  dataSource={profile}
                  renderItem={item => (
                    <List.Item>
                      <List.Item.Meta
                        title={
                          <a href={item.href} style={{ width: '20%' }}>
                            {item.title}
                          </a>
                        }
                      />
                      <ListContent data={item} />
                    </List.Item>
                  )}
                /> */}
                <StandardTable
                  // selectedRows={selectedRows}
                  loading={loading}
                  data={datass}
                  columns={this.columns}
                  // onSelectRow={this.handleSelectRows}
                  // onChange={this.handleStandardTableChange}
                />
              </Card>
            </Suspense>
          </GridContent>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default BasicForms;
