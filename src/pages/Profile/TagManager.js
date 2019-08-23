import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import router from 'umi/router';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Dropdown,
  Menu,
  InputNumber,
  DatePicker,
  Modal,
  message,
  Badge,
  Divider,
  Steps,
  Radio,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from '../List/TableList.less';

const FormItem = Form.Item;
const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;
const { RangePicker } = DatePicker;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const statusMap = ['default', 'processing', 'success', 'error'];
const status = ['关闭', '运行中', '已上线', '异常'];

const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };
  return (
    <Modal
      destroyOnClose
      title="新增标签"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="标签名称">
        {form.getFieldDecorator('desc', {
          rules: [{ required: true, message: '请输入至少五个字符的规则描述！', min: 5 }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
    </Modal>
  );
});

@Form.create()
class UpdateForm extends PureComponent {
  static defaultProps = {
    handleUpdate: () => {},
    handleUpdateModalVisible: () => {},
    values: {},
  };

  constructor(props) {
    super(props);

    this.state = {
      formVals: {
        name: props.values.name,
        desc: props.values.desc,
        type:props.values.type,
      },
      currentStep: 0,
    };

    this.formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 13 },
    };
  }

  handleNext = () => {
    const { form, handleUpdate } = this.props;
    const { formVals: oldValue } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const formVals = { ...oldValue, ...fieldsValue };
      this.setState(
        {
          formVals,
        },
        () => {
         handleUpdate(formVals,this.props.values.id);
        }
      );
    });
  };

  backward = () => {
    const { currentStep } = this.state;
    this.setState({
      currentStep: currentStep - 1,
    });
  };

  forward = () => {
    const { currentStep } = this.state;
    this.setState({
      currentStep: currentStep + 1,
    });
  };

  renderContent = (formVals) => {
    // console.log(formVals);
    const { form } = this.props;
    return [
      <FormItem key="name" {...this.formLayout} label="标签名称">
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: '请输入标签名称！' }],
          initialValue: formVals.name,
        })(<Input placeholder="请输入" />)}
      </FormItem>,
      <FormItem key="desc" {...this.formLayout} label="标签说明">
        {form.getFieldDecorator('desc', {
          rules: [{ message: '请输入至少五个字符的标签说明！', min: 5 }],
          initialValue: formVals.desc,
        })(<TextArea rows={4} placeholder="请输入至少五个字符" />)}
      </FormItem>,
      <FormItem key="type" {...this.formLayout} label="标签说明">
      {form.getFieldDecorator('type', {
        initialValue: 0,
      })( <Radio.Group> 
            <Radio value={2}>不允许app查询</Radio>
            <Radio value={0}>允许app查询</Radio>
          </Radio.Group>)}
    </FormItem>,
    ];
  };

  renderFooter = ()=> {
    const { handleUpdateModalVisible, values } = this.props;
    return [
      <Button key="cancel" onClick={() => handleUpdateModalVisible(false, values)}>
          取消
        </Button>,
        <Button key="submit" type="primary" onClick={() => this.handleNext()}>
          完成
        </Button>,
    ];
  };

  render() {
    const { updateModalVisible, handleUpdateModalVisible, values } = this.props;
    const { currentStep, formVals } = this.state;
    console.log(this.state);
    console.log(this.props);

    return (
      <Modal
        width={640}
        bodyStyle={{ padding: '32px 40px 48px' }}
        destroyOnClose
        title="修改标签"
        visible={updateModalVisible}
        footer={this.renderFooter(currentStep)}
        onCancel={() => handleUpdateModalVisible(false, values)}
        afterClose={() => handleUpdateModalVisible(false,values)}
      >
        {this.renderContent(values)}
      </Modal>
    );
  }
}

