import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import 'braft-editor/dist/index.css';
import BraftEditor from 'braft-editor';
import { ContentUtils } from 'braft-utils'
import { ImageUtils } from 'braft-finder'
import { Upload } from 'antd'
import {
  Card,
  Form, 
  Input,
  Button,
  Icon
} from 'antd';
const FormItem = Form.Item;
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from '../Forms/style.less';

@connect(({ serviceset, loading }) => ({
  serviceset,
  submitting: loading.effects['form/submitRegularForm'],
}))
@Form.create()
class ServiceSet extends PureComponent {
  state = {
    editorState: BraftEditor.createEditorState(null)
  }
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
preview = () => {

  if (window.previewWindow) {
    window.previewWindow.close()
  }

  window.previewWindow = window.open()
  window.previewWindow.document.write(this.buildPreviewHtml())
  window.previewWindow.document.close()

}
handleChange = (editorState) => {
  console.log(this.state.editorState);
  this.setState({ editorState })
}
uploadHandler = (param) => {
  console.log('111');
  console.log(param);
  if (!param.file) {
    console.log('112')
    return false
  }
  //图片IMAGE
  //视频VIDEO
  //音频AUDIO
  
  this.setState({
    editorState: ContentUtils.insertMedias(this.state.editorState, [{
      type: 'AUDIO',
      url:  'www.1ting.com/api/audio?/2019/07/15X/15i_Lengao/01.mp3'
    }])
  })
}
buildPreviewHtml () {

  return `
    <!Doctype html>
    <html>
      <head>
        <title>Preview Content</title>
        <style>
          html,body{
            height: 100%;
            margin: 0;
            padding: 0;
            overflow: auto;
            background-color: #f1f2f3;
          }
          .container{
            box-sizing: border-box;
            width: 1000px;
            max-width: 100%;
            min-height: 100%;
            margin: 0 auto;
            padding: 30px 20px;
            overflow: hidden;
            background-color: #fff;
            border-right: solid 1px #eee;
            border-left: solid 1px #eee;
          }
          .container img,
          .container audio,
          .container video{
            max-width: 100%;
            height: auto;
          }
          .container p{
            white-space: pre-wrap;
            min-height: 1em;
          }
          .container pre{
            padding: 15px;
            background-color: #f1f1f1;
            border-radius: 5px;
          }
          .container blockquote{
            margin: 0;
            padding: 15px;
            background-color: #f1f1f1;
            border-left: 3px solid #d1d1d1;
          }
        </style>
      </head>
      <body>
        <div class="container">${this.state.editorState.toHTML()}</div>
      </body>
    </html>
  `

}
  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 3},
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
        // md: { span: 10 },
      },
    };
    const controls = [ 'undo', 'redo', 'separator',
    'font-size', 'line-height', 'letter-spacing', 'separator',
    'text-color', 'bold', 'italic', 'underline', 'strike-through', 'separator',
    'superscript', 'subscript', 'remove-styles', 'emoji',  'separator', 'text-indent', 'text-align', 'separator',
    'headings', 'list-ul', 'list-ol', 'blockquote', 'code', 'separator',
    'link', 'separator', 'hr', 'separator', 'separator',  'clear' ]
    const extendControls = [
      {
        key: 'antd-uploader',
        type: 'component',
        component: (
          <Upload
            accept="image/*"
            showUploadList={false}
            customRequest={this.uploadHandler}
          >
            {/* 这里的按钮最好加上type="button"，以避免在表单容器中触发表单提交，用Antd的Button组件则无需如此 */}
            <button type="button" className="control-item button upload-button" data-title="插入图片">
              <Icon type="picture" theme="filled" />
            </button>
          </Upload>
        )
      },
      {
        key: 'custom-button',
        type: 'button',
        text: '预览',
        onClick: this.preview
      }
    ]
    return (
      <PageHeaderWrapper title="活动发布">
        <Card bordered={false}>
          <div className="demo-container">
        <Form onSubmit={this.handleSubmit}>
          <FormItem {...formItemLayout} label="活动标题">
            {getFieldDecorator('title', {
              rules: [{
                required: true,
                message: '请输入标题',
              }],
            })(
              <Input size="large" placeholder="请输入标题"/>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="活动内容">
            {/* {getFieldDecorator('content', {
              validateTrigger: 'onBlur',
              rules: [{
                required: true,
                validator: (_, value, callback) => {
                  if (value.isEmpty()) {
                    callback('请输入正文内容')
                  } else {
                    callback(value)
                  }
                }
              }],
              initialValue:'请输入正文'
            })( */}
              <BraftEditor
                value={this.state.editorState}
                onChange={this.handleChange}
                className="my-editor"
                style={{border:'1px solid #ddd'}}
                controls={controls}
                placeholder="请输入正文内容"
                extendControls={extendControls}
              />
            {/* )} */}
          </FormItem>
          <FormItem {...formItemLayout}>
            <Button size="large" type="primary" htmlType="submit">提交</Button>
          </FormItem>
        </Form>
      </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default ServiceSet;
