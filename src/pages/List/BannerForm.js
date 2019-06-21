import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import {
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
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from '../Forms/style.less';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

@connect(({ loading }) => ({
  submitting: loading.effects['form/submitRegularForm'],
}))
@Form.create()
class BasicForms extends PureComponent {
  handleSubmit = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'form/submitRegularForm',
          payload: values,
        });
      }
    });
  };

  render() {
    const { submitting } = this.props;
    console.log(submitting);
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

    return (
      <PageHeaderWrapper title={<FormattedMessage id="app.forms.basic.title" />}>
        <Card bordered={false}>
          <div style={{ textAlign: 'center', fontWeight: 500, color: '#000', fontSize: 18 }}>
            <Icon type="bar-chart" style={{ color: '#1890FF', marginRight: 12 }} />
            广告投放
          </div>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label={<FormattedMessage id="公司名称" />}>
              {getFieldDecorator('comAccount', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'validation.comname.required' }),
                  },
                ],
              })(<Input placeholder={formatMessage({ id: 'form.title.placeholder' })} />)}
            </FormItem>
            <FormItem {...formItemLayout} label={<FormattedMessage id="广告名称" />}>
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'validation.bannername.required' }),
                  },
                ],
              })(<Input placeholder={formatMessage({ id: 'form.title.placeholder' })} />)}
            </FormItem>
            <FormItem {...formItemLayout} label={<FormattedMessage id="广告类型" />}>
              {getFieldDecorator('type', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'validation.bannertype.required' }),
                  },
                ],
              })(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="1">自用</Option>
                  <Option value="2">非自用</Option>
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label={<FormattedMessage id="广告地址" />}>
              {getFieldDecorator('forwardUrl', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'validation.bannertype.required' }),
                  },
                ],
              })(<Input placeholder={formatMessage({ id: 'form.title.placeholder' })} />)}
            </FormItem>
            <FormItem {...formItemLayout} label={<FormattedMessage id="广告位置" />}>
              {getFieldDecorator('location', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'validation.bannerloc.required' }),
                  },
                ],
              })(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">载入画面</Option>
                  <Option value="1">banner</Option>
                  <Option value="2">轮播图</Option>
                  <Option value="3">瀑布图</Option>
                  <Option value="4">分享页底部广告</Option>
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label={<FormattedMessage id="form.date.label" />}>
              {getFieldDecorator('date', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'validation.date.required' }),
                  },
                ],
              })(
                <RangePicker
                  style={{ width: '100%' }}
                  placeholder={[
                    formatMessage({ id: 'form.date.placeholder.start' }),
                    formatMessage({ id: 'form.date.placeholder.end' }),
                  ]}
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label={<FormattedMessage id="form.date.label" />}>
              {getFieldDecorator('date', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'validation.date.required' }),
                  },
                ],
              })(
                <RangePicker
                  style={{ width: '100%' }}
                  placeholder={[
                    formatMessage({ id: 'form.date.placeholder.start' }),
                    formatMessage({ id: 'form.date.placeholder.end' }),
                  ]}
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
      </PageHeaderWrapper>
    );
  }
}

export default BasicForms;