/* eslint react/no-multi-comp:0 */
@connect(({ tagmanager, loading }) => ({
  tagmanager,
  loading: loading.models.tagmanager,
}))
@Form.create()
class Comments extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
  };

  columns = [
    {
      title: '标签名称',
      dataIndex: 'name',
      render: text => <a onClick={() => this.previewItem(text)}>{text}</a>,
    },
    {
      title: '标签说明',
      dataIndex: 'detail',
    },
    {
      title: '标签下作品数量',
      dataIndex: 'count',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      sorter: true,
      render: val => <span>{moment(parseInt(val)).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.handleJumpPic(record)}>查看</a>
          <Divider type="vertical" />
          <a onClick={() => this.handleUpdateTag(true,record)}>修改</a>
        </Fragment>
      ),
    },
  ];
  handleJumpPic= record => {
    const { match } = this.props;
    router.push(`/dashboard/picturemoderation?tagId=${record.id}`);
  };
  handleUpdateTag= (flag, record) => {
    this.setState({
      updateModalVisible: !!flag,
      stepFormValues: record || {},
    });
  };
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'tagmanager/fetch',
    });
  }

  handleStop(stat, record) {
    const { dispatch } = this.props;
    dispatch({
      type: 'tagmanager/stop',
      payload: {
        oprType: stat,
        id: record.orderId,
      },
    });
  }

  handleScan(record) {
    router.push(`/profile/accountflow?id=${record.id}`);
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
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
      type: 'tagmanager/fetch',
      payload: params,
    });
  };

  previewItem = id => {
    router.push(`/profile/basic/${id}`);
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'tagmanager/fetch',
      payload: {},
    });
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  handleMenuClick = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (selectedRows.length === 0) return;
    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'tagmanager/remove',
          payload: {
            key: selectedRows.map(row => row.key),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      console.log(fieldsValue);
      const values = {
        ...fieldsValue,
        startDate: fieldsValue.startDate && fieldsValue.startDate[0].format('YYYY-MM-DD'),
        endDate: fieldsValue.startDate && fieldsValue.startDate[1].format('YYYY-MM-DD'),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'tagmanager/fetch',
        payload: values,
      });
    });
  };
  //新增标签
  handleModalVisible = flag => {
    // router.push(`/profile/addtag`);
  };
  handleAddTag(){
    router.push(`/profile/addtag`);
  }
  handleDelete = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'tagmanager/remove',
      payload: record,
    });
  };

  handleCancle = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'tagmanager/cancle',
      payload: record,
    });
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'tagmanager/add',
      payload: {
        desc: fields.desc,
      },
    });

    message.success('添加成功');
    this.handleModalVisible();
  };

  onChangeDate() {}

  handleUpdate = (fields ,id)=> {
    const { dispatch } = this.props;
    const { formValues,stepFormValues } = this.state;
    console.log(this.state);
    console.log(fields);
    dispatch({
      type: 'tagmanager/update',
      payload: {
        name:fields.name,
        id:id,
        type:fields.type,
        detail:fields.desc,
      },
    });

    message.success('修改成功');
    this.handleUpdateModalVisible();
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="标签名称">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="创建日期">
              {getFieldDecorator('startDate')(
                <RangePicker
                  style={{ width: '100%' }}
                  format="YYYY-MM-DD"
                  placeholder={[
                    formatMessage({ id: 'form.date.placeholder.start' }),
                    formatMessage({ id: 'form.date.placeholder.end' }),
                  ]}
                />
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
              <Button type="primary" style={{ marginLeft: 8 }} onClick={this.handleAddTag} >
                新增
              </Button>
              {/* <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                展开 <Icon type="down" />
              </a> */}
            </span>
          </Col>
        </Row>
      </Form>
    );
  }
  handleUpdateModalVisible = (flag, record) => {
    this.setState({
      updateModalVisible: !!flag,
      stepFormValues: record || {},
    });
  };
  renderAdvancedForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="规则名称">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="使用状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">关闭</Option>
                  <Option value="1">运行中</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="调用次数">
              {getFieldDecorator('number')(<InputNumber style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="更新日期">
              {getFieldDecorator('date')(
                <DatePicker style={{ width: '100%' }} placeholder="请输入更新日期" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="使用状态">
              {getFieldDecorator('status3')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">关闭</Option>
                  <Option value="1">运行中</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="使用状态">
              {getFieldDecorator('status4')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">关闭</Option>
                  <Option value="1">运行中</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              收起 <Icon type="up" />
            </a>
          </div>
        </div>
      </Form>
    );
  }

  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  render() {
    console.log(this.props);
    const {
      tagmanager: { data },
      loading,
    } = this.props;
    const { selectedRows, modalVisible, updateModalVisible, stepFormValues } = this.state;
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="approval">批量审批</Menu.Item>
      </Menu>
    );

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
    };
    return (
      <PageHeaderWrapper title="标签列表">
        <div>
          <Card bordered={false}>
            <div className={styles.tableList}>
              <div className={styles.tableListForm}>{this.renderForm()}</div>
              <StandardTable
                // selectedRows={selectedRows}
                loading={loading}
                data={data}
                columns={this.columns}
                onSelectRow={this.handleSelectRows}
                onChange={this.handleStandardTableChange}
              />
            </div>
          </Card>
          <CreateForm {...parentMethods} modalVisible={modalVisible} />
          {stepFormValues && Object.keys(stepFormValues).length ? (
            <UpdateForm
              {...updateMethods}
              updateModalVisible={updateModalVisible}
              values={stepFormValues}
            />
          ) : null}
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default Comments;
