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
  const { modalVisible, form, handleAdd, handleModalVisible} = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      let params={
        ...fieldsValue,
      }
      handleAdd(params);
    });
  };
  return (
    <Modal
      width={320}
      destroyOnClose
      title="新增"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <div>
        {/* <label>角色</label> */}
        <FormItem
          // labelCol={{ span: 5 }}
          label="手机号"
          style={{display:'flex'}}
          // wrapperCol={{ span: 10, offset: 0 }}
        >
          {form.getFieldDecorator('phone', {
            rules: [{ required: true, message: '请输入手机号',len:11}],
          })(<Input/>)}
        </FormItem>
      </div>
    </Modal>
  );
});
/* eslint react/no-multi-comp:0 */
@connect(({ member, loading }) => ({
  member,
  loading: loading.models.member,
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
      title: '手机号',
      dataIndex: 'phone',
    },
    {
      title: '注册时间',
      dataIndex: 'createTime',
      render: val => <span>{moment(parseInt(val)).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '操作',
      render: (text, record) => {
        const textMsg=`你确认删除这个账号吗？`;
        return (
          <Fragment>  
            <Popconfirm
            title="你确认删除这个特殊用户吗？"
            onConfirm={() => this.handleDeleteReset(record)}
            okText="确认"
            cancelText="取消"
            >
            <a href="#">删除</a>
          </Popconfirm>
          </Fragment>
        );
      },
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'member/fetch',
    });
  }
  handleDeleteReset=(record)=>{
    alert("1111")
    const {dispatch}=this.props;
    dispatch({
      type:'member/remove',
      payload:{
        id:record.id
      }
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
      type: 'member/fetch',
      payload: params,
    });
  };
  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };
  handleAdd = fields => {
    const { dispatch } = this.props;
    console.log(fields);
    dispatch({
      type: 'member/adduser',
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
      type: 'member/updatepower',
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
  render() {
    console.log(this.props);
    const {
      member: { data },
      loading,
    } = this.props;
    const { selectedRows, modalVisible, updateModalVisible,} = this.state;
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    return (
      <PageHeaderWrapper title="特殊用户">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <Button style={{ marginLeft: 8 }} onClick={this.handleModalVisible} type="primary">
                新增
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
        <CreateForm {...parentMethods} modalVisible={modalVisible}/>
      </PageHeaderWrapper>
    );
  }
}

export default UserList;
