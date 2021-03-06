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
import { isForStatement } from '@babel/types';
import { func } from 'prop-types';

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
  const { modalVisible, form, handleAdd, handleModalVisible ,sysDefaultPower,powerType} = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      let params={
        ...fieldsValue,
      }
      if(powerType==1){
        params.id=sysDefaultPower.id;
      }
      handleAdd(params);
    });
  };
  console.log(props);
  return (
    <Modal
      destroyOnClose
      title="发布设置"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <div>
        {/* <label>角色</label> */}
        <FormItem
          // labelCol={{ span: 5 }}
          label="文章"
          style={{display:'flex'}}
          // wrapperCol={{ span: 10, offset: 0 }}
          key="powerSend"
        >
          {form.getFieldDecorator('pubArticle', {
            rules: [{ required: true, message: '请设置用户权限' }],
            initialValue:parseInt(sysDefaultPower.pubArticle)
          })(<Radio.Group>
            <Radio value={0} key="0">否</Radio>
            <Radio value={1} key="1">是</Radio>
            {powerType!=1?<Radio value={2} key="2">默认</Radio>:''}
          </Radio.Group>)}
        </FormItem>
        <FormItem
          // labelCol={{ span: 5 }}
          style={{display:'flex'}}
          label="图片"
          // wrapperCol={{ span: 10, offset: 0 }}
          key="pubPic"
        >
          {form.getFieldDecorator('pubPic', {
            rules: [{ required: true, message: '请设置用户权限' }],
            initialValue:parseInt(sysDefaultPower.pubPic)
          })(<Radio.Group>
            <Radio value={0} key="0">否</Radio>
            <Radio value={1} key="1">是</Radio>

            {powerType!=1?<Radio value={2} key="2">默认</Radio>:''}
          </Radio.Group>)}
        </FormItem>
        <FormItem
          // labelCol={{ span: 5 }}
          style={{display:'flex'}}
          label="段子"
          // wrapperCol={{ span: 10, offset: 0 }}
          key="pubStalk"
        >
          {form.getFieldDecorator('pubStalk', {
            rules: [{ required: true, message: '请设置用户权限' }],
            initialValue:parseInt(sysDefaultPower.pubStalk)
          })(<Radio.Group>
            <Radio value={0} key="0">否</Radio>
            <Radio value={1} key="1">是</Radio>
            {powerType!=1?<Radio value={2} key="2">默认</Radio>:''}
          </Radio.Group>)}
        </FormItem>
        <FormItem
          // labelCol={{ span: 5 }}
          style={{display:'flex'}}
          label="视频"
          // wrapperCol={{ span: 10, offset: 0 }}
          key="pubVideo"
        >
          {form.getFieldDecorator('pubVideo', {
            rules: [{ required: true, message: '请设置用户权限' }],
            initialValue:parseInt(sysDefaultPower.pubVideo)
          })(<Radio.Group>
            <Radio value={0} key="0">否</Radio>
            <Radio value={1} key="1">是</Radio>
            {powerType!=1?<Radio value={2} key="2">默认</Radio>:''}
          </Radio.Group>)}
        </FormItem>
      </div>
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
        userId: props.values.id,
        desc: props.values.desc,
        key: props.values.key,
        target: '0',
        template: '0',
        type: '1',
        time: '',
        frequency: 'month',
      },
      currentStep: 0,
    };

    this.formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 13 },
    };
  }

  handleNext = currentStep => {
    const { form, handleUpdate ,authData} = this.props;
    const { formVals: oldValue } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const formVals = { ...oldValue, ...fieldsValue };
      console.log(formVals);
      this.setState(
        {
          formVals,
        },
        () => {
            if(authData&&authData.userId!=0){
              let params={
                id:authData.id,
                point:formVals.powerShare&&formVals.powerShare[0]=='0'?1:0,
                shareLink:formVals.powerShare&&formVals.powerShare[0]!='0'?formVals.powerShare.join(','):(function(){
                  let newShare=formVals.powerShare||[];
                  newShare.length!=0&&newShare.shift();
                  return newShare.join(',');
                })(),
                pubPic:formVals.pubPic,
                pubArticle:formVals.pubArticle,
                pubVideo:formVals.pubVideo,
                pubStalk:formVals.pubStalk
              }
              handleUpdate(params);
            }else{
              let params={
                userId:formVals.userId,
                point:formVals.powerShare&&formVals.powerShare[0]=='0'?1:0,
                pubPic:formVals.pubPic,
                pubArticle:formVals.pubArticle,
                pubVideo:formVals.pubVideo,
                pubStalk:formVals.pubStalk
              }
              handleUpdate(params);
            }
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
    const { form, handleUpdate, authData} = this.props;
    console.log(this.props);
    let checkNum=[];
    if(authData.point==1){
      checkNum.push('0');
    }
    console.log(authData);
    if(authData.shareLink){
      let listshare=authData.shareLink.split(",");
      listshare.map((v,i)=>checkNum.push(v));
    }
    const options = [
      { label: '是否显示积分', value:'0'},
      { label: '复制', value:'1'},
      { label: 'qq分享', value:'2'},
      { label: '微信分享', value:'3'},
    ];
    return (
      <div>
        {/* <label>角色</label> */}
        <h3>分享权限</h3>
        <FormItem
          key="powerNames"
        >
          {form.getFieldDecorator('powerShare', {
            initialValue:checkNum
          })(<CheckboxGroup options={options} />)}
        </FormItem>
        <h3>发布权限</h3>
        <FormItem
          // labelCol={{ span: 5 }}
          label="文章"
          style={{display:'flex'}}
          // wrapperCol={{ span: 10, offset: 0 }}
          key="powerSend"
        >
          {form.getFieldDecorator('pubArticle', {
            rules: [{ required: true, message: '请设置用户权限' }],
            initialValue:parseInt(authData.pubArticle)
          })(<Radio.Group>
            <Radio value={0} key="0">否</Radio>
            <Radio value={1} key="1">是</Radio>
            <Radio value={2} key="2">默认</Radio>
          </Radio.Group>)}
        </FormItem>
        <FormItem
          // labelCol={{ span: 5 }}
          style={{display:'flex'}}
          label="图片"
          // wrapperCol={{ span: 10, offset: 0 }}
          key="pubPic"
        >
          {form.getFieldDecorator('pubPic', {
            rules: [{ required: true, message: '请设置用户权限' }],
            initialValue:parseInt(authData.pubPic)
          })(<Radio.Group>
            <Radio value={0} key="0">否</Radio>
            <Radio value={1} key="1">是</Radio>
            <Radio value={2} key="2">默认</Radio>
          </Radio.Group>)}
        </FormItem>
        <FormItem
          // labelCol={{ span: 5 }}
          style={{display:'flex'}}
          label="段子"
          // wrapperCol={{ span: 10, offset: 0 }}
          key="pubStalk"
        >
          {form.getFieldDecorator('pubStalk', {
            rules: [{ required: true, message: '请设置用户权限' }],
            initialValue:parseInt(authData.pubStalk)
          })(<Radio.Group>
            <Radio value={0} key="0">否</Radio>
            <Radio value={1} key="1">是</Radio>
            <Radio value={2} key="2">默认</Radio>
          </Radio.Group>)}
        </FormItem>
        <FormItem
          // labelCol={{ span: 5 }}
          style={{display:'flex'}}
          label="视频"
          // wrapperCol={{ span: 10, offset: 0 }}
          key="pubVideo"
        >
          {form.getFieldDecorator('pubVideo', {
            rules: [{ required: true, message: '请设置用户权限' }],
            initialValue:parseInt(authData.pubVideo)
          })(<Radio.Group>
            <Radio value={0} key="0">否</Radio>
            <Radio value={1} key="1">是</Radio>
            <Radio value={2} key="2">默认</Radio>
          </Radio.Group>)}
        </FormItem>
      </div>
    );
  };

  renderFooter = currentStep => {
    const { handleUpdateModalVisible, values } = this.props;
    if (currentStep === 1) {
      return [
        <Button key="back" style={{ float: 'left' }} onClick={this.backward}>
          上一步
        </Button>,
        <Button key="cancel" onClick={() => handleUpdateModalVisible(false, values)}>
          取消
        </Button>,
        <Button key="forward" type="primary" onClick={() => this.handleNext(currentStep)}>
          下一步
        </Button>,
      ];
    }
    if (currentStep === 2) {
      return [
        <Button key="back" style={{ float: 'left' }} onClick={this.backward}>
          上一步
        </Button>,
        <Button key="cancel" onClick={() => handleUpdateModalVisible(false, values)}>
          取消
        </Button>,
        <Button key="submit" type="primary" onClick={() => this.handleNext(currentStep)}>
          完成
        </Button>,
      ];
    }
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
        width={480}
        bodyStyle={{ padding: '32px 40px 48px' }}
        destroyOnClose
        title="权限设置"
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
@connect(({ userlist, loading }) => ({
  userlist,
  loading: loading.models.userlist,
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
    authData:{},
    sysDefaultPower:{},
    powerType:1
  };

  columns = [
    {
      title: '用户名',
      dataIndex: 'name',
    },
    {
      title: '手机号',
      dataIndex: 'phone',
    },
    {
      title: '注册时间',
      dataIndex: 'createTime',
      render: val => <span>{moment(parseInt(val)).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '图片',
      dataIndex: 'picCount',
    },
    {
      title: '视频',
      dataIndex: 'videoCount',
    },
    {
      title: '文章',
      dataIndex: 'artCount',
    },
    {
      title: '评论',
      dataIndex: 'commentCount',
    },
    {
      title: '总数',
      dataIndex: 'total',
    },
    {
      title: '收藏',
      dataIndex: 'collectCount',
    },
    {
      title: '获赞',
      dataIndex: 'likeCount',
    },
    {
      title: '操作',
      render: (text, record) => {
        const textStr = record.stat == 0 ? '停用' : '启用';
        const textMsg=`你确认重${textStr}置这个账号吗？`;
        return (
          <Fragment>
            <a onClick={() => this.handleUpdateModalVisibleRouter(true, record)}>查看</a>
            <Divider type="vertical" />
            <a onClick={() => this.handleUpdateModalVisible(true, record)}>权限</a>
            <Divider type="vertical" />
            {/* <a onClick={() => this.handleStopStatus(record)}>{textStr}</a> */}
            <Popconfirm
            title={textMsg}
            onConfirm={() => this.handleStopStatus(record)}
            okText="确认"
            cancelText="取消"
            >
            <a href="#">{textStr}</a>
          </Popconfirm>
            <Divider type="vertical" />
            <Popconfirm
            title="你确认重置这个账号吗？"
            onConfirm={() => this.handleDeleteReset(0, record)}
            okText="确认"
            cancelText="取消"
            >
            <a href="#">重置</a>
          </Popconfirm>
            <Divider type="vertical" />
            <Popconfirm
            title="你确认注销这个账号吗？"
            onConfirm={() => this.handleDeleteReset(1, record)}
            okText="确认"
            cancelText="取消"
            >
            <a href="#">注销</a>
          </Popconfirm>
          <Divider type="vertical" />
          <a onClick={() => this.handleJumpDetail(record)}>积分明细</a>
          </Fragment>
        );
      },
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'userlist/fetch',
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
      type: 'userlist/fetch',
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
      type: 'userlist/fetch',
      payload: {},
    });
  };
  handleSysSetTwo=()=>{
    let params={
        id:0
      }
    this.getInitDataPower(params,2);
  }
  handleSysSet=()=>{
    let params={
      id:0
    };
    this.getInitDataPower(params,1);
  }
  getInitDataPower=(val,type)=>{
    const {dispatch}=this.props;
        dispatch({
      type:'userlist/fetchauth',
      payload:{
        ...val
      },
      callback: (response) => {
        console.log(response);
        if(response&&response.code==0){
            this.setState({
              sysDefaultPower: response.data,
              powerType:type
            });
        }
      },
    });
    this.handleModalVisible(true);
  }
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
          type: 'userlist/remove',
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
        type: 'userlist/fetch',
        payload: values,
      });
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleUpdateModalVisible = (flag, record) => {
    const {dispatch}=this.props;
    if(record&&record.id){
      console.log('系统设置');
      dispatch({
      type:'userlist/fetchauth',
      payload:{
        id:record.id
      },
      callback: (response) => {
        console.log(response);
        if(response&&response.code==0){
            this.setState({
              authData: response.data,
            });
        }
      },
      })
    }
    console.log(flag);
    this.setState({
      updateModalVisible: !!flag,
      stepFormValues: record || {},
    });
  };
  handleJumpDetail=(record)=>{
    const {match}=this.props;
    router.push(`/form/gradeinfo?id=${record.id}`)
  }
  handleUpdateModalVisibleRouter = (flag, record) => {
    const { match } = this.props;
    router.push(`/form/scandetail/${record.id}`);
  };

  handleStopStatus = record => {
    const { dispatch, form } = this.props;
    console.log(record);
    dispatch({
      type: 'userlist/status',
      payload: record,
    });
  };

  handleDeleteReset = (flag, record) => {
    const { dispatch, form } = this.props;
    console.log(record);
    dispatch({
      type: 'userlist/reset',
      payload: {
        userId: record.id,
        type: flag,
      },
    });
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'userlist/updatepowerall',
      payload: {
        ...fields
      },
    });

    message.success('添加成功');
    this.handleModalVisible();
  };

    handleUpdate = fields => {
    console.log(fields);
    const { dispatch } = this.props;
    const { formValues } = this.state;
    dispatch({
      type: 'userlist/updatepower',
      payload: {
        ...fields
      },
      callback:(response)=>{
        if(response&&response.code==0){
          message.success('修改成功');
          this.handleUpdateModalVisible();
        }else{
          message.error(response.message);
        }
      }
    });
    };

    renderSimpleForm() {
      const {
        form: { getFieldDecorator },
      } = this.props;
      return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="用户名">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="手机号">
              {getFieldDecorator('phone')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="注册时间">
              {getFieldDecorator('startDate')(
                <RangePicker
                  style={{ width: '100%' }}
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
      userlist: { data },
      loading,
    } = this.props;
    const { selectedRows, modalVisible, updateModalVisible, stepFormValues,authData,sysDefaultPower,powerType } = this.state;
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="approval">批量审批</Menu.Item>
      </Menu>
    );

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      sysDefaultPower:sysDefaultPower,
      powerType:powerType
    };
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
    };
    return (
      <PageHeaderWrapper title="用户列表">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <Button style={{ marginLeft: 8 }} onClick={this.handleSysSet} type="primary">
                设置系统权限
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleSysSetTwo} type="primary">
                设置所有用户权限
            </Button>
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
            authData={authData}
          />
        ) : null}
      </PageHeaderWrapper>
    );
  }
}

export default UserList;
