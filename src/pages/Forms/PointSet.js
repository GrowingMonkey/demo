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
  const { modalVisible, form, handleAdd, handleModalVisible,formValues } = props;
  const okHandle = () => {
    console.log(props);
    form.validateFields((err, fieldsValue) => {
      console.log(fieldsValue);
      if (err) return;
      form.resetFields();
      let fieldsNewValue={
        ...fieldsValue,
        key:formValues.key
      }
      handleAdd(fieldsNewValue);
    });
  };
  return (
    <Modal
      destroyOnClose
      title="修改积分"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    > 
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="积分">
        {form.getFieldDecorator('value', {
          rules: [{ required: true, message: '请输入积分', min: 1 }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="次数">
        {form.getFieldDecorator('limit', {
          rules: [{ required: true, message: '请输入次数', min: 1 }],
        })(<Input placeholder="请输入次数,无限输入-1" />)}
      </FormItem>
    </Modal>
  );
});

const CreateFormTwo = Form.create()(props => {
  const { updateModalVisible, form, handleAdd,handleAddl, handleUpdateModalVisible,formValues,value } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      console.log(fieldsValue);
      if (err) return;
      form.resetFields();
      let fieldsNewValue={
        code:value.code,
        ...fieldsValue,
      }
      console.log(fieldsNewValue);
      handleAddl(fieldsNewValue);
    });
  };
  return (
    <Modal
      destroyOnClose
      title="积分比例设置"
      visible={updateModalVisible}
      onOk={okHandle}
      onCancel={() => handleUpdateModalVisible()}
    > 
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label={value.name}>
        {form.getFieldDecorator('detail', {
          rules: [{ required: true, message: '请输入积分比例', min: 1 }],
          initialValue:value.detail
        })(<Input placeholder="请输入" />)}
      </FormItem>
    </Modal>
  );
});

/* eslint react/no-multi-comp:0 */
@connect(({ pointset, loading }) => ({
    pointset,
  loading: loading.models.pointset,
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
      title: '每日获取',
      dataIndex: 'name',
    },
    {
      title: '最大次数',
      dataIndex: 'limit',
      render:(val)=>{
        if(parseInt(val)==-1){
          return '无限次';
        }else{
          return val;
        }
      }
    },
    {
      title: '单次积分',
      dataIndex: 'value',
      // mark to display a total number
    },
    {
      title: '最大积分',
      render:  (text, record) =>{
        if(parseInt(record.limit)==-1){
          return '无限';
        }else{
          return record.limit*record.value;
        }
      }
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.handleModalVisible(true,record)}>修改</a>
        </Fragment>
      ),
    },
  ];
  handleChangeStat(stat,record){
    const { dispatch } = this.props;
    dispatch({
      type: 'pointset/stat',
      payload: {
        id:record.id,
        stat:stat,
      }
    });
  }
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'pointset/fetch',
    });
    dispatch({
      type: 'pointset/fetchl',
    });
  }

  handleStop(stat, record) {
    const { dispatch } = this.props;
    dispatch({
      type: 'pointset/stop',
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
      type: 'pointset/fetch',
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
      type: 'pointset/fetch',
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
          type: 'pointset/remove',
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
        type: 'pointset/fetch',
        payload: values,
      });
    });
  };

  handleModalVisible = (flag) => {
    console.log(111);
    this.setState({
      modalVisible: !!flag,
    });
  };

  // 查看详情
  handleUpdateModalVisible = flag => {
    console.log(2)
    this.setState({
      updateModalVisible: !!flag,
    });
  };

  handleDelete = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'pointset/remove',
      payload: record,
    });
  };

  handleCancle = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'pointset/cancle',
      payload: record,
    });
  };
  handleAddl=(fields)=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'pointset/setcode',
      payload: {
        ...fields
      },
    });

    message.success('添加成功');
    this.handleUpdateModalVisible();
  }
  handleAdd = fields => {
    console.log(fields);
    const { dispatch } = this.props;
    dispatch({
      type: 'pointset/add',
      payload: {
        ...fields
      },
    });

    message.success('添加成功');
    this.handleModalVisible();
  };

  onChangeDate() {}

  handleUpdate = fields => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    dispatch({
      type: 'pointset/update',
      payload: {
        query: formValues,
        body: {
          name: fields.name,
          desc: fields.desc,
          key: fields.key,
        },
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
        <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{float:'right'}}>
          <Col md={6} sm={24}>
            <span className={styles.submitButtons}>
            </span>
          </Col>
        </Row>
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

  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  render() {
    console.log(this.props);
    const {
        pointset: { data,datal },
      loading,
    } = this.props;
    const { selectedRows, modalVisible, updateModalVisible, stepFormValues,formValues } = this.state;
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="approval">批量审批</Menu.Item>
      </Menu>
    );

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      formValues:formValues,
    };
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
      value:datal,
      handleAddl:this.handleAddl
    };
    return (
      <PageHeaderWrapper title="积分设置">
        <div>
          <Card bordered={false}>
            <div className={styles.tableList}>
              {/* <div className={styles.tableListForm}>{this.renderForm()}</div> */}
              <div className={styles.tableListForm}>
              {/* <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{float:'right'}}>
                <Col md={6} sm={24}> */}
                  {/* <span className={styles.submitButtons}> */}
                    <Button type="primary" onClick={()=>this.handleUpdateModalVisible(true)}>
                      积分兑换比例设置
                    </Button>
                    {/* <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                      展开 <Icon type="down" />
                    </a> */}
                  {/* </span>
                </Col>
              </Row> */}
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
          <CreateFormTwo {...updateMethods} updateModalVisible={updateModalVisible}/>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default Comments;
