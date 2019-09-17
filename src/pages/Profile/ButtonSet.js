import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import 'braft-editor/dist/index.css';
import request from '@/utils/request';
import {
  Card,
  Form, 
  Input,
  Button,
  message,
  Collapse,
  Icon,
  Col,
  Row
} from 'antd';
const { Panel } = Collapse;
const { TextArea } = Input;
const FormItem = Form.Item;
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import InputForm from '@/components/myComponents/InputForm';
import IconForm from '@/components/myComponents/IconUpload';
import styles from '../Forms/style.less';
import { router } from 'umi';
String.prototype.startWith = function(compareStr){
    return this.indexOf(compareStr) == 0;
    }
@connect(({ buttonset, loading }) => ({
    buttonset,
    loading: loading.models.buttonset,
}))
@Form.create()
class ButtonSet extends PureComponent {
    state={
        sourceValue:'',
    }
    setValue=(val,code)=> {
        const {dispatch}=this.props;
        console.log(val)
        let urlStr=val+'';
        urlStr=urlStr.split('icon/app')[1]
        console.log(urlStr)
        let size=code.indexOf('nav')>-1&&code!='navCenterIcon'?'?x-oss-process=image/resize,w_24,h_24':'?x-oss-process=image/resize,w_60,h_60'
        dispatch({
            type:'buttonset/update',
            payload:{
              code:code,
              detail:`/icon/app${urlStr}${size}`,
            }
        })
    }
    componentDidMount(){
        console.log(this.props);
        const {dispatch}=this.props;
        dispatch({
            type:'buttonset/fetch'
        })
    }
    render(){
        const {buttonset:{data:{list}}}=this.props;
        console.log(list);
        const formItemLayout = {
            labelCol: {
              xs: { span: 24 },
              sm: { span: 3},
            },
            wrapperCol: {
              xs: { span: 24 },
              sm: { span: 5 },
              // md: { span: 10 },
            },
          };
          console.log( list&&list.filter(item=>item.code.startWith('nav2')));
          const {sourceValue}=this.state;
          const { getFieldDecorator } = this.props.form;
          const bottomButton=[
           
        ]
        return(
        <PageHeaderWrapper title="按钮配置">
            <Card bordered={false}>
            <Collapse defaultActiveKey={['1']} >
            <Panel header={<h2>底部导航栏配置</h2>} key="1">
            <Row gutter={24}>
                <Col xl={2} lg={24} md={24} sm={24} xs={24}>
                  <h1 style={{textAlign:'right'}}>左一:</h1>
                </Col>
                <Col xl={22} lg={24} md={24} sm={24} xs={24}>
                    <Row gutter={24} style={{border:'1px solid #ddd'}}>
                        <Col xl={12} lg={24} md={24} sm={24} xs={24}>
                            {
                                list&&list.filter(item=>item.code.startWith('nav1')).map((i,k)=>{
                                    if(i.code=='nav1'){
                                        return    <InputForm title="按钮-名称" msg='请输入文字' sourceValue='' key={i.code} code={i.code}></InputForm>
                                    }else{
                                      return <IconForm title="图标-选中" msg='上传图标' sourceValue={sourceValue} setValue={this.setValue} key={i.code} code={i.code}></IconForm> 
                                    }
                                })
                            }
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col xl={2} lg={24} md={24} sm={24} xs={24}>
                  <h1 style={{textAlign:'right'}}>左二:</h1>
                </Col>
                <Col xl={22} lg={24} md={24} sm={24} xs={24}>
                    <Row gutter={24} style={{border:'1px solid #ddd'}}>
                        <Col xl={12} lg={24} md={24} sm={24} xs={24}>
                        {
                                list&&list.filter(item=>item.code.startWith('nav2')).map((i,k)=>{
                                    if(i.code=='nav2'){
                                        return    <InputForm title="按钮-名称" msg='请输入文字' sourceValue='' key={i.code} code={i.code}></InputForm>
                                    }else if(i.code!='nav2Title'){
                                      return <IconForm title="图标-选中" msg='上传图标' sourceValue={sourceValue} setValue={this.setValue} key={i.code} code={i.code}></IconForm> 
                                    }
                                })
                            }
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col xl={2} lg={24} md={24} sm={24} xs={24}>
                  <h1 style={{textAlign:'right'}}>右一:</h1>
                </Col>
                <Col xl={22} lg={24} md={24} sm={24} xs={24}>
                    <Row gutter={24} style={{border:'1px solid #ddd'}}>
                        <Col xl={12} lg={24} md={24} sm={24} xs={24}>
                        {
                                list&&list.filter(item=>item.code.startWith('nav3')).map((i,k)=>{
                                    if(i.code=='nav3'){
                                        return    <InputForm title="按钮-名称" msg='请输入文字' sourceValue='' key={i.code} code={i.code}></InputForm>
                                    }else  if(i.code!='nav3Title'){
                                      return <IconForm title="图标-选中" msg='上传图标' sourceValue={sourceValue} setValue={this.setValue} key={i.code} code={i.code}></IconForm> 
                                    }
                                })
                            }
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col xl={2} lg={24} md={24} sm={24} xs={24}>
                  <h1 style={{textAlign:'right'}}>右二:</h1>
                </Col>
                <Col xl={22} lg={24} md={24} sm={24} xs={24}>
                    <Row gutter={24} style={{border:'1px solid #ddd'}}>
                        <Col xl={12} lg={24} md={24} sm={24} xs={24}>
                        {
                                list&&list.filter(item=>item.code.startWith('nav4')).map((i,k)=>{
                                    if(i.code=='nav4'){
                                        return    <InputForm title="按钮-名称" msg='请输入文字' sourceValue='' key={i.code} code={i.code}></InputForm>
                                    }else{
                                      return <IconForm title="图标-选中" msg='上传图标' sourceValue={sourceValue} setValue={this.setValue} key={i.code} code={i.code}></IconForm> 
                                    }
                                })
                            }
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col xl={2} lg={24} md={24} sm={24} xs={24}>
                  <h1 style={{textAlign:'right'}}>中部:</h1>
                </Col>
                <Col xl={22} lg={24} md={24} sm={24} xs={24}>
                    <Row gutter={24} style={{border:'1px solid #ddd'}}>
                        <Col xl={12} lg={24} md={24} sm={24} xs={24}>
                        {
                                list&&list.filter(item=>item.code.startWith('nav')).map((i,k)=>{
                                    if(i.code=='navCenterIcon'){
                                        return    <InputForm title="按钮-名称" msg='请输入文字' sourceValue='' key={i.code} code={i.code}></InputForm>
                                    }
                                })
                            }
                        </Col>
                    </Row>
                </Col>
            </Row>
            </Panel>
            <Panel header={<h2>发布类型按钮配置</h2>} key="2">
            <Row gutter={24}>
                <Col xl={2} lg={24} md={24} sm={24} xs={24}>
                  <h1 style={{textAlign:'right'}}>图片:</h1>
                </Col>
                <Col xl={22} lg={24} md={24} sm={24} xs={24}>
                    <Row gutter={24} style={{border:'1px solid #ddd'}}>
                        <Col xl={12} lg={24} md={24} sm={24} xs={24}>
                        {
                                list&&list.filter(item=>item.code.startWith('pub1')).map((i,k)=>{
                                    if(i.code=='pub1'){
                                        return    <InputForm title="按钮-名称" msg='请输入文字' sourceValue='' key={i.code} code={i.code}></InputForm>
                                    }else{
                                      return <IconForm title="图标-选中" msg='上传图标' sourceValue={sourceValue} setValue={this.setValue} key={i.code} code={i.code}></IconForm> 
                                    }
                                })
                            }
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col xl={2} lg={24} md={24} sm={24} xs={24}>
                  <h1 style={{textAlign:'right'}}>视频:</h1>
                </Col>
                <Col xl={22} lg={24} md={24} sm={24} xs={24}>
                    <Row gutter={24} style={{border:'1px solid #ddd'}}>
                        <Col xl={12} lg={24} md={24} sm={24} xs={24}>
                        {
                                list&&list.filter(item=>item.code.startWith('pub2')).map((i,k)=>{
                                    if(i.code=='pub2'){
                                        return    <InputForm title="按钮-名称" msg='请输入文字' sourceValue='' key={i.code} code={i.code}></InputForm>
                                    }else{
                                      return <IconForm title="图标-选中" msg='上传图标' sourceValue={sourceValue} setValue={this.setValue} key={i.code} code={i.code}></IconForm> 
                                    }
                                })
                            }
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col xl={2} lg={24} md={24} sm={24} xs={24}>
                  <h1 style={{textAlign:'right'}}>:</h1>
                </Col>
                <Col xl={22} lg={24} md={24} sm={24} xs={24}>
                    <Row gutter={24} style={{border:'1px solid #ddd'}}>
                        <Col xl={12} lg={24} md={24} sm={24} xs={24}>
                        {
                                list&&list.filter(item=>item.code.startWith('pub3')).map((i,k)=>{
                                    if(i.code=='pub3'){
                                        return    <InputForm title="按钮-名称" msg='请输入文字' sourceValue='' key={i.code} code={i.code}></InputForm>
                                    }else{
                                      return <IconForm title="图标-选中" msg='上传图标' sourceValue={sourceValue} setValue={this.setValue} key={i.code} code={i.code}></IconForm> 
                                    }
                                })
                            }
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col xl={2} lg={24} md={24} sm={24} xs={24}>
                  <h1 style={{textAlign:'right'}}>段子:</h1>
                </Col>
                <Col xl={22} lg={24} md={24} sm={24} xs={24}>
                    <Row gutter={24} style={{border:'1px solid #ddd'}}>
                        <Col xl={12} lg={24} md={24} sm={24} xs={24}>
                        {
                                list&&list.filter(item=>item.code.startWith('pub4')).map((i,k)=>{
                                    if(i.code=='pub4'){
                                        return    <InputForm title="按钮-名称" msg='请输入文字' sourceValue='' key={i.code} code={i.code}></InputForm>
                                    }else{
                                      return <IconForm title="图标-选中" msg='上传图标' sourceValue={sourceValue} setValue={this.setValue} key={i.code} code={i.code}></IconForm> 
                                    }
                                })
                            }
                        </Col>
                    </Row>
                </Col>
            </Row>
            </Panel>
            <Panel header={<h2>个人中心其他配置</h2>} key="5">
            <Row gutter={24}>
                    <Col xl={4} lg={24} md={24} sm={24} xs={24}>
                    <h1 style={{textAlign:'right'}}>积分功能按钮名称:</h1>
                    </Col>
                    <Col xl={20} lg={24} md={24} sm={24} xs={24}>
                        <Row gutter={24} style={{border:'1px solid #ddd'}}>
                        {
                                list&&list.filter(item=>item.code.startWith('center')).map((i,k)=>{
                                    if(i.code=='center5'){
                                        return     <InputForm title="按钮-名称" msg='请输入文字' sourceValue='我的积分' key={i.code}></InputForm>
                                    }
                                })
                            }
                        </Row>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col xl={4} lg={24} md={24} sm={24} xs={24}>
                    <h1 style={{textAlign:'right'}}>关注粉丝赞收藏文案:</h1>
                    </Col>
                    <Col xl={20} lg={24} md={24} sm={24} xs={24}>
                        <Row gutter={24} style={{border:'1px solid #ddd'}}>
                            {
                                list&&list.filter(item=>item.code.startWith('center')).map((i,k)=>{
                                    if(i.code=='center1'){
                                        return     <InputForm title="按钮-名称" msg='请输入文字' sourceValue='我的积分' key={i.code}></InputForm>
                                    }
                                })
                            }
                        </Row>
                        <Row gutter={24} style={{border:'1px solid #ddd'}}>
                        {
                                list&&list.filter(item=>item.code.startWith('center')).map((i,k)=>{
                                    if(i.code=='center2'){
                                        return     <InputForm title="按钮-名称" msg='请输入文字' sourceValue='我的积分' key={i.code}></InputForm>
                                    }
                                })
                            }
                        </Row>
                        <Row gutter={24} style={{border:'1px solid #ddd'}}>
                        {
                                list&&list.filter(item=>item.code.startWith('center')).map((i,k)=>{
                                    if(i.code=='center3'){
                                        return     <InputForm title="按钮-名称" msg='请输入文字' sourceValue='我的积分' key={i.code}></InputForm>
                                    }
                                })
                            }
                        </Row>
                        <Row gutter={24} style={{border:'1px solid #ddd'}}>
                        {
                                list&&list.filter(item=>item.code.startWith('center')).map((i,k)=>{
                                    if(i.code=='center4'){
                                        return     <InputForm title="按钮-名称" msg='请输入文字' sourceValue='我的积分' key={i.code}></InputForm>
                                    }
                                })
                            }
                        </Row>
                    </Col>
                </Row>
            </Panel>
            <Panel header={<h2>收藏作品配置</h2>} key="6">
            <Row gutter={24}>
                    <Col xl={4} lg={24} md={24} sm={24} xs={24}>
                    <h1 style={{textAlign:'right'}}>收藏类型文案配置:</h1>
                    </Col>
                    <Col xl={20} lg={24} md={24} sm={24} xs={24}>
                    {
                                list&&list.filter(item=>item.code.startWith('collectOpus')).map((i,k)=>{
                                        let name=i.name.substr(i.name.length-2,2)

                                        return       <Row gutter={24} style={{border:'1px solid #ddd'}} key={i.code}><InputForm title={`${name}-按钮`} msg='请输入文字' sourceValue='我的积分' key={i.code} code={i.code}></InputForm> </Row>
                                    
                                })
                            }
                    </Col>
                </Row>
            </Panel>
            <Panel header={<h2>个人中心作品配置</h2>} key="3">
                <Row gutter={24}>
                    <Col xl={4} lg={24} md={24} sm={24} xs={24}>
                    <h1 style={{textAlign:'right'}}>作品分类导航:</h1>
                    </Col>
                    <Col xl={20} lg={24} md={24} sm={24} xs={24}>
                            
                    {
                                list&&list.filter(item=>item.code.startWith('centerOpus')).map((i,k)=>{
                                        let name=i.name.substr(i.name.length-2,2)

                                        return       <Row gutter={24} style={{border:'1px solid #ddd'}} key={i.code}><InputForm code={i.code} title={`${name}-按钮`} msg='请输入文字' sourceValue='我的积分' key={i.code}></InputForm> </Row>
                                    
                                })
                            }
                    </Col>
                </Row>
            </Panel>
            <Panel header={<h2>其他配置</h2>} key="4">
                <Row gutter={24}>
                    <Col xl={4} lg={24} md={24} sm={24} xs={24}>
                        <h1 style={{textAlign:'right'}}>视频页面title名称:</h1>
                    </Col>
                    <Col xl={20} lg={24} md={24} sm={24} xs={24}>
                             {
                                list&&list.filter(item=>item.code.startWith('nav')).map((i,k)=>{
                                    if(i.code=='nav2Title'){
                                        return    <InputForm title="按钮-名称" msg='请输入文字' sourceValue='' key={i.code} code={i.code}></InputForm>
                                    }
                                })
                            }
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col xl={4} lg={24} md={24} sm={24} xs={24}>
                        <h1 style={{textAlign:'right'}}>活动页面title名称:</h1>
                    </Col>
                    <Col xl={20} lg={24} md={24} sm={24} xs={24}>
                    {
                                list&&list.filter(item=>item.code.startWith('nav')).map((i,k)=>{
                                    if(i.code=='nav3Title'){
                                        return    <InputForm title="按钮-名称" msg='请输入文字' sourceValue='' key={i.code} code={i.code}></InputForm>
                                    }
                                })
                            }
                    </Col>
                </Row>
            </Panel>
            </Collapse>
            </Card>
        </PageHeaderWrapper>)
    }
}

export default ButtonSet;
