import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
const {CDN_ADDRESS}=process.env;
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
  // Badge,
  Divider,
  Steps,
  Radio,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from '../List/TableList.less';
import Center from '../Forms/ScanDetail/Article';

const FormItem = Form.Item;
const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
// const statusMap = ['default', 'processing', 'success', 'error'];
// const status = ['关闭', '运行中', '已上线', '异常'];

const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible,data,step ,deptoption,handleDept} = props;
  const {list}=deptoption;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };
  const handleChangeDept=(value)=>{
    handleDept(value);
  };
  console.log(props);
  // let arrays=[];
  // data&&data.list.map((item,index) => {
  //   arrays.push(item.name);
  // })
  return (
    <Modal
      destroyOnClose
      title="新建员工"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="名称">
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: '请输入至少五个字符的规则描述！', min: 5 }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="手机">
        {form.getFieldDecorator('phone', {
          rules: [{ required: true, message: '请输入至少五个字符的规则描述！', min: 5 }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="部门">
        {form.getFieldDecorator('deptId', {
          rules: [{ required: true, message: '请选择选项' }],
        })(<Select placeholder="请选择" style={{ width: '100%' }} onChange={handleChangeDept}>
          {
             list&&list.map((item,index) => <Option value={item.id} key={index}>{item.name}</Option>)
          }
      </Select>)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="岗位">
        {form.getFieldDecorator('jobId', {
          rules: [{ required: true, message: '请选择选项' }],
        })(<Select placeholder="请选择" style={{ width: '100%' }}>
          {
             data.list&&data.list.map((item,index) => <Option value={item.id} key={index}>{item.name}</Option>)
          }
      </Select>)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="邮箱">
        {form.getFieldDecorator('mail', {
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
        key: props.values.key,
        target: '0',
        template: '0',
        type: '1',
        time: '',
        frequency: 'month',
      },
      currentStep: 1,
    };

    this.formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 13 },
    };
  }

  handleNext = currentStep => {
    const { form, handleUpdate,values:{id} } = this.props;
    const { formVals: oldValue } = this.state;
    console.log(this.props);
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const formVals = { ...oldValue, ...fieldsValue ,id};
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
  handleUpdateDept=(id)=>{
    const {handleDept}=this.props;
    console.log(id);
    handleDept(id);
  }
  renderContent = (currentStep, formVals,value,jobOptions,branchOption) => {
    const { form } = this.props;
    console.log(branchOption);
    console.log(this.props);
    const tagStyle={
      borderRadius:5,
      display:'inline-block',
      marginRight:24,
      lineHeight:'22px',
      border:'1px solid rgb(16, 16, 16)',
      textAlign:'center',
      padding:'0 10px',
    }
    if (currentStep === 1) {
      return [
        <div key='header' {...this.formLayout} style={{display:'flex',alignItems:'center',flexDirection:'column'}}>
          <img  style={{borderRadius:'50%',overflow:'hidden',background:'#ddd',width:50,height:50}} src={`${CDN_ADDRESS?CDN_ADDRESS:'https://f-bd.imuguang.com'}/${value.headUrl}`}/>
          <h4>{value.name}</h4>
        </div>,
        <div key="detail">
          <div className={styles.detail}>
              <p><i />{value.phone}</p>
              <p><i />{value.mail}</p>
              <p><i />{moment(parseInt(value.createTime)).format('YYYY-MM-DD HH:mm:ss')}</p>
          </div>
        </div>,
         <Divider dashed key="line-one"/>,
         <div key="deptName">
          <div className={styles.detail}>
              <p><i />{value.deptName}</p>
              <p><i />{value.jobName}</p>
          </div>
        </div>,
         <Divider dashed key="line-two"/>,
         <div key="tag">
          <div className={styles.detail}>
              <p><i /><b>操作权限</b></p>
              <p><i />{<span style={tagStyle}>sss</span>}</p>
          </div>
        </div>,
      ];
    }
    if (currentStep === 2) {
      return [
        <FormItem key="name" {...this.formLayout} label="姓名">
          {form.getFieldDecorator('name', {
            initialValue: value.name,
            rules: [{ required: true, message: '请输入至少2个字',min:2 }],
          })(<Input placeholder="请输入" />)}
        </FormItem>,
        <FormItem key="phone" {...this.formLayout} label="手机号">
          {form.getFieldDecorator('phone', {
            initialValue: value.phone,
            rules: [{ required: true, message: '请输入手机号' }],
          })(<Input placeholder="请输入" />)}
        </FormItem>,
        <FormItem key="mail" {...this.formLayout} label="邮箱">
          {form.getFieldDecorator('mail', {
            initialValue: value.mail,
           rules: [{ required: true, message: '请输入邮箱' }],
          })(<Input placeholder="请输入" />)}
        </FormItem>,
        <FormItem key="deptId" {...this.formLayout} label="部门">
          {form.getFieldDecorator('deptId', {
            initialValue: value.jobId,
          })(
            <Select style={{ width: '100%' }} onChange={this.handleUpdateDept.bind(this)}>
              { 
                jobOptions&&jobOptions.list.map((v,i)=><Option value={v.id} key={i}>{v.name}</Option>)
              }
            </Select>
          )}
        </FormItem>,
        <FormItem key="jobId" {...this.formLayout} label="岗位">
        {form.getFieldDecorator('jobId', {
          initialValue: value.jobId,
        })(
          <Select style={{ width: '100%' }}>
            { 
              branchOption.list&&branchOption.list.map((v,i)=><Option value={v.id} key={i}>{v.name}</Option>)
            }
          </Select>
        )}
      </FormItem>,
      ];
    }
  };

  renderFooter = currentStep => {
    const { handleUpdateModalVisible, values } = this.props;
    if (currentStep === 1) {
      return null;
    }
    if (currentStep === 2) {
      return [
        <Button key="submit" type="primary" onClick={() => this.handleNext(currentStep)}>
          提交
        </Button>,
        <Button key="cancel" onClick={() => handleUpdateModalVisible(false, values)}>
          取消
        </Button>,
      ];
    }
  };

  render() {
    const { updateModalVisible, handleUpdateModalVisible, values ,step,jobOptions,branchOption} = this.props;
    const { currentStep, formVals } = this.state;
    console.log(this.props)

    return (
      <Modal
        width={420}
        bodyStyle={{ padding: '32px 40px 48px' }}
        destroyOnClose
        title={step==1?null:'修改资料'}
        visible={updateModalVisible}
        footer={this.renderFooter(step)}
        onCancel={() => handleUpdateModalVisible(false, values)}
        afterClose={() => handleUpdateModalVisible()}
      >
        {this.renderContent(step, formVals,values,jobOptions,branchOption)}
      </Modal>
    );
  }
}

/* eslint react/no-multi-comp:0 */
@connect(({ usermanage, loading }) => ({
  usermanage,
  loading: loading.models.usermanage,
}))
@Form.create()
class Articles extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
    step:1
  };

  columns = [
    {
      title: '手机号',
      dataIndex: 'phone',
    },
    {
      title: '姓名',
      dataIndex: 'name',
    },
    {
      title: '部门',
      dataIndex: 'deptName',
    },
    {
      title: '岗位',
      dataIndex: 'jobName',
    },
    {
      title: '注册时间',
      dataIndex: 'createTime',
      sorter: true,
      render: val => <span>{moment(parseInt(val,10)).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '邮箱',
      dataIndex: 'mail',
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.handleUpdateModalVisible(1,true, record)}>查看</a>
          <Divider type="vertical" />
          <a onClick={() => this.handleUpdateModalVisible(2,true, record)}>修改</a>
          <Divider type="vertical" />
          <a href="">停用</a>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'usermanage/fetch',
    });
    //岗位列表
    // dispatch({
    //   type: 'usermanage/stationrulefetch',
    // });
    //部门列表
    dispatch({
      type: 'usermanage/fetchdept',
    });
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
      type: 'usermanage/fetch',
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
      type: 'usermanage/fetch',
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
          type: 'usermanage/remove',
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
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'usermanage/fetch',
        payload: values,
      });
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleUpdateModalVisible = (step,flag, record) => {
    this.setState({
      updateModalVisible: !!flag,
      stepFormValues: record || {},
      step:step,
    });
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    console.log(fields);
    dispatch({
      type: 'usermanage/add',
      payload: fields
    });

    message.success('添加成功');
    this.handleModalVisible();
  };

  handleUpdate = fields => {
    console.log(fields);
    const { dispatch } = this.props;
    const { formValues } = this.state;
    dispatch({
      type: 'usermanage/update',
      payload: {
        id:fields.id,
        name:fields.name,
        phone:fields.phone,
        mail:fields.mail,
        jobId:fields.jobId,
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
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                展开 <Icon type="down" />
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
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
  handleDept=(id)=>{
    const {dispatch}=this.props;
    dispatch({
      type:'usermanage/stationrulefetch',
      payload:{
        deptId:id,
      }
    })
  }
  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  render() {
    console.log(this.props);
    const {
      usermanage: { data ,datass,deptoption},
      loading,
    } = this.props;
    const { selectedRows, modalVisible, updateModalVisible, stepFormValues,step } = this.state;
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="approval">批量审批</Menu.Item>
      </Menu>
    );

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      deptoption:deptoption,
      handleDept:this.handleDept
    };
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
      handleDept:this.handleDept
    };
    return (
      <PageHeaderWrapper title="人员管理">
        <Card bordered={false}>
          <div className={styles.tableList}>
            {/* <div className={styles.tableListForm}>{this.renderForm()}</div> */}
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                新建
              </Button>
              {selectedRows.length > 0 && (
                <span>
                  <Button>批量操作</Button>
                  <Dropdown overlay={menu}>
                    <Button>
                      更多操作 <Icon type="down" />
                    </Button>
                  </Dropdown>
                </span>
              )}
            </div>
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
        <CreateForm {...parentMethods} modalVisible={modalVisible} data={datass}/>
        {stepFormValues && Object.keys(stepFormValues).length ? (
          <UpdateForm
            {...updateMethods}
            updateModalVisible={updateModalVisible}
            values={stepFormValues}
            step={step}
            jobOptions={deptoption}
            branchOption={datass}
            // id={id}
          />
        ) : null}
      </PageHeaderWrapper>
    );
  }
}

export default Articles;
