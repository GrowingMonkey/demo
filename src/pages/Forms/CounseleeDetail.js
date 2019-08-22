import React, { PureComponent, Fragment,useState } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import style2 from "./counseleedetail.less";
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

/* eslint react/no-multi-comp:0 */
@connect(({ counseleedetail, loading }) => ({
  counseleedetail,
  loading: loading.models.counseleedetail,
}))
class UserList extends PureComponent {
  state={
    list:[{
      list: [
        {
          name: "测试1",
          value: "test1"
        },
        {
          name: "测试1",
          value: "test2"
        }
      ]
    }],
  }
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'counselee/fetch',
    });
  }
  setList(prev){
    this.setState({
      list:prev
    })
  }
  cascaderItemGenerator(list, event, nowIndex) {
    const cascaderItems = list.map((item ,index)=> {
      const { name } = item;
      return (<p onClick={() => event(item, nowIndex)} key={index} style={{display:'flex',alignItems:'center'}}>
        <img src="" style={{width:32,height:32,overflow:'hidden',borderRadius:50,background:'#ddd',marginRight:18}}/>
          {name}<i>&gt;</i>
      </p>);
    });
    return cascaderItems;
  }
  testPromiseGenerator = item => {
    console.log(`我点中了${item.name}`);
    return Promise.resolve({
      title: "测试标题",
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
  };
  
  render(){
    const { initlist } = this.props;
    // const [list, setList] = useState(initlist);
    const {list} =this.state;
    const onClickItemEvent = async (item, nowIndex) => {
      // 当点击第几列时需要清理后面的列数。
      console.log(`我点中了第${nowIndex + 1}行`);
      let cleanedList = list.slice(0);
       if (list.length !== 1) {
          cleanedList.splice(nowIndex + 1, list.length - nowIndex);
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
            <img src="" style={{width:32,height:32,overflow:'hidden',borderRadius:50,background:'#ddd',marginRight:18}}/>
          {"asas"}<i>&gt;</i>
      </p>
        </section>
          {list.map((listItem, index) => {
            const nowIndex = index;
            const { title, list } = listItem;
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
