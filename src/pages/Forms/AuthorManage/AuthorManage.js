import React, { Component } from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import { Input, Button, Icon } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './AuthorManage.less';

@connect()
class SearchList extends Component {
  handleTabChange = key => {
    const { match } = this.props;
    switch (key) {
      case 'applylist':
        router.push(`${match.url}/applylist`);
        break;
      case 'settledauthor':
        router.push(`${match.url}/settledauthor`);
        break;
      case 'companyteam':
        router.push(`${match.url}/companyteam`);
        break;
      default:
        break;
    }
  };

  handleFormSubmit = value => {
    // eslint-disable-next-line
    console.log(value);
  };

  handleButtonClick = key => {
    const { match } = this.props;
    console.log(this.props);
    console.log(key);
    switch (key) {
      case 'addAuthor':
        router.push(`/form/addauthor`);
        break;
      case 'addTeam':
        router.push(`/form/addteam`);
        break;
      default:
        break;
    }
  };

  render() {
    const tabList = [
      {
        key: 'applylist',
        tab: '申请列表',
      },
      {
        key: 'settledauthor',
        tab: '入驻作者',
      },
      {
        key: 'companyteam',
        tab: '作者团队',
      },
    ];
    const contents = (
      <div className={styles.pageHeaderContent}>
        <Button
          type="primary"
          icon="poweroff"
          onClick={this.handleButtonClick.bind(this, 'addAuthor')}
        >
          添加作者
        </Button>
        <Button
          type="danger"
          icon="poweroff"
          style={{ marginLeft: 24, backgroundColor: '#ff4d4f', color: '#fff' }}
          onClick={this.handleButtonClick.bind(this, 'addTeam')}
        >
          添加团队
        </Button>
      </div>
    );
    const mainSearch = (
      <div style={{ textAlign: 'center' }}>
        <Input.Search
          placeholder="请输入"
          enterButton="搜索"
          size="large"
          onSearch={this.handleFormSubmit}
          style={{ width: 522 }}
        />
      </div>
    );

    const { match, children, location } = this.props;
    return (
      <PageHeaderWrapper
        content={contents}
        tabList={tabList}
        tabActiveKey={location.pathname.replace(`${match.path}/`, '')}
        onTabChange={this.handleTabChange}
      >
        {children}
        {/* <Switch>
          {routes.map(item => (
            <Route key={item.key} path={item.path} component={item.component} exact={item.exact} />
          ))}
        </Switch> */}
      </PageHeaderWrapper>
    );
  }
}

export default SearchList;
