import React, { PureComponent, Fragment,useState } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import style2 from "./counseleedetail.less";
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
const {CDN_ADDRESS}=process.env;
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

/* eslint react/no-multi-comp:0 */
@connect(({ counseleedetail, loading }) => ({
  counseleedetail,
  loading: loading.models.counseleedetail,
}))
class UserList extends PureComponent {
  state={
    lists:[
      // {
      // list: [
      //   {
      //     aname: "测试1",
      //     value: "test1"
      //   },
      //   {
      //     aname: "测试2",
      //     value: "test2"
      //   }
      // ]
    // }
  ],
  }
  componentDidMount() {
    const { dispatch,location:{query} } = this.props;
    const {lists} =this.state;
    const id=query.id;
    dispatch({
      type: 'counseleedetail/fetch',
      payload:{
        aid:query.id
      },
      callback:(response)=>{
        if(response){
          console.log(response);
          let cleanedList = lists.slice(0);
          const newData = cleanedList.slice(0).concat({list:response});
          console.log(newData);
          this.setList(newData);
        }
      }
    });
  }
  setList(prev){
    this.setState({
      lists:prev
    })
  }
  cascaderItemGenerator(list, event, nowIndex) {
    const cascaderItems = list.map((item ,index)=> {
      const { aname ,aheadUrl,aid} = item;
      return (<p onClick={() => event(item, nowIndex)} key={index} style={{display:'flex',alignItems:'center'}}>
        <img src={`${CDN_ADDRESS?CDN_ADDRESS:'https://f-bd.imuguang.com'}/${aheadUrl?aheadUrl:'bg/userHead.png'}`} style={{width:32,height:32,overflow:'hidden',borderRadius:50,background:'#ddd',marginRight:18}}/>
          {aname}
      </p>);
    });
    return cascaderItems;
  }
  testPromiseGenerator = item => {
    const { dispatch,location:{query} } = this.props;

    console.log(`我点中了${item.name}`);
    dispatch({
      type: 'counseleedetail/fetch',
      payload:{
        // aid:'38452297608466432'
        aid:item.aid
      },
      callback:(response) => {
        if (response&&parseInt(response.length)!==0) {
          console.log(response);
          return Promise.resolve({list:response});
        }else{
          return Promise.resolve({
              list: [
                {
                  name: `${item.name}1`,
                  value: `${item.value}1`
                },
                {
                  name: `${item.name}2`,
                  value: `${item.value}2`
                }
              ]
            });
        }
      }
    });
    // return Promise.resolve({
    //   list: [
    //     {
    //       name: `${item.name}1`,
    //       value: `${item.value}1`
    //     },
    //     {
    //       name: `${item.name}2`,
    //       value: `${item.value}2`
    //     }
    //   ]
    // });
  };
  
  render(){
    const { initlist ,location:{query}} = this.props;
    // const [list, setList] = useState(initlist);
    const {lists} =this.state;
    console.log(lists);
    console.log(this.state);
    const onClickItemEvent = async (item, nowIndex) => {
      // 当点击第几列时需要清理后面的列数。
      console.log(`我点中了第${nowIndex + 1}行`);
      let cleanedList = lists.slice(0);
      console.log(item);
       if (lists.length !== 1) {
          cleanedList.splice(nowIndex + 1, lists.length - nowIndex);
      }
      const result = await this.testPromiseGenerator(item);
      const newData = cleanedList.slice(0).concat([result]);
      this.setList(newData);
    };
    return (
      <PageHeaderWrapper title="师徒详情">
        <Card bordered={false}>
        <section className={style2.cascaderContainer}>
        <section className={style2.cascaderCol}>
          <p className={style2.cascaderColTitle}>师傅</p>
          <p style={{display:'flex',alignItems:'center'}}>
            <img src={`${CDN_ADDRESS?CDN_ADDRESS:'https://f-bd.imuguang.com'}/${query.headerUrl}`} style={{width:32,height:32,overflow:'hidden',borderRadius:50,background:'#ddd',marginRight:18}}/>
          {query.name}<Icon type="right" />
      </p>
        </section>
          {lists.map((listItem, index) => {
            const nowIndex = index;
            const { list } = listItem;
            return [
              <section className={style2.cascaderCol} key={index}>
                <p className={style2.cascaderColTitle}>{index+1}级徒弟({list.length})</p>
                {this.cascaderItemGenerator(list, onClickItemEvent, nowIndex)}
              </section>,
              <Divider type="vertical" style={{height:'100%'}}/>
            ];
          })}
    </section>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default UserList;
