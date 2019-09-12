import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import {
    Card,
    Form, 
    Input,
    InputNumber,
    Button,
    message,
    Icon,
    Col,
    Row
  } from 'antd';
  const FormItem = Form.Item;
  @connect(({ buttonset, loading }) => ({
    buttonset,
    loading: loading.models.buttonset,
}))
@Form.create()
class InputForm extends PureComponent {
    constructor(props) {
        super(props);
        const { columns } = props;
        this.state={
            disabled: true,
        };
      }
    toggle = () => {
        this.setState({
          disabled: !this.state.disabled,
        });
      };
    submitValue=()=>{
        const {disabled}=this.state;
        const {dispatch,form}=this.props;
        console.log(this.props)
        if(disabled){
            return;
        }else{
            console.log('提交')
            form.validateFields((err, fieldsValue) => {
              if (err) return;
              form.resetFields();
              dispatch({
                type:'buttonset/update',
                payload:{
                  ...fieldsValue
                },
                callback:(response)=>{
                  console.log(response);
                  response.code==0&&message.success(response.message);
                }
              })
            });
            this.setState({
                disabled: !this.state.disabled,
            })
        }
    }
    render(){
        const { getFieldDecorator } = this.props.form;
        const {code}=this.props;
        const formItemLayout = {
            labelCol: {
              xs: { span: 24 },
              sm: { span: 10},
            },
            wrapperCol: {
              xs: { span: 24 },
              sm: { span: 14 },
              // md: { span: 10 },
            },
          };
        const {title,sourceValue,msg}=this.props;
        return(
            <div style={{display:'flex'}}>
            <FormItem {...formItemLayout} label={title?title:''}>
                {getFieldDecorator(`${code}`, {
                rules: [{
                    required: true,
                    message: msg,
                }],
                initialValue:sourceValue
                })(
                    <Input disabled={this.state.disabled} style={{width:110}}/>
                )}
            </FormItem>
            <Button onClick={this.toggle} type="primary" style={{marginLeft:120,marginTop:4}}>
                修改
            </Button>
            <Button onClick={this.submitValue} type="primary"  style={{marginLeft:24,marginTop:4}}>
                提交
            </Button>
          </div>
        )
    }
}
export default InputForm;