import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import AvatarList from '@/components/AvatarList';
import Link from 'umi/link';
import router from 'umi/router';
import {
  Card,
  Row,
  Col,
  Icon,
  Avatar,
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
@connect(({ loading, user, project, list }) => ({
  listLoading: loading.effects['list/fetch'],
  currentUser: user.currentUser,
  currentUserLoading: loading.effects['user/fetchCurrent'],
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
  };

  componentDidMount() {
    const {
      dispatch,
      match: {
        params: { user },
      },
    } = this.props;
    dispatch({
      type: 'user/fetchInfo',
      payload: {
        user,
      },
    });
    dispatch({
      type: 'list/fetchP',
      payload: {
        id: user,
        type: 0,
      },
    });
    dispatch({
      type: 'list/fetchV',
      payload: {
        id: user,
        type: 2,
      },
    });
    dispatch({
      type: 'list/fetchA',
      payload: {
        id: user,
        type: 1,
      },
    });
    dispatch({
      type: 'list/fetchC',
      payload: {
        id: user,
        type: 3,
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

  render() {
    const itemMenu = (
      <Menu>
        <Menu.Item>
          <a target="_blank" rel="noopener noreferrer" href="https://www.alipay.com/">
            1st menu item
          </a>
        </Menu.Item>
        <Menu.Item>
          <a target="_blank" rel="noopener noreferrer" href="https://www.taobao.com/">
            2nd menu item
          </a>
        </Menu.Item>
        <Menu.Item>
          <a target="_blank" rel="noopener noreferrer" href="https://www.tmall.com/">
            3d menu item
          </a>
        </Menu.Item>
      </Menu>
    );
    const {
      list: { picturelist, videolist, articlelist, collectlist },
    } = this.props;
    console.log(this.props);
    const { newTags, inputVisible, inputValue } = this.state;
    const {
      listLoading,
      currentUser,
      currentUserLoading,
      project: { notice, likes },
      projectLoading,
      match,
      location,
      children,
    } = this.props;
    console.log(likes);
    const operationTabList = [
      {
        key: 'articles',
        tab: (
          <span>
            文章 <span style={{ fontSize: 14 }}>(8)</span>
          </span>
        ),
      },
      {
        key: 'applications',
        tab: (
          <span>
            应用 <span style={{ fontSize: 14 }}>(8)</span>
          </span>
        ),
      },
      {
        key: 'projects',
        tab: (
          <span>
            项目 <span style={{ fontSize: 14 }}>(8)</span>
          </span>
        ),
      },
    ];
    const IconText = ({ type, text }) => (
      <span>
        <Icon type={type} style={{ marginRight: 8 }} />
        {text}
      </span>
    );
    return (
      <PageHeaderWrapper title="用户详情">
        <GridContent className={styles.userCenter}>
          <Row gutter={24}>
            <Col lg={7} md={24}>
              <Card bordered={false} style={{ marginBottom: 24 }} loading={currentUserLoading}>
                {currentUser && Object.keys(currentUser).length ? (
                  <div>
                    <div className={styles.avatarHolder}>
                      <img alt="" src={currentUser.headUrl} />
                      <div className={styles.name}>{currentUser.name}</div>
                      <div>{currentUser.mail}</div>
                    </div>
                    <div className={styles.detail}>
                      <p>
                        <i />
                        {currentUser.roleNames}
                      </p>
                      <p>
                        <i />
                        {currentUser.phone}
                      </p>
                      <p>
                        <i />
                        {moment(parseInt(currentUser.createTime)).format('YYYY-MM-DD HH:mm:ss')}
                      </p>
                    </div>
                    <Divider dashed />
                    <div className={styles.tags}>
                      <div className={styles.tagsTitle}>标签</div>
                      <div className={styles.detail}>
                        <p>
                          <i />
                          被点赞&nbsp;&nbsp;{currentUser.likeCount}
                        </p>
                        <p>
                          <i />
                          被收藏&nbsp;&nbsp;{currentUser.tuckCount}
                        </p>
                        <p>
                          <i />
                          被评论&nbsp;&nbsp;{currentUser.arguedCount}
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
              <Card className={styles.tabsCard} bordered={false} loading={listLoading}>
                <Tabs defaultActiveKey="0">
                  <TabPane tab="图片" key="0">
                    <List
                      className={stylesProjects.coverCardList}
                      rowKey="id"
                      grid={{ gutter: 24, xxl: 3, xl: 2, lg: 2, md: 2, sm: 2, xs: 1 }}
                      dataSource={picturelist}
                      renderItem={item => (
                        <List.Item>
                          <Card
                            className={stylesProjects.card}
                            hoverable
                            cover={
                              <img
                                src={`http://file-t.imuguang.com/${item.bgpUrl}`}
                                style={{ height: 150 }}
                              />
                            }
                          >
                            <Card.Meta description={item.detail ? item.detail : '暂无详情'} />
                            <div className={stylesProjects.cardItemContent}>
                              <span>{moment(parseInt(item.createTime)).fromNow()}</span>
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
                      dataSource={articlelist}
                      renderItem={item => (
                        <List.Item>
                          <Card
                            className={stylesProjects.card}
                            hoverable
                            cover={
                              <img
                                src={`http://file-t.imuguang.com/${item.bgpUrl}`}
                                style={{ height: 150 }}
                              />
                            }
                          >
                            <Card.Meta description={item.detail ? item.detail : '暂无详情'} />
                            <div className={stylesProjects.cardItemContent}>
                              <span>{moment(parseInt(item.createTime)).fromNow()}</span>
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
                      dataSource={videolist}
                      renderItem={item => (
                        <List.Item>
                          <Card
                            className={stylesProjects.card}
                            hoverable
                            cover={
                              <img
                                src={`http://file-t.imuguang.com/${item.bgpUrl}`}
                                style={{ height: 150 }}
                              />
                            }
                          >
                            <Card.Meta description={item.detail ? item.detail : '暂无资料'} />
                            <div className={stylesProjects.cardItemContent}>
                              <span>{moment(parseInt(item.createTime)).fromNow()}</span>
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
                      dataSource={collectlist}
                      renderItem={item => (
                        <List.Item>
                          <Card
                            className={stylesProjects.card}
                            hoverable
                            cover={
                              <img
                                src={`http://file-t.imuguang.com/${item.bgpUrl}`}
                                style={{ height: 150 }}
                              />
                            }
                          >
                            <Card.Meta description={item.detail ? item.detail : '暂无详情'} />
                            <div className={stylesProjects.cardItemContent}>
                              <span>{moment(parseInt(item.createTime)).fromNow()}</span>
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
      </PageHeaderWrapper>
    );
  }
}
export default Center;
