import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
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
  Row,
  Col,
  Dropdown,
  Menu,
  Modal,
  message,
  Badge,
  Divider,
  Steps,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from '../Forms/style.less';
import StandardTable from '@/components/StandardTable';

const statusMap = ['default', 'processing', 'success', 'error'];
const status = ['关闭', '运行中', '已上线', '异常'];
const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

@connect(({ serviceset, loading }) => ({
  serviceset,
  submitting: loading.effects['form/submitRegularForm'],
}))
@Form.create()
class ServiceSet extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
    modelType: 1,
  };

  handleSubmit = e => {
    console.log(111);
    const { dispatch, form } = this.props;
    e.preventDefault();
    console.log(form.getFieldValue('name'));
    form.validateFieldsAndScroll(['name', 'url'], (err, values) => {
      console.log(values);
      if (!err) {
        dispatch({
          type: 'serviceset/add',
          payload: values,
        });
      }
    });
  };

  columns = [
    {
      title: '上架市场',
      dataIndex: 'detail',
    },
    {
      title: 'url地址',
      dataIndex: 'url',
    },
    {
      title: '配置时间',
      dataIndex: 'createTime',
      sorter: true,
      render: val => <span>{moment(parseInt(val)).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    // {
    //   title: '操作',
    //   render: (text, record) => (
    //     <Fragment>
    //       <a onClick={() => this.handleUpdateModalVisible(true, record)}>删除</a>
    //     </Fragment>
    //   ),
    // },
  ];

  handleDelete(record) {
    const { dispatch } = this.props;
    dispatch({
      type: 'serviceset/delete',
      payload: record,
    });
  }

  handleUpdateModalVisible = flag => {
    this.setState({
      updateModalVisible: !!flag,
    });
  };
  
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'serviceset/fetch',
      payload: {
        page: 1,
        size: 10,
        type: 'mkurl',
      },
    });
    dispatch({
      type: 'serviceset/marketfetch',
      payload: {
        type: 'market',
      },
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter, type) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'serviceset/fetch',
      payload: params,
      // payload:{
      //   page:1,
      //   size:10,
      //   type:type
      // }
    });
  };

  handleModalVisible(bool) {
    const { dispatch } = this.props;
  }

  handleSearch = e => {
    console.log(1111);
    e.preventDefault();

    const { dispatch, form } = this.props;
    form.validateFields(['nameStr'], (err, fieldsValue) => {
      console.log(fieldsValue);
      const values = {
        name: fieldsValue.nameStr,
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'serviceset/addOptions',
        payload: values,
      });
      this.handleUpdateModalVisible(false);
    });
  };

  renderContent() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <FormItem label="应用市场名称">
          {getFieldDecorator('nameStr')(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem {...submitFormLayout} style={{ marginTop: 80 }}>
          <Button type="primary" htmlType="submit">
            <FormattedMessage id="form.submit" />
          </Button>
        </FormItem>
      </Form>
    );
  }

  render() {
    const {
      serviceset: { data, optionlist },
      loading,
    } = this.props;
    console.log(this.props);
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
    const { selectedRows, modalVisible, updateModalVisible, stepFormValues } = this.state;
    return (
      <PageHeaderWrapper title="配置页面">
        <Card bordered={false}>
          <div style={{ textAlign: 'center', fontWeight: 500, color: '#000', fontSize: 18 }}>
            <Icon type="bar-chart" style={{ color: '#1890FF', marginRight: 12 }} />
            配置页面
          </div>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label={<FormattedMessage id="配置上架市场平台" />}>
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'validation.bannertype.required' }),
                  },
                ],
              })(
                <Select placeholder="请选择" style={{ width: '60%' }}>
                  {optionlist.map((intem, i) => {
                    return (
                      <Option value={intem.detail} key={i}>
                        {intem.detail}
                      </Option>
                    );
                  })}
                </Select>
              )}
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <div style={{ width: '100%', display: 'inline-block' }}>
                <div
                  style={{ display: 'inline-block', marginLeft: 24 }}
                  onClick={() => this.handleUpdateModalVisible(true)}
                >
                  <Icon type="plus-circle" style={{ marginRight: 10, fontSize: 22 }} />
                  新增应用市场
                </div>
              </div>
            </FormItem>
            <FormItem {...formItemLayout} label="url">
              {getFieldDecorator('url')(<Input placeholder="请输入url" style={{ width: '60%' }} />)}
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={loading}>
                <FormattedMessage id="form.submit" />
              </Button>
            </FormItem>
          </Form>
        </Card>
        <Card style={{ marginTop: 8 }}>
          <h1>历史配置</h1>
          <StandardTable
            // selectedRows={selectedRows}
            loading={loading}
            data={data}
            columns={this.columns}
            // onSelectRow={this.handleSelectRows}
            // onChange={this.handleStandardTableChange}
          />
        </Card>
        <Modal
          width={480}
          bodyStyle={{ padding: '32px 40px 48px' }}
          destroyOnClose
          visible={updateModalVisible}
          onCancel={() => this.handleUpdateModalVisible(false)}
          // afterClose={() =>this. handleUpdateModalVisible(false)}
          // onOk={()=>this.handleNext()}
          footer={null}
        >
          {this.renderContent()}
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default ServiceSet;
