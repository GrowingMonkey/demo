import React, { PureComponent, Fragment,useState } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import router from 'umi/router';
import {
  Row,
  Col,
  Card,
  Form,
  Popconfirm,
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
  Checkbox,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from '../List/TableList.less';

const FormItem = Form.Item;
const { Step } = Steps;
const { TextArea } = Input;
const CheckboxGroup = Checkbox.Group;
const { Option } = Select;
const { RangePicker } = DatePicker;
const RadioGroup = Radio.Group;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const statusMap = ['default', 'processing', 'success', 'error'];
const status = ['关闭', '运行中', '已上线', '异常'];

const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible,counseleelist:{
    list
  } } = props;

  const [current,setList]=useState({
    current:0
  });
  console.log(props);
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };
  const handleChange=(item)=>{
    list&&list.map((v,i)=>{
      if(v.code===item){
        setList({
          current:v.detail,
        });
      }
    })
    // console.log(current);
  }
  return (
    <Modal
      destroyOnClose
      title="师徒系统收益比例设置"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="比例设置">
        {form.getFieldDecorator('desc', {
          rules: [{ required: true, message: '请输入比例', }],
        })(<Input placeholder="该比例为千分比"/>)}
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
        code:props.values.code
      },
      currentStep: 0,
    };

    this.formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 13 },
    };
  }

  handleNext = currentStep => {
    const { form, handleUpdate } = this.props;
    const { formVals: oldValue } = this.state;
    console.log(this.state);
    form.validateFields((err, fieldsValue) => {
        console.log(fieldsValue);
      if (err) return;
      const formVals = { ...oldValue, ...fieldsValue };
      this.setState(
        {
          formVals,
        },
        () => {
            handleUpdate(formVals);       
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

  renderContent = (currentStep, formVals) => {
    const { form, handleUpdate } = this.props;
    const options = [
      { label: '作品删除', value: '1' },
      { label: '账号封禁', value: '2' },
      { label: '作品转载', value: '3' },
    ];
    return (
      <div>
        {/* <label>角色</label> */}
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="比例设置">
        {form.getFieldDecorator('detail', {
          rules: [{ required: true, message: '请输入比例', }],
        })(<Input placeholder="该比例为千分比"/>)}
      </FormItem>
        ,
      </div>
    );
  };

  renderFooter = currentStep => {
    const { handleUpdateModalVisible, values } = this.props;
    return [
      <Button key="forward" type="primary" onClick={() => this.handleNext(currentStep)}>
        提交
      </Button>,
      <Button key="cancel" onClick={() => handleUpdateModalVisible(false, values)}>
        取消
      </Button>,
    ];
  };

  render() {
    const { updateModalVisible, handleUpdateModalVisible, values } = this.props;
    const { currentStep, formVals } = this.state;

    return (
      <Modal
        width={640}
        bodyStyle={{ padding: '32px 40px 48px' }}
        destroyOnClose
        title="修改比例"
        visible={updateModalVisible}
        footer={this.renderFooter(currentStep)}
        onCancel={() => handleUpdateModalVisible(false, values)}
        afterClose={() => handleUpdateModalVisible()}
      >
        {this.renderContent(currentStep, formVals)}
      </Modal>
    );
  }
}

/* eslint react/no-multi-comp:0 */
@connect(({ counseleeset, loading }) => ({
    counseleeset,
  loading: loading.models.counseleeset,
}))
@Form.create()
class UserList extends PureComponent {
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
      title: '等级',
      dataIndex: 'name',
    },
    {
      title: '比例',
      dataIndex: 'detail',
    },
    {
      title: '操作',
      render: (text, record) => {
        return (
          <Fragment>
            <a onClick={() => this.handleUpdateModalVisible(true,record)}>修改</a>
          </Fragment>
        );
      },
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'counseleeset/fetch',
    });
    dispatch({
      type:'counseleeset/convert',
    })
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
      type: 'counseleeset/fetch',
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
      type: 'counseleeset/fetch',
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
          type: 'counseleeset/remove',
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

      const values = {
        ...fieldsValue,
        startDate: fieldsValue.startDate && fieldsValue.startDate[0].format('YYYY-MM-DD'),
        endDate: fieldsValue.startDate && fieldsValue.startDate[1].format('YYYY-MM-DD'),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'counseleeset/fetch',
        payload: values,
      });
    });
  };

  handleModalVisible = (flag,record) => {
    this.setState({
      modalVisible: !!flag,
      formVals:record
    });
  };

  handleUpdateModalVisible = (flag, record) => {
    this.setState({
      updateModalVisible: !!flag,
      stepFormValues: record || {},
    });
  };

  handleUpdateModalVisibleRouter = (flag, record) => {
    const { match } = this.props;
    router.push(`/form/counseleedetail`);
  };

  handleStopStatus = record => {
    const { dispatch, form } = this.props;
    console.log(record);
    dispatch({
      type: 'counseleeset/status',
      payload: record,
    });
  };

  handleDeleteReset = (flag, record) => {
    const { dispatch, form } = this.props;
    console.log(record);
    dispatch({
      type: 'counseleeset/reset',
      payload: {
        userId: record.id,
        type: flag,
      },
    });
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'counseleeset/add',
      payload: {
        desc: fields.desc,
      },
    });

    message.success('添加成功');
    this.handleModalVisible();
  };

  handleUpdate = fields => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    dispatch({
      type: 'counseleeset/update',
      payload: {  
        ...fields
      },
    });

    message.success('配置成功');
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
            <FormItem label="师傅名称">
              {getFieldDecorator('mname')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="师傅手机号">
              {getFieldDecorator('mphone')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="徒弟名称">
              {getFieldDecorator('aname')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="徒弟手机号">
              {getFieldDecorator('aphone')(<Input placeholder="请输入" />)}
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
              <Button style={{ marginLeft: 8 }} type="primary" onClick={this.handleModalVisible}>
              师徒系统收益比例设置
              </Button>
            </span>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          {/* <Col md={6} sm={24}>
            <FormItem label="用户角色">
            {getFieldDecorator('name')(<Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">关闭</Option>
                  <Option value="1">运行中</Option>
                </Select>)}
            </FormItem>
          </Col> */}
        </Row>
      </Form>
    );
  }
  handleSetCounselee=()=>{

  }
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
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
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
      counseleeset: { data,counseleelist },
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
      counseleelist:counseleelist,
    };
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
    };
    return (
      <PageHeaderWrapper title="师徒比例设置">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator} />
            <StandardTable
              selectedRows={selectedRows}
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
      </PageHeaderWrapper>
    );
  }
}

export default UserList;
