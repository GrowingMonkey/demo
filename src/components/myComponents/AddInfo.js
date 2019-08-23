
import React, { PureComponent, Fragment,setState } from 'react';
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
    Checkbox
  } from 'antd';
import { func } from 'prop-types';
const CheckboxGroup=Checkbox.Group;
class AddInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            checkedList: [], // checkbox已选择的选项
            indeterminate: [], // 全选框-已有选择非全选
            checkAll: {}, // checkbox group 的全部title状态true/false
            tempList: [], // 临时存储checkbox已选择的选项
            checkTitle: {} // checkbox group中已选择的title（全选）
        };
    }

    /* 确定勾选 */
    handleOk = () => {
        if (this.state.tempList.length > 0) {
            // 将已选择信息传给Tags组件
            this.props.getChecked({
                checkedItem: this.state.tempList,
                checkAll: this.state.checkAll,
                indeterminate: this.state.indeterminate,
                checkTitle: this.state.checkTitle
            });
        }
    }

    /* checkbox单选 */
    onChange = (allCheckArr, checkedList) => {
        let checkAll = this.state.checkAll;
        let indeterminate = [];
        let checkTitle = {};
        Object.keys(allCheckArr).forEach((name) => {
            checkTitle[name] = 0;
            for (let checkedItem of checkedList || []) {
                if (allCheckArr[name].includes(checkedItem)) {
                    checkTitle[name]++;
                    checkAll[name] = checkTitle[name] === allCheckArr[name].length;
                    indeterminate[name] = !!checkTitle[name] && (checkTitle[name] < allCheckArr[name].length);
                }
            }
            if (checkTitle[name] === 0) { // 选项组下仅有一个选项时取消选中
                checkAll[name] = false;
            }
        });
        this.setState({
            checkedList,
            tempList:checkedList,
            indeterminate: indeterminate,
            checkAll: checkAll,
            checkTitle: checkTitle
        });
    }

    /* checkbox全选 */
    onCheckAllChange = (allCheckArr, name, e) => {
        this.state.checkAll[name] = e.target.checked;
        let checkedListT = [];
        checkedListT.push(...this.state.checkedList);
        let indeterminate = this.state.indeterminate || [];
        let checkTitle = this.state.checkTitle || {};
        if (e.target.checked === true) { // 全选
            checkedListT.push(...allCheckArr[name]);
            checkedListT = Array.from(new Set(checkedListT)); // 去重（原先indeterminate为true的情况）
            checkTitle[name] = allCheckArr[name].length;
        } else { // 取消全选
            let common = checkedListT.filter(v => allCheckArr[name].includes(v));
            checkedListT = checkedListT.concat(common).filter(v => checkedListT.includes(v) && !common.includes(v));
            checkTitle[name] = 0;
        }
        indeterminate[name] = false;
        this.setState({
            tempList: checkedListT,
            checkedList: checkedListT,
            indeterminate: indeterminate,
            checkTitle: checkTitle
        });
    }

    render() {
        const { checkedList, checkAll, indeterminate } = this.state;
        const { allCheckArr } = this.props;
        const parentList=allCheckArr.filter(function(item,index,array) {
            return (item.parentId==0)
        })
        // let newList=allCheckArr;
        let newList=allCheckArr.filter(function(item,index,array) {
            return (item.parentId==0)
        });
        newList.map((item,index)=>{
            item.value=[];
            allCheckArr.map((v,i)=>{
                if(v.parentId==item.id){
                    item.value.push(v);
                }
            })
        })
        console.log(newList);
        return (
            // <div className={styles.modalcontent} >
            <div>
                {   parentList&&parentList.map( ({ name, value ,id}, key ) => (
                        // <div className={styles.checksgroup}>
                            <div key={key}>
                            <div>
                                <Checkbox
                                indeterminate={indeterminate[name]}
                                onChange={this.onCheckAllChange.bind(this, allCheckArr, name)}
                                checked={checkAll[name]}
                                >
                                    {name}
                                </Checkbox>
                            </div>
                            <br />
                            {/* <CheckboxGroup className={styles.contents} options={value} value={checkedList} onChange={this.onChange.bind(this, allCheckArr)} /> */}
                            <CheckboxGroup options={
                                    allCheckArr.filter(function(itemChild,index,array) {
                                        return (itemChild.parentId==id) 
                                    }).map((val,ind)=>val.name)           
                                } value={checkedList} onChange={this.onChange.bind(this, allCheckArr)} />
                        </div>
                ))}
            </div>
        );
    }
}
export default AddInfo;