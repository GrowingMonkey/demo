import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Badge, Table, Divider } from 'antd';
import DescriptionList from '@/components/DescriptionList';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './BasicProfile.less';

const { Description } = DescriptionList;

const progressColumns = [
  {
    title: '时间',
    dataIndex: 'time',
    key: 'time',
  },
  {
    title: '当前进度',
    dataIndex: 'rate',
    key: 'rate',
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: text =>
      text === 'success' ? (
        <Badge status="success" text="成功" />
      ) : (
        <Badge status="processing" text="进行中" />
      ),
  },
  {
    title: '操作员ID',
    dataIndex: 'operator',
    key: 'operator',
  },
  {
    title: '耗时',
    dataIndex: 'cost',
    key: 'cost',
  },
];

@connect(({ profile, loading }) => ({
  profile,
  loading: loading.effects['profile/fetchBasic'],
}))
class BasicProfile extends Component {
  componentDidMount() {
    const { dispatch, match, location } = this.props;
    const { query } = location;
    console.log(query);
    dispatch({
      type: 'profile/fetchBasic',
      payload: query.id || '1000000000',
    });
  }

  render() {
    console.log(this.props);
    const { profile = {}, loading } = this.props;
    // const { basicGoods = [], basicProgress = [], userInfo = {}, application = {} } = profile;
    let goodsData = [];
    let userInfo = {};
    userInfo = profile.data ? profile.data.user : [];
    goodsData = profile.data ? profile.data.data.list : [];
    const renderContent = (value, row, index) => {
      const obj = {
        children: value,
        props: {},
      };
      if (index === basicGoods.length) {
        obj.props.colSpan = 0;
      }
      return obj;
    };
    const goodsColumns = [
      {
        title: '被推荐用户名',
        dataIndex: 'regName',
        key: 'regName',
        // render: (text, row, index) => {
        //   if (index < basicGoods.length) {
        //     return <a href="">{text}</a>;
        //   }
        //   return {
        //     children: <span style={{ fontWeight: 600 }}>总计</span>,
        //     props: {
        //       colSpan: 4,
        //     },
        //   };
        // },
      },
      {
        title: '被推荐用户手机',
        dataIndex: 'regPhone',
        key: 'regPhone',
        // render: renderContent,
      },
      {
        title: '变动金额',
        dataIndex: 'money',
        key: 'money',
        // render: renderContent,
      },
      {
        title: '变动原因',
        dataIndex: 'reason',
        key: 'reason',
        align: 'right',
        // render: renderContent,
      },
      {
        title: '金额变动时间',
        dataIndex: 'createTime',
        key: 'createTime',
        align: 'right',
        // render: (text, row, index) => {
        //   if (index < basicGoods.length) {
        //     return text;
        //   }
        //   return <span style={{ fontWeight: 600 }}>{text}</span>;
        // },
      },
    ];
    return (
      <PageHeaderWrapper title="账户详情" loading={loading}>
        <Card bordered={false}>
          <Divider style={{ marginBottom: 32 }} />
          <DescriptionList size="large" title="用户信息" style={{ marginBottom: 32 }}>
            <Description term="用户姓名">{userInfo.name}</Description>
            <Description term="手机号码">{userInfo.phone}</Description>
            <Description term="账户余额">
              <span style={{ color: 'red' }}>{userInfo.money}</span>元
            </Description>
          </DescriptionList>
          <Divider style={{ marginBottom: 32 }} />
          <div className={styles.title} />
          <Table
            style={{ marginBottom: 24 }}
            pagination={false}
            loading={loading}
            dataSource={goodsData}
            columns={goodsColumns}
            rowKey="id"
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default BasicProfile;
