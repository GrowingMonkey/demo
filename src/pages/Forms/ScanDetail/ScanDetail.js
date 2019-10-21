import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import AvatarList from '@/components/AvatarList';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
const {CDN_ADDRESS}=process.env;
import Link from 'umi/link';
import router from 'umi/router';
import {
  Card,
  Row,
  Col,
  Icon,
  message,
  Avatar,
  Form,
  Modal,
  Tag,
  Divider,
  Spin,
  Input,
  Tabs,
  List,
  Tooltip,
  Dropdown,
  Menu,
} from 'antd';
const FormItem = Form.Item;
import ArticleListContent from '@/components/ArticleListContent';
import GridContent from '@/components/PageHeaderWrapper/GridContent';

import styles from './ScanDetail.less';
import stylesProjects from '@/pages/List/Projects.less';
import stylesApplications from '@/pages/List/Applications.less';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

const TabPane = Tabs.TabPane;
// function callback(key) {
//     console.log(key);
//   }
const CreateForm = Form.create()(props => {
  const { modalVisible, handleReward,form, handleAdd, handleModalVisible,formValues,opusId } = props;
  const okHandle = () => {
    console.log(props);
    form.validateFields((err, fieldsValue) => {
      console.log(fieldsValue);
      if (err) return;
      form.resetFields();
      let fieldsNewValue={
        ...fieldsValue,
        opusId:opusId
      }
      console.log(fieldsNewValue);
      handleReward(fieldsNewValue);
    });
  };
  return (
    <Modal
      destroyOnClose
      title="打赏"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    > 
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="积分打赏">
        {form.getFieldDecorator('point', {
          rules: [{ required: true, message: '请输入积分', min: 1 }],
        })(<Input placeholder="请输入积分" />)}
      </FormItem>
    </Modal>
  );
});



@connect(({ loading, user, project, list }) => ({
  listLoading: loading.effects['list/fetch','list/fetchOpus'],
  findUser: user.findUser,
  findUserLoading: loading.effects['user/fetchInfo'],
  project,
  projectLoading: loading.effects[('project/fetchNotice', 'project/fetchLike')],
  list,
}))
class Center extends React.Component {
  state = {
    newTags: [],
    inputVisible: false,
    inputValue: '',
    id: '',
    modalVisible: false,
    opusId:'',
    initTabKey:0
  };

  componentDidMount() {
    const {
      dispatch,
      match: {
        params: { user },
      },
    } = this.props;
    const {initTabKey}=this.state;
    dispatch({
      type: 'user/fetchInfo',
      payload: {
        user,
      },
    });
    dispatch({
      type: 'list/fetchOpus',
      payload: {
        id: user,
        type: initTabKey,
      },
    });

    dispatch({
      type: 'project/fetchNotice',
      payload: {
        id: user,
      },
    });
    dispatch({
      type: 'project/fetchLike',
      payload: {
        id: user,
      },
    });
  }

  componentDidUpdate(nextProps, prevState) {
    const {
      dispatch,
      match: {
        params: { user },
      },
    } = nextProps;
    const { id } = this.state.id;
    if (this.state.id != prevState.id) {
      const currentid = this.state.id;
      dispatch({
        type: 'user/fetchInfo',
        payload: {
          user: currentid,
        },
      });
      dispatch({
        type: 'list/fetchOpus',
        payload: {
          id: currentid,
          type: 0,
        },
      });
      dispatch({
        type: 'list/fetch',
        payload: {
          count: 8,
        },
      });
      dispatch({
        type: 'project/fetchNotice',
        payload: {
          id: currentid,
        },
      });
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const {
      dispatch,
      match: {
        params: { user },
      },
    } = nextProps;
    const { type } = nextProps;
    console.log(user);
    if (user != prevState.id) {
      console.log(1111);
      return {
        newTags: prevState.newTags,
        inputVisible: prevState.inputVisible,
        inputValue: prevState.inputValue,
        id: user,
        initTabKey:0
      };
    }
    return null;
  }

  handleChangeType(key) {
    const {
      dispatch,
      match: {
        params: { user },
      },
    } = this.props;
    dispatch({
      type: 'list/fetch',
      payload: {
        id: user,
        type: key,
      },
    });
  }

  handleClickAuthor(url) {
    // const {history}=this.props;
    this.props.history.push(`/form/scandetail/${url}`);
  }

  onTabChange = key => {
    const { match } = this.props;
    switch (key) {
      case 'articles':
        router.push(`${match.url}/articles`);
        break;
      case 'applications':
        router.push(`${match.url}/applications`);
        break;
      case 'projects':
        router.push(`${match.url}/projects`);
        break;
      default:
        break;
    }
  };

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
  };

