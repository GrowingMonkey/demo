import React, { Component } from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import { Input } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

@connect()
class PullSet extends Component {
  handleTabChange = key => {
    const { match } = this.props;
    switch (key) {
      case 'pullopus':
        router.push(`${match.url}/pullopus`);
        break;
      case 'pullactivity':
        router.push(`${match.url}/pullactivity`);
        break;
      case 'pullbanner':
        router.push(`${match.url}/pullbanner`);
        break;
      case 'pullsettings':
        router.push(`${match.url}/pullsettings`);
        break;
      case 'pullbutton':
        router.push(`${match.url}/pullbutton`);
        break;
      case 'pulllogin':
        router.push(`${match.url}/pulllogin`);
        break;
      default:
        break;
    }
  };
  render() {
    const tabList = [
      {
        key: 'pullopus',
        tab: '作品',
      },
      {
        key: 'pullactivity',
        tab: '活动',
      },
      {
        key: 'pullbanner',
        tab: '广告',
      },
      {
        key: 'pullsettings',
        tab: '配置',
      },
      // {
      //   key: 'pullbutton',
      //   tab: '按钮',
      // },
      // {
      //   key: 'pulllogin',
      //   tab: '登录背景',
      // },
    ];
    const { match, children, location } = this.props;
    return (
      <PageHeaderWrapper
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

export default PullSet;
