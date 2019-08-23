import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import TimePicker from '@/components/myComponents/TimePicker'
import {
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
import styles from '../Forms/style.less';
import { router } from 'umi';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

@connect(({ loading }) => ({
  submitting: loading.effects['activitysend/add'],
}))
@Form.create()
class BasicForms extends PureComponent {
  handleSubmit = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'activitysend/add',
          payload: values,
        });
        message.success('添加成功');
        router.push(`/profile/tagmanager`)
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
      <PageHeaderWrapper title="新增标签">
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label="标签名称">
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'validation.comname.required' }),
                  },
                ],
              })(<Input placeholder={formatMessage({ id: 'form.title.placeholder' })} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="标签说明">
              {getFieldDecorator('detail', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'validation.bannername.required' }),
                  },
                ],
              })(<Input placeholder={formatMessage({ id: 'form.title.placeholder' })} />)}
            </FormItem>
            {/* <FormItem {...formItemLayout} label={<FormattedMessage id="是否展示" />}>
              {getFieldDecorator('type', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'validation.bannertype.required' }),
                  },
                ],
              })(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="1">是</Option>
                  <Option value="2">否</Option>
                </Select>
              )}
            </FormItem> */}
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                提交
              </Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default BasicForms;