  saveInputRef = input => {
    this.input = input;
  };

  handleInputChange = e => {
    this.setState({ inputValue: e.target.value });
  };
  handleReward=(fields)=>{
    const {dispatch}=this.props;
    dispatch({
      type:'user/reward',
      payload:{
        ...fields
      }
    })
    message.success('打赏成功');
    this.handleModalVisible();
  }
  handleModalVisible = (flag,id) => {
    console.log(111);
    this.setState({
      modalVisible: !!flag,
      opusId:id
    });
  };
  handleInputConfirm = () => {
    const { state } = this;
    const { inputValue } = state;
    let { newTags } = state;
    if (inputValue && newTags.filter(tag => tag.label === inputValue).length === 0) {
      newTags = [...newTags, { key: `new-${newTags.length}`, label: inputValue }];
    }
    this.setState({
      newTags,
      inputVisible: false,
      inputValue: '',
    });
  };
  jumpGradeDetail=()=>{
    const {dispatch,match}=this.props;
    const {params}=match;
    router.push(`/form/gradeinfo?id=${params.user}`);
  }
  handleChangeTags=(activeKey)=>{
    const {
      dispatch,
      match: {
        params: { user },
      },
    } = this.props;
    dispatch({
      type:'list/fetchOpus',
      payload: {
        id: user,
        type: activeKey,
      },
    })
    this.setState({
      initTabKey:activeKey,
    })
  }
  render() {
    const {
      list: { picturelist, videolist, articlelist, collectlist,talklist,opuslist},
    } = this.props;
    console.log(this.props);
    const { newTags, inputVisible, inputValue ,initTabKey} = this.state;
    const {
      listLoading,
      findUser,
      findUserLoading,
      project: { notice, likes },
      projectLoading,
      match,
      location,
      children,
    } = this.props;
    const {opusId,modalVisible}=this.state;
    const parentProps={
      handleModalVisible:this.handleModalVisible,
      handleReward:this.handleReward,
      opusId:opusId,
    }
    return (
      <PageHeaderWrapper title="用户详情">
        <GridContent className={styles.userCenter}>
          <Row gutter={24}>
            <Col lg={7} md={24}>
              <Card bordered={false} style={{ marginBottom: 24 }} loading={findUserLoading}>
                {findUser && Object.keys(findUser).length ? (
                  <div>
                    <div className={styles.avatarHolder}>
                      <img alt="" src={`${CDN_ADDRESS?CDN_ADDRESS:'https://f-bd.imuguang.com'}/${findUser.headUrl}`} style={{width:60,height:60,borderRadius:'50%'}}/>
                      <div className={styles.name}>{findUser.name}</div>
                      <div>{findUser.mail}</div>
                    </div>
                    <div className={styles.detail}>
                      <p>
                        <i />
                        {findUser.roleNames}
                      </p>
                      <p>
                        <i />
                        {findUser.phone}
                      </p>
                      <p>
                        <i />
                        {moment(parseInt(findUser.createTime)).format('YYYY-MM-DD HH:mm:ss')}
                      </p>
                    </div>
                    <Divider dashed />
                    <div className={styles.tags}>
                      {/* <div className={styles.tagsTitle}>标签</div> */}
                      <div className={styles.detail}>
                        <p>
                          <i />
                          被点赞&nbsp;&nbsp;{findUser.likeCount}
                        </p>
                        <p>
                          <i />
                          被收藏&nbsp;&nbsp;{findUser.tuckCount}
                        </p>
                        <p>
                          <i />
                          被评论&nbsp;&nbsp;{findUser.arguedCount}
                        </p>
                      </div>
                    </div>
                    <Divider dashed />
                    <div className={styles.tags}>
                      {/* <div className={styles.tagsTitle}>标签</div> */}
                      <div className={styles.detail}>
                        <p>
                          <i />
                          等级&nbsp;&nbsp;{findUser.level?findUser.level:0}
                        </p>
                        <p>
                          <i />
                          积分&nbsp;&nbsp;{findUser.point?findUser.point:0}
                        </p>
                        <p>
                          <i />
                          凝聚值&nbsp;&nbsp;{findUser.coagulation?findUser.coagulation:0}
                          <a style={{float:'right'}} onClick={()=>this.jumpGradeDetail()}>查看明细</a>
                        </p>
                      </div>
                    </div>
                    <Divider style={{ marginTop: 16 }} dashed />
                    <div className={styles.team}>
                      <div className={styles.teamTitle}>关注</div>
                      <Spin spinning={projectLoading}>
                        <Row gutter={36}>
                          {notice.map(item => (
                            <Col key={item.id} lg={12} xl={6}>
                              <a onClick={() => this.handleClickAuthor(item.id)}>{item.name}</a>
                            </Col>
                          ))}
                        </Row>
                      </Spin>
                    </div>
                    <Divider style={{ marginTop: 16 }} dashed />
                    <div className={styles.team}>
                      <div className={styles.teamTitle}>粉丝</div>
                      <Spin spinning={projectLoading}>
                        <Row gutter={36}>
                          {likes.map(item => (
                            <Col key={item.id} lg={12} xl={6}>
                              <a onClick={() => this.handleClickAuthor(item.id)}>{item.name}</a>
                            </Col>
                          ))}
                        </Row>
                      </Spin>
                    </div>
                  </div>
                ) : (
                  'loading...'
                )}
              </Card>
            </Col>
            <Col lg={17} md={24}>
              <Card className={styles.tabsCard} bordered={false} >
                <Tabs activeKey={initTabKey?initTabKey:'0'} onChange={(key)=>this.handleChangeTags(key)} loading={listLoading}>
                  <TabPane tab="图片" key="0">
                    <List
                      className={stylesProjects.coverCardList}
                      rowKey="id"
                      grid={{ gutter: 24, xxl: 3, xl: 2, lg: 2, md: 2, sm: 2, xs: 1 }}
                      dataSource={opuslist}
                      renderItem={item => (
                        <List.Item>
                          <Card
                            className={stylesProjects.card}
                            hoverable
                            cover={
                              <img
                                src={`${CDN_ADDRESS?CDN_ADDRESS:'https://f-bd.imuguang.com'}/${item.bgpUrl}`}
                                style={{ height: 150 }}
                              />
                            }
                          >
                            <Card.Meta description={item.detail ? item.detail : '暂无详情'} />
                            <div className={stylesProjects.cardItemContent} style={{display:'flex',justifyContent:'space-between'}}>
                              <span>{moment(parseInt(item.createTime)).fromNow()}</span>
                              <span style={{textAlign:"right",color:"red"}} onClick={()=>this.handleModalVisible(true,item.id)}>打赏</span>
                            </div>
                          </Card>
                        </List.Item>
                      )}
                    />
                  </TabPane>
                  <TabPane tab="文章" key="1">
                    <List
                      className={stylesProjects.coverCardList}
                      rowKey="id"
                      grid={{ gutter: 24, xxl: 3, xl: 2, lg: 2, md: 2, sm: 2, xs: 1 }}
                      dataSource={opuslist}
                      renderItem={item => (
                        <List.Item>
                          <Card
                            className={stylesProjects.card}
                            hoverable
                            cover={
                              <img
                                src={`${CDN_ADDRESS?CDN_ADDRESS:'https://f-bd.imuguang.com'}/${item.bgpUrl}`}
                                style={{ height: 150 }}
                              />
                            }
                          >
                            <Card.Meta description={item.detail ? item.detail : '暂无详情'} />
                            <div className={stylesProjects.cardItemContent} style={{display:'flex',justifyContent:'space-between'}}>
                              <span>{moment(parseInt(item.createTime)).fromNow()}</span>
                              <span style={{textAlign:"right",color:"red"}} onClick={()=>this.handleModalVisible(true,item.id)}>打赏</span>
                            </div>
                          </Card>
                        </List.Item>
                      )}
                    />
                  </TabPane>
                  <TabPane tab="视频" key="2">
                    <List
                      className={stylesProjects.coverCardList}
                      rowKey="id"
                      grid={{ gutter: 24, xxl: 3, xl: 2, lg: 2, md: 2, sm: 2, xs: 1 }}
                      dataSource={opuslist}
                      renderItem={item => (
                        <List.Item>
                          <Card
                            className={stylesProjects.card}
                            hoverable
                            cover={
                              <img
                                src={`${CDN_ADDRESS?CDN_ADDRESS:'https://f-bd.imuguang.com'}/${item.bgpUrl}`}
                                style={{ height: 150 }}
                              />
                            }
                          >
                            <Card.Meta description={item.detail ? item.detail : '暂无资料'} />
                            <div className={stylesProjects.cardItemContent} style={{display:'flex',justifyContent:'space-between'}}>
                              <span>{moment(parseInt(item.createTime)).fromNow()}</span>
                              <span style={{textAlign:"right",color:"red"}} onClick={()=>this.handleModalVisible(true,item.id)}>打赏</span>
                            </div>
                          </Card>
                        </List.Item>
                      )}
                    />
                  </TabPane>
                  <TabPane tab="收藏" key="3">
                    <List
                      className={stylesProjects.coverCardList}
                      rowKey="id"
                      grid={{ gutter: 24, xxl: 3, xl: 2, lg: 2, md: 2, sm: 2, xs: 1 }}
                      dataSource={opuslist}
                      renderItem={item => (
                        <List.Item>
                          <Card
                            className={stylesProjects.card}
                            hoverable
                            cover={
                              <img
                                src={`${CDN_ADDRESS?CDN_ADDRESS:'https://f-bd.imuguang.com'}/${item.bgpUrl}`}
                                style={{ height: 150 }}
                              />
                            }
                          >
                            <Card.Meta description={item.detail ? item.detail : '暂无详情'} />
                            <div className={stylesProjects.cardItemContent} style={{display:'flex',justifyContent:'space-between'}}>
                              <span>{moment(parseInt(item.createTime)).fromNow()}</span>
                              <span style={{textAlign:"right",color:"red"}} onClick={()=>this.handleModalVisible(true,item.id)}>打赏</span>
                            </div>
                          </Card>
                        </List.Item>
                      )}
                    />
                  </TabPane>
                  <TabPane tab="段子" key="4">
                    <List
                      className={stylesProjects.coverCardList}
                      rowKey="id"
                      grid={{ gutter: 24, xxl: 3, xl: 2, lg: 2, md: 2, sm: 2, xs: 1 }}
                      dataSource={opuslist}
                      renderItem={item => (
                        <List.Item>
                          <Card
                            className={stylesProjects.card}
                            hoverable
                            cover={
                              <img
                                src={`${CDN_ADDRESS?CDN_ADDRESS:'https://f-bd.imuguang.com'}/${item.bgpUrl}`}
                                style={{ height: 150 }}
                              />
                            }
                          >
                            <Card.Meta description={item.detail ? item.detail : '暂无详情'} />
                            <div className={stylesProjects.cardItemContent} style={{display:'flex',justifyContent:'space-between'}}>
                              <span>{moment(parseInt(item.createTime)).fromNow()}</span>
                              <span style={{textAlign:"right",color:"red"}} onClick={()=>this.handleModalVisible(true,item.id)}>打赏</span>
                            </div>
                          </Card>
                        </List.Item>
                      )}
                    />
                  </TabPane>
                </Tabs>
              </Card>
            </Col>
          </Row>
        </GridContent>
        <CreateForm {...parentProps} modalVisible={modalVisible}/>
      </PageHeaderWrapper>
    );
  }
}
export default Center;
