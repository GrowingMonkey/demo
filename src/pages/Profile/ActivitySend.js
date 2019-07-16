import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
// import 'braft-editor/dist/index.css';
// import BraftEditor from 'braft-editor'
import {
  Card,
  Form, 
  Input,
  Button,
  Icon
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from '../Forms/style.less';

@connect(({ serviceset, loading }) => ({
  serviceset,
  submitting: loading.effects['form/submitRegularForm'],
}))
@Form.create()
class ServiceSet extends PureComponent {
//   state = {};
//   componentDidMount () {

//     // 异步设置编辑器内容
//     setTimeout(() => {
//       this.props.form.setFieldsValue({
//         content: BraftEditor.createEditorState('<p>Hello <b>World!</b></p>')
//       })
//     }, 1000)

//   }
//    handleSubmit = (event) => {

//     event.preventDefault()

//     this.props.form.validateFields((error, values) => {
//       if (!error) {
//         const submitData = {
//           title: values.title,
//           content: values.content.toRAW() // or values.content.toHTML()
//         }
//         console.log(submitData)
//       }
//     })

//   }
//   render() {
//     const { getFieldDecorator } = this.props.form;
//     const controls = ['bold', 'italic', 'underline', 'text-color', 'separator', 'link', 'separator', 'media' ]
//     return (
//       <PageHeaderWrapper title="活动发布">
//         <Card bordered={false}>
//           <div className="demo-container">
//         <Form onSubmit={this.handleSubmit}>
//           <FormItem {...formItemLayout} label="文章标题">
//             {getFieldDecorator('title', {
//               rules: [{
//                 required: true,
//                 message: '请输入标题',
//               }],
//             })(
//               <Input size="large" placeholder="请输入标题"/>
//             )}
//           </FormItem>
//           <FormItem {...formItemLayout} label="文章正文">
//             {getFieldDecorator('content', {
//               validateTrigger: 'onBlur',
//               rules: [{
//                 required: true,
//                 validator: (_, value, callback) => {
//                   if (value.isEmpty()) {
//                     callback('请输入正文内容')
//                   } else {
//                     callback()
//                   }
//                 }
//               }],
//             })(
//               <BraftEditor
//                 className="my-editor"
//                 controls={controls}
//                 placeholder="请输入正文内容"
//               />
//             )}
//           </FormItem>
//           <FormItem {...formItemLayout}>
//             <Button size="large" type="primary" htmlType="submit">提交</Button>
//           </FormItem>
//         </Form>
//       </div>
//         </Card>
//       </PageHeaderWrapper>
//     );
//   }
}

export default ServiceSet;
