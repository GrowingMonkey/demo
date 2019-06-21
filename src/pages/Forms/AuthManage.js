import React, { PureComponent, Fragment, Children } from 'react';
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
  Checkbox,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from '../List/TableList.less';

const CheckboxGroup = Checkbox.Group;
const FormItem = Form.Item;
const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;
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
      console.log(fieldsValue);
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };
  const options = [
    { label: '作品删除', value: '1' },
    { label: '账号封禁', value: '2' },
    { label: '作品转载', value: '3' },
    { label: '作品管理', value: '4' },
    { label: '评论删除', value: '5' },
    { label: '作品清空', value: '6' },
  ];
  return (
    <Modal
      destroyOnClose
      title="新建角色"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="角色名">
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: '请输入角色名称！' }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="说明">
        {form.getFieldDecorator('detail', {
          rules: [{ required: true, message: '请输入权限描述' }],
        })(<TextArea placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15, offset: 0 }} label="权限">
        {form.getFieldDecorator('ids', {
          rules: [{ required: true, message: '请设置用户权限' }],
        })(<CheckboxGroup options={options} />)}
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
    console.log(props);
    super(props);

    this.state = {
      formVals: {
        id: props.values.id,
        detail: props.values.detail,
        name: props.values.name,
        desc: props.values.desc,
        key: props.values.key,
        powerNames: props.values.powerNames,
        target: '0',
        template: '0',
        type: '1',
        time: '',
        frequency: 'month',
      },
      currentStep: 0,
      modelType: props.modelType,
    };

    this.formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 13 },
    };
  }

  handleNext = currentStep => {
    const { form, handleUpdate } = this.props;
    console.log(handleUpdate);
    console.log(form);
    const { formVals: oldValue } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const formVals = { ...oldValue, ...fieldsValue };
      this.setState(
        {
          formVals,
        },
        () => {
          console.log(formVals);
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
    const { currentStep, modelType } = this.state;
    this.setState({
      currentStep: currentStep + 1,
    });
  };

  renderContent = (modelType, formVals) => {
    const { form } = this.props;
    const options = [
      { label: '作品删除', value: '1' },
      { label: '账号封禁', value: '2' },
      { label: '作品转载', value: '3' },
      { label: '作品管理', value: '4' },
      { label: '评论删除', value: '5' },
      { label: '作品清空', value: '6' },
    ];
    let Arrays = [];
    if (formVals.powerNames&&formVals.powerNames.indexOf(',') > -1) {
      Arrays = formVals.powerNames.split(',');
    } else {
      Arrays[0] = formVals.powerNames;
    }
    // let Arrays=['2','3','sda','sdas'];
    const row =
      Arrays.length % 2 === 0 ? parseInt(Arrays.length / 2) : parseInt(Arrays.length / 2) + 1;
    console.log(row);
    console.log(Arrays);
    if (modelType === 1) {
      return [
        <div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img src="" />
            <span>{formVals.name}</span>
          </div>
          <div>
            <div>
              <i />
              持有权限
            </div>
            <table border="1 solid #ddd" style={{ width: '100%', border: '1px solid #ddd' }}>
              <tbody style={{ width: '100%' }}>
                {Arrays.map((v, i) => {
                  if (i < row) {
                    return (
                      <tr key={i}>
                        <td style={{ width: '50%' }}>{Arrays[i]}</td>
                        <td style={{ width: '50%' }}>{Arrays[i + 1] || ''}</td>
                      </tr>
                    );
                  }
                })}
              </tbody>
            </table>
          </div>
        </div>,
      ];
    }
    {
    }
    if (modelType === 2) {
      return [
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="角色名" key="name">
          {form.getFieldDecorator('name', {
            initialValue: formVals.name,
            rules: [{ required: true, message: '请输入角色名称！' }],
          })(<Input placeholder="请输入" />)}
        </FormItem>,
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="说明" key="detail">
          {form.getFieldDecorator('detail', {
            initialValue: formVals.detail,
            rules: [{ required: true, message: '请输入权限描述' }],
          })(<TextArea placeholder="请输入" />)}
        </FormItem>,
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15, offset: 0 }}
          label="权限"
          key="powerNames"
        >
          {form.getFieldDecorator('ids', {
            rules: [{ required: true, message: '请设置用户权限' }],
          })(<CheckboxGroup options={options} />)}
        </FormItem>,
      ];
    }
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
      <Button key="cancel" onClick={() => handleUpdateModalVisible(false, values)}>
        取消
      </Button>,
      <Button key="forward" type="primary" onClick={() => this.handleNext(currentStep)}>
        下一步
      </Button>,
    ];
  };

  updateItem = () => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    console.log(formValues);
    dispatch({
      type: 'authmanage/update',
      payload: {},
    });
  };

  render() {
    const { updateModalVisible, handleUpdateModalVisible, values } = this.props;
    const { currentStep, formVals, modelType } = this.state;
    return (
      <Modal
        width={480}
        bodyStyle={{ padding: '32px 40px 48px' }}
        destroyOnClose
        title={modelType === 1 ? '查看角色' : '修改角色'}
        visible={updateModalVisible}
        // footer={()=>{
        //   return modelType===1?'':<d>ss</d>
        // }}
        onCancel={() => handleUpdateModalVisible(false, values)}
        afterClose={() => handleUpdateModalVisible()}
        onOk={() => this.handleNext(modelType,formVals)}
      >
        {this.renderContent(modelType, formVals)}
      </Modal>
    );
  }
}

