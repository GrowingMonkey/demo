import React, { PureComponent,Fragment, Suspense } from 'react';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import PageLoading from '@/components/PageLoading';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import {
  List,
  Avatar,
  Dropdown,
  Progress,
  Typography,
  Menu,
  Pagination,
  Divider,
  Row,
  Checkbox,
  message,
  Col,
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Modal,
  Card,
  InputNumber,
  Radio,
  Icon,
  Tooltip,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
// import styles from '../Forms/style.less';
import styles from './PullSend.less';
Date.prototype.Format = function (fmt) { //author: meizz 
  var o = {
      "M+": this.getMonth() + 1, //月份 
      "d+": this.getDate(), //日 
      "h+": this.getHours(), //小时 
      "m+": this.getMinutes(), //分 
      "s+": this.getSeconds(), //秒 
      "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
      "S": this.getMilliseconds() //毫秒 
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
  if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}
const FormItem = Form.Item;
const { Search } = Input;
const { Text } = Typography;

const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleModalVisible,handleSearch,userList,handleAdd,userData} = props;
  // console.log(userList);
  const okHandle = () => {
    handleAdd(changeUser);
  };
  const formLayout={
    span:6,
  }
  let changeUser=[];
  const search=()=>{
    console.log("搜索")
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleSearch(fieldsValue);
    });
  }
  const searchPage=(current,pageSize)=>{
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      // form.resetFields();
      let params={
        current:current,
        pageSize:pageSize,
        ...fieldsValue
      }
      handleSearch(params);
    });
  }
  const onChange=(checkedValues)=>{
    console.log(checkedValues);
    changeUser=checkedValues;
  }
  return (
    <Modal
      destroyOnClose
      title="选择作品"
      width={800}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible(false)}
    >
      <Form gutter={{xs: 8, sm: 16, md: 24, lg: 32}} >
        <Row style={{width:'100%'}}>
            <Col span={6}>
              <FormItem  labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} width={'25%'} label="用户名">
                {form.getFieldDecorator('name', {
                rules: [{ message: '请输入用户名', min: 1 }],
                 })(<Input placeholder="请输入" />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem labelCol={{ span: 6}} wrapperCol={{ span: 18 }} width={'25%'} label="手机号">
                {form.getFieldDecorator('phone', {
                rules: [{message: '请输入11位手机号', min: 11 }],
                })(<Input placeholder="请输入" />)}
              </FormItem>
            </Col>
            {/* <Col span={6}>
              <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} width={'25%'} label="注册日期">
                {form.getFieldDecorator('startTime', {
                })(<Input placeholder="请输入" />)}
              </FormItem>
            </Col> */}
            <Col span={6} style={{top:5,left:8}}>
              <Button type="primary" onClick={()=>searchPage()} {...formLayout}>
                查询
              </Button>
            </Col>
          </Row>
      </Form>
      <Row>
              <Col>
                <Checkbox.Group style={{ width: '100%' }} onChange={onChange}>
                  {userList&&userList.map((v,i)=><div><Checkbox value={v} key={i}>
                  <div style={{display:'inline-flex',justifyContent:'space-between'}}>
                  <Text span={6}>手机号：{v.phone}</Text>&nbsp;&nbsp;&nbsp;
                  <Text span={6}>用户名：{v.name}</Text>&nbsp;&nbsp;&nbsp;</div></Checkbox></div>
                  )}
                </Checkbox.Group>
                <Pagination defaultCurrent={1} total={userData.count} onChange={searchPage} pageSize={20}/>
              </Col>
          </Row>
    </Modal>
  );
});
const CreateOpusForm = Form.create()(props => {
  const { modalOpusVisible, form,handleScan, handleModalOpusVisible,handleOpusSearch,handleOpusAdd,opusData,opusLoading} = props;
  const okHandle = () => {
    handleOpusAdd(selectOpus);
  };
  const formLayout={
    span:6,
  }
  let selectOpus=''
  const handleSelect=(record)=>{
    message.success('添加成功');
    selectOpus=record;
  }
  let columns = [
    {
      title: '作者',
      dataIndex: 'name',
      render: text => <span>{text}</span>,
    },
    {
      title: '手机号',
      dataIndex: 'phone',
    },
    {
      title: '作品说明',
      dataIndex: 'detail',
      sorter: true,
      render: val => (
        <span
          style={{
            maxWidth: 500,
            overflow: 'hidden',
            display: 'block',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            boxOrient: 'vertical',
            whiteSpace: 'nowrap',
            boxOrient: 'vertical',
            lineClamp: 1,
          }}
        >
          {val}
        </span>
      ),
      // mark to display a total number
      needTotal: true,
    },
    {
      title: '发布时间',
      dataIndex: 'createTime',
      sorter: true,
      render: val => <span>{moment(parseInt(val)).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => handleScan(record)}>查看</a>
          <Divider type="vertical" />
          <a onClick={()=>handleSelect(record)}>选定</a>
        </Fragment>
      ),
    },
  ];
  let selectedRows=[];
  const handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});
    form.validateFields((err, fieldsValue) => {
      const params = {
        current: pagination.current,
        pageSize: pagination.pageSize,
        ...formValues,
        ...filters,
        ...fieldsValue,
        startDate: fieldsValue.startDate && fieldsValue.startDate[0].format('YYYY-MM-DD'),
        endDate: fieldsValue.startDate && fieldsValue.startDate[1].format('YYYY-MM-DD'),
        result:'normal'
      };
      console.log(params);
      if (sorter.field) {
        params.sorter = `${sorter.field}_${sorter.order}`;
      }
       //分页发送请求
       handleOpusSearch(params);
    })
  };
  let formValues=''
  const search=()=>{
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      // form.resetFields();
      let params={
        ...fieldsValue,
        startDate: fieldsValue.startDate && fieldsValue.startDate[0].format('YYYY-MM-DD'),
        endDate: fieldsValue.startDate && fieldsValue.startDate[1].format('YYYY-MM-DD'),
        result:'normal'//设置作品类别是非举报的
      }
      formValues=params;
      handleOpusSearch(params);
    });
  }
  const onChange=(checkedValues)=>{
    changeUser=checkedValues;
  }
  const opusTypeList=[
    {id:'article',name:'文章'},
    {id:'video',name:'视频'},
    {id:'image',name:'图片'},
    {id:'stalk',name:'段子'},
  ]
  return (
    <Modal
      destroyOnClose
      title="选择用户"
      width={1200}
      visible={modalOpusVisible}
      onOk={okHandle}
      onCancel={() => handleModalOpusVisible(false)}
    >
      <Form gutter={{xs: 8, sm: 16, md: 24, lg: 32}} >
        <Row style={{width:'100%'}}>
            <Col span={4}>
              <FormItem  labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} width={'25%'} label="作者">
                {form.getFieldDecorator('name', {
                rules: [{ message: '请输入用户名', min: 1 }],
                 })(<Input placeholder="请输入" />)}
              </FormItem>
            </Col>
            <Col span={4}>
              <FormItem labelCol={{ span: 6}} wrapperCol={{ span: 18 }} width={'25%'} label="手机">
                {form.getFieldDecorator('phone', {
                rules: [{message: '请输入11位手机号', min: 11 }],
                })(<Input placeholder="请输入" />)}
              </FormItem>
            </Col>
            <Col span={5}>
              <FormItem labelCol={{ span: 6}} wrapperCol={{ span: 18 }} width={'25%'} label="标题">
                {form.getFieldDecorator('title')(<Input placeholder="请输入" />)}
              </FormItem>
            </Col>
            <Col span={3}>
              <FormItem labelCol={{ span: 6}} wrapperCol={{ span: 18 }} width={'25%'} label="类型">
              {form.getFieldDecorator('type',{
                initialValue:'article'
              })(<Select placeholder="请选择" style={{ width: '60%' }}>
                  {opusTypeList&&opusTypeList.map((intem, i) => {
                    return (
                      <Option value={intem.id} key={i}>
                        {intem.name}
                      </Option>
                    );
                  })}
                </Select>)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem labelCol={{ span: 6}} wrapperCol={{ span: 18 }} width={'25%'} label="发布日期">
                {form.getFieldDecorator('startDate')(<RangePicker
                  style={{ width: '100%' }}
                  placeholder={[
                    formatMessage({ id: 'form.date.placeholder.start' }),
                    formatMessage({ id: 'form.date.placeholder.end' }),
                  ]}
                />)}
              </FormItem>
            </Col>
            {/* <Col span={6}>
              <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} width={'25%'} label="注册日期">
                {form.getFieldDecorator('startTime', {
                })(<Input placeholder="请输入" />)}
              </FormItem>
            </Col> */}
            <Col span={2} style={{top:5,left:8}}>
              <Button type="primary" onClick={()=>search()} {...formLayout}>
                查询
              </Button>
            </Col>
          </Row>
      </Form>
      <Row>
             <StandardTable
              selectedRows={selectedRows}
              loading={opusLoading}
              data={opusData}
              columns={columns}
              onChange={handleStandardTableChange}
            />
          </Row>
    </Modal>
  );
});
@connect(({ pullopus, loading }) => ({
  pullopus,
  loading: loading.models.pullopus,
}))
@Form.create()
class PullOpus extends PureComponent {
    state={
      pushType:0,
      alias:false,
      modalVisible:false,
      modalOpusVisible:false,
      clickShow:true,
      userList:[],
      currentOpus:{},
      disabled:false,
      selectType:'0',
    }
  handleSubmit = e => {
    const { dispatch, form } = this.props;
    const {userList,currentOpus}=this.state;
    e.preventDefault();
    console.log(userList);

    form.validateFieldsAndScroll((err, values) => {
      console.log(values);
      console.log(new Date(parseInt(values.pushTime.valueOf())+2*60*1000).Format("yyyy-MM-dd hh:mm:ss"));
      if (!err) {
        console.log(111);
        let ids='';
        if(values.pushType!='broadcast'){
          values.alias.map((val,key)=>{
            userList.map((v,i)=>{
              if(val==v.name){
                ids=ids+v.phone+','
              }
            })
          })
        }
        if(values.pushType=='customized'&&ids==''){
          message.error('请选择用户');
          return;
        }
        console.log(ids,currentOpus.id);//用户字符串 作品Id
        dispatch({
          type: 'pullopus/submitRegularForm',
          payload: {
            title: values.title,
            sys: values.sys,
            pushType:'0',
            alias:ids,
            pushWay:values.pushType,
            pushTime: new Date(parseInt(values.pushTime.valueOf())+2*60*1000).Format("yyyy-MM-dd hh:mm:ss"),
            content: JSON.stringify({id:currentOpus.id,type:currentOpus.type}),
          },
        });
      }
    });
  };
  handleModalVisible = (flag) => {
    const {dispatch}=this.props;
    flag&&dispatch({
      type:'pullopus/fetchUser'
    })
    this.setState({
      modalVisible: !!flag,
    });
  };
  handleModalOpusVisible = (flag) => {
    this.setState({
      modalOpusVisible: !!flag,
    });
  };
  componentDidMount() {
    console.log(this.props);
    const { dispatch } = this.props;
    dispatch({
      type: 'pullopus/pushfetch',
    });
  }
  handleScan=(record)=>{
    const { match } = this.props;
    let typeString=''
    switch(record.type){
      case '1':
      typeString='article';
      break;
      case '2':
      typeString='picture';
      break;
      case '0':
      typeString='videos';
      break;
    }
    router.push(`/dashboard/commondetail/${record.id}?type=${typeString}`);
  }
  handleAdd=(val)=>{
    //拿到返回的数据了
    console.log(val);
    this.setState({
      userList:val
    })
    this.props.form.resetFields('alias');
    this.handleModalVisible();
  }
  handleOpusAdd=(val)=>{
    console.log(val);
    this.setState({
      currentOpus:val
    })
    //拿到返回的数据了
    this.handleModalOpusVisible();
  }
  handleSearch=(val)=>{
    console.log(val)
    const {dispatch}=this.props;
    dispatch({
      type:'pullopus/fetchUser',
      payload:{
        ...val
      }
    })
  }
  handleOpusSearch=(val)=>{
    console.log(val)
    const {dispatch}=this.props;
    dispatch({
      type:'pullopus/fetchOpus',
      payload:{
        ...val
      }
    })
  }
  columns = [
    {
      title: '推送时间',
      dataIndex: 'pushTime',
    },
    {
      title: '推送内容',
      dataIndex: 'content',
    },
  ];
  handleSelectChange=(val)=>{
    console.log(val);
    this.setState({
      userList:val
    })
  }
  handleChange=(value)=>{
    console.log(value);
    const {form}=this.props;
    if(value=='customized'){
      this.setState({
        alias:true,
        disabled:true
      })
      form.resetFields('sys');
    }else{
      this.setState({
        alias:false,
        disabled:false
      })
    }
    // console.log(form.getFieldValue('pushType'));
  }
  render() {
    console.log(this.props);
    const {submitting,form: { getFieldDecorator, getFieldValue },pullopus: { pullopus ,datass,opusData,userData},loading,} = this.props;
    const {alias,modalVisible,modalOpusVisible,clickShow,userList,currentOpus,disabled,selectType}=this.state;
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
    const parentMethods = {
      handleModalVisible: this.handleModalVisible,
      handleSearch:this.handleSearch,
      handleAdd:this.handleAdd,
      userList:userData.list||[],
      userData:userData
    };
    const parentOpusMethods={
      handleModalOpusVisible: this.handleModalOpusVisible,
      handleOpusSearch:this.handleOpusSearch,
      handleOpusAdd:this.handleOpusAdd,
      opusData:opusData,
      opusLoading:loading,
      handleScan:this.handleScan
    }
    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };
    const disabledDate=(current)=> {
      // Can not select days before today and today
      console.log(moment().endOf('day'));
      return current < moment().startOf('day');
      
    }
    const disabledDateTime=()=>{
      const hours=moment().hours();
      const minutes=moment().minutes();
      return {
        disabledHours: () => range(0, 24).splice(0, hours),
        disabledMinutes: () => range(0, 60).splice(0,minutes+2),
        // disabledSeconds: () => [55, 56],
      };
    }
    const range=(start, end)=>{
      const result = [];
      for (let i = start; i < end; i++) {
        result.push(i);
      }
      return result;
    }
    return (
          <GridContent>
            <Suspense fallback={<PageLoading />}>
              <Card bordered={false} title="作品推送">
                <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
                  <FormItem label="标题" {...formItemLayout}>
                    {getFieldDecorator('title')(<Input placeholder="请输入" />)}
                  </FormItem>
                  <FormItem label="平台" {...formItemLayout}>
                    {getFieldDecorator('sys',{
                      initialValue:selectType
                    })(
                      <Select placeholder="请选择" disabled={disabled} >
                        <Option value="0">全部</Option>
                        <Option value="1">安卓</Option>
                        <Option value="2">ios</Option>
                      </Select>
                    )}
                  </FormItem>
                  <FormItem {...formItemLayout} label="推送类型">
                    {getFieldDecorator('pushType', {
                      rules: [
                        {
                          required: true,
                          message: formatMessage({ id: 'validation.date.required' }),
                        },
                      ],
                    })(
                      <Select placeholder="请选择" onChange={this.handleChange.bind(this)}>
                        <Option value="broadcast">广播推送</Option>
                        <Option value="customized">针对用户推送</Option>
                      </Select>
                    )}
                  </FormItem>
                  {alias&&(<FormItem label="推送用户" {...formItemLayout}>
                    {getFieldDecorator('alias',{
                      initialValue:userList.map((v,i)=>v.name)
                    })(<Select  mode="multiple" onChange={this.handleSelectChange} optionLabelProp="label">
                        {userList&&userList.map((v,i)=>{
                          <Option value={v.id} label={v.name}>{v.name}</Option>
                        })}
                    </Select>)}
                    <Button onClick={this.handleModalVisible.bind(this,true,clickShow)}>请选择</Button>
                  </FormItem>)}
                  <FormItem {...formItemLayout} label="推送时间">
                    {getFieldDecorator('pushTime', {
                      rules: [
                        {
                          required: true,
                          message: formatMessage({ id: 'validation.date.required' }),
                        },
                      ],
                    })(
                      <DatePicker
                      format="YYYY-MM-DD HH:mm:ss"
                      placeholder="请选择推送时间"
                      style={{ width: '100%' }}
                      disabledDate={disabledDate}
                      disabledTime={disabledDateTime}
                      showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                    />
                    )}
                  </FormItem>
                  <FormItem {...formItemLayout} label="内容">
                    {getFieldDecorator('content', {
                      rules: [
                        {
                          required: true,
                          message: formatMessage({ id: 'validation.goal.required' }),
                        },
                      ],
                    })(
                      <TextArea
                        style={{ minHeight: 32 }}
                        placeholder={formatMessage({ id: 'form.goal.placeholder' })}
                        rows={4}
                      />
                    )}
                  </FormItem>

                  <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
                    <Button type="primary" htmlType="submit" loading={submitting}>
                      <FormattedMessage id="form.submit" />
                    </Button>
                  </FormItem>
                </Form>
              </Card>
            </Suspense>
            <CreateOpusForm {...parentOpusMethods} modalOpusVisible={modalOpusVisible} />
            <CreateForm {...parentMethods} modalVisible={modalVisible} />
          </GridContent>
    );
  }
}

export default PullOpus;
