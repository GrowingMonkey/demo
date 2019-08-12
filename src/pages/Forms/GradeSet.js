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
  const { modalVisible, form, handleAdd,handleUpdate, handleModalVisible ,formVals,modelsType} = props;
  const formValscurrent=formVals?formVals:'';
  const okHandle = () => {
    console.log(modelsType);
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      console.log(fieldsValue);
      const fieldsNewValue={
        ...fieldsValue,
        id:formVals.id,
        modelsType:modelsType,
      }
      if(modelsType==2){
        handleUpdate(fieldsNewValue);
      }else{
        handleAdd(fieldsNewValue);
      }
    });
  };
  console.log(formVals);
  return (
    <Modal
      destroyOnClose
      title={modelsType==2?"修改等级权限":'新增等级权限'}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    > 
      <FormItem labelCol={{ span: 10 }} wrapperCol={{ span: 10 }} label="等级" style={{display:modelsType==2?'none':'block'}}>
      {form.getFieldDecorator('level', {
          rules: [{ required: modelsType==2?false:true}],
        })(<Input placeholder="请输入等级" />)}
      </FormItem>
      <FormItem labelCol={{ span: 10 }} wrapperCol={{ span: 10 }} label="是否可以发布图片">
        {form.getFieldDecorator('pic', {
          rules: [{ required: true}],
          initialValue:formVals?formVals.pic:''
        })(<Select placeholder="请选择" style={{width:"100%"}}>
        <Option value="0">是</Option>
        <Option value="1">否</Option>
      </Select>)}
      </FormItem>
      <FormItem labelCol={{ span:10 }} wrapperCol={{ span: 10 }} label="是否可以发布图文">
        {form.getFieldDecorator('article', {
          rules: [{ required: true}],
          initialValue:formVals?formVals.article:''
        })(<Select placeholder="请选择" style={{width:"100%"}}>
        <Option value="0">是</Option>
        <Option value="1">否</Option>
      </Select>)}
      </FormItem>
      <FormItem labelCol={{ span: 10 }} wrapperCol={{ span: 10 }} label="是否可以发布视频">
        {form.getFieldDecorator('video', {
          rules: [{ required: true}],
          initialValue:formVals?formVals.video:''
        })(<Select placeholder="请选择" style={{width:"100%"}}>
        <Option value="0">是</Option>
        <Option value="1">否</Option>
      </Select>)}
      </FormItem>
      <FormItem labelCol={{ span: 10 }} wrapperCol={{ span: 10}} label="是否可以发布段子">
        {form.getFieldDecorator('stalk', {
          rules: [{ required: true}],
          initialValue:formVals?formVals.stalk:''
        })(<Select placeholder="请选择" style={{width:"100%"}}>
        <Option value="0">是</Option>
        <Option value="1">否</Option>
      </Select>)}
        </FormItem>
        <FormItem labelCol={{ span: 10 }} wrapperCol={{ span: 10 }} label="用户可以拍摄时长">
        {form.getFieldDecorator('videoTimes', {
          rules: [{ required: true}],
          initialValue:formVals?formVals.videoTimes:''
        })(<Input placeholder="请输入秒数" />)}
      </FormItem>
      <FormItem labelCol={{ span: 10 }} wrapperCol={{ span: 10}} label="用户可以上传时长">
        {form.getFieldDecorator('uploadTimes', {
          rules: [{ required: true}],
          initialValue:formVals?formVals.uploadTimes:''
        })(<Input placeholder="请输入秒数" />)}
      </FormItem>
    </Modal>
  );
});
/* eslint react/no-multi-comp:0 */
@connect(({ gradeset, loading }) => ({
  gradeset,
  loading: loading.models.gradeset,
}))
@Form.create()
class Comments extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    modelsType:1,
    stepFormValues: {},
  };

  columns = [
    {
      title: '等级',
      dataIndex: 'level',
    },
    {
      title: '图片',
      dataIndex: 'pic',
      render:(val)=><span>{val==0?'是':'否'}</span>
    },
    {
      title: '视频',
      dataIndex: 'video',
      render:(val)=><span>{val==0?'是':'否'}</span>
      // mark to display a total number
    },
    {
      title: '文章',
      dataIndex: 'article',
      render:(val)=><span>{val==0?'是':'否'}</span>
    },
    {
      title: '段子',
      dataIndex: 'stalk',
      render:(val)=><span>{val==0?'是':'否'}</span>
    },
    {
        title: '视频拍摄时长',
        dataIndex: 'videoTimes',
      },
      {
        title: '可上传视频长度',
        dataIndex: 'uploadTimes',
        render:val=>`${val}(秒)`
      },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.handleModalVisible(true,record,2)}>修改</a>
        </Fragment>
      ),
    },
  ];
  handleChangeStat(stat,record){
    const { dispatch } = this.props;
    dispatch({
      type: 'gradeset/stat',
      payload: {
        id:record.id,
        stat:stat,
      }
    });
  }
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'gradeset/fetch',
    });
  }

  handleStop(stat, record) {
    const { dispatch } = this.props;
    dispatch({
      type: 'gradeset/stop',
      payload: {
        oprType: stat,
        id: record.orderId,
      },
    });
  }

  handleScan(record) {
    router.push(`/profile/activitysend?id=${record.id}`);
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
      type: 'gradeset/fetch',
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
      type: 'gradeset/fetch',
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
          type: 'gradeset/remove',
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
        type: 'gradeset/fetch',
        payload: values,
      });
    });
  };

  handleModalVisible = (flag ,record,modelsType)=> {
    this.setState({
      modalVisible: !!flag,
      formVals:record,
      modelsType:modelsType
    });
  };

  // 查看详情
  handleUpdateModalVisible = (flag) => {
    console.log(flag);
    this.setState({
      updateModalVisible: !!flag,
    });
  };

  handleDelete = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'gradeset/remove',
      payload: record,
    });
  };

  handleCancle = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'gradeset/cancle',
      payload: record,
    });
  };

  handleUpdate = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'gradeset/update',
      payload: {
       ...fields
      },
    });

    message.success('添加成功');
    this.handleModalVisible();
  };

  onChangeDate() {}

  handleAdd = fields => {
    console.log(fields);
    const { dispatch } = this.props;
    const { formValues } = this.state;
    dispatch({
      type: 'gradeset/add',
      payload: {
        ...fields
      },
    });

    message.success('添加成功');
    this.handleModalVisible();
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
      gradeset: { data },
      loading,
    } = this.props;
    const { selectedRows, modalVisible, updateModalVisible, stepFormValues,formVals ,modelsType} = this.state;
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="approval">批量审批</Menu.Item>
      </Menu>
    );

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleUpdate:this.handleUpdate,
      handleModalVisible: this.handleModalVisible,
      formVals:formVals,
      modelsType:modelsType
    };
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
    };
    return (
      <PageHeaderWrapper title="等级权限">
        <div>
          <Card bordered={false}>
            <div className={styles.tableList}>
              <div className={styles.tableListForm}>
                <div layout="inline" >
                    <span className={styles.submitButtons}>
                    <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true,'',1)}>
                      新建
                    </Button>
                    </span>
              </div>
            </div>
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
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default Comments;