/* eslint react/no-multi-comp:0 */
@connect(({ authmanage, loading }) => ({
  authmanage,
  loading: loading.models.authmanage,
}))
@Form.create()
class AuthManage extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
    modelType: 1,
  };

  columns = [
    {
      title: '角色',
      dataIndex: 'name',
      render: text => <a onClick={() => this.previewItem(text)}>{text}</a>,
    },
    {
      title: '说明',
      dataIndex: 'detail',
    },
    {
      title: '权限',
      dataIndex: 'powerNames',
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.handleUpdateModalVisible(true, record, 1)}>查看</a>
          <Divider type="vertical" />
          <a onClick={() => this.handleUpdateModalVisible(true, record, 2)}>修改</a>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'authmanage/fetch',
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
      type: 'authmanage/fetch',
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
      type: 'authmanage/fetch',
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
          type: 'authmanage/remove',
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
        type: 'authmanage/fetch',
        payload: values,
      });
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleUpdateModalVisible = (flag, record, modelType) => {
    this.setState({
      updateModalVisible: !!flag,
      stepFormValues: record || {},
      modelType,
    });
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'authmanage/add',
      payload: {
        name: fields.name,
        detail: fields.detail,
        ids: fields.ids.join(','),
      },
      callback: res => {
        console.log(res);
        if (res.code == 0) {
          message.success('添加成功');
          this.handleModalVisible();
          dispatch({
            type: 'authmanage/fetch',
            payload: values,
          });
        } else {
          message.error(res.message);
        }
      },
    });
  };

  handleUpdate = fields => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    console.log(fields);
    console.log(formValues);
    dispatch({
      type: 'authmanage/update',
      payload: {
        query: formValues,
          name: fields.name,
          detail: fields.detail,
          ids: fields.ids.join(','),
          id: fields.id,
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

  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  render() {
    console.log(this.props);
    const {
      authmanage: { data },
      loading,
    } = this.props;
    console.log(data);
    const {
      selectedRows,
      modalVisible,
      updateModalVisible,
      stepFormValues,
      modelType,
    } = this.state;
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
      <PageHeaderWrapper title="权限管理">
        <Card bordered={false}>
          <div className={styles.tableList}>
            {/* <div className={styles.tableListForm}>{this.renderForm()}</div> */}
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                新建
              </Button>
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
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
        {stepFormValues && Object.keys(stepFormValues).length ? (
          <UpdateForm
            {...updateMethods}
            updateModalVisible={updateModalVisible}
            values={stepFormValues}
            modelType={modelType}
          />
        ) : null}
      </PageHeaderWrapper>
    );
  }
}

export default AuthManage;
