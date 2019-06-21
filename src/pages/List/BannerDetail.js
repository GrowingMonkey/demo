import React, { Component, Suspense } from 'react';
import { connect } from 'dva';
import { Row, Col, Icon, Menu, Dropdown, Card } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import { getTimeDistance } from '@/utils/utils';
import styles from '../Dashboard/Analysis.less';
import PageLoading from '@/components/PageLoading';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Center from '../Account/Center/Projects';

const IntroduceRow = React.lazy(() => import('../Dashboard/IntroduceRow'));
const SalesCard = React.lazy(() => import('../Dashboard/SalesCard'));
const TopSearch = React.lazy(() => import('../Dashboard/TopSearch'));
const ProportionSales = React.lazy(() => import('../Dashboard/ProportionSales'));
const OfflineData = React.lazy(() => import('../Dashboard/OfflineData'));

@connect(({ formchart, loading }) => ({
  formchart,
  loading: loading.effects['formchart/fetch'],
}))
class BannerDetail extends Component {
  state = {
    salesType: 'all',
    currentTabKey: '',
    rangePickerValue: getTimeDistance('year'),
    pageData: {},
  };

  componentDidMount() {
    const {
      dispatch,
      history: {
        location: { params },
      },
    } = this.props;
    console.log(this.props);
    this.reqRef = requestAnimationFrame(() => {
      dispatch({
        type: 'formchart/fetch',
      });
    });
    this.setState({
      pageData: params,
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'formchart/clear',
    });
    cancelAnimationFrame(this.reqRef);
  }

  handleChangeSalesType = e => {
    this.setState({
      salesType: e.target.value,
    });
  };

  handleTabChange = key => {
    this.setState({
      currentTabKey: key,
    });
  };

  handleRangePickerChange = rangePickerValue => {
    const { dispatch } = this.props;
    this.setState({
      rangePickerValue,
    });

    dispatch({
      type: 'formchart/fetchSalesData',
    });
  };

  selectDate = type => {
    const { dispatch } = this.props;
    this.setState({
      rangePickerValue: getTimeDistance(type),
    });

    dispatch({
      type: 'formchart/fetchSalesData',
    });
  };

  isActive = type => {
    const { rangePickerValue } = this.state;
    const value = getTimeDistance(type);
    if (!rangePickerValue[0] || !rangePickerValue[1]) {
      return '';
    }
    if (
      rangePickerValue[0].isSame(value[0], 'day') &&
      rangePickerValue[1].isSame(value[1], 'day')
    ) {
      return styles.currentDate;
    }
    return '';
  };

  render() {
    const { rangePickerValue, salesType, currentTabKey } = this.state;
    const { formchart, loading } = this.props;
    const {
      visitData,
      visitData2,
      salesData,
      searchData,
      offlineData,
      offlineChartData,
      salesTypeData,
      salesTypeDataOnline,
      salesTypeDataOffline,
    } = formchart;
    let salesPieData;
    if (salesType === 'all') {
      salesPieData = salesTypeData;
    } else {
      salesPieData = salesType === 'online' ? salesTypeDataOnline : salesTypeDataOffline;
    }
    const menu = (
      <Menu>
        <Menu.Item>操作一</Menu.Item>
        <Menu.Item>操作二</Menu.Item>
      </Menu>
    );

    const dropdownGroup = (
      <span className={styles.iconGroup}>
        <Dropdown overlay={menu} placement="bottomRight">
          <Icon type="ellipsis" />
        </Dropdown>
      </span>
    );

    const activeKey = currentTabKey || (offlineData[0] && offlineData[0].name);
    const { pageData } = this.state;
    console.log(pageData);
    console.log(this.state);
    const labelStyle = {
      display: 'inline-block',
      width: 80,
      textAlign: 'right',
      marginRight: 20,
    };
    return (
      <PageHeaderWrapper title="广告详情">
        <GridContent>
          <div className={styles.twoColLayout}>
            <Row gutter={24}>
              <Col xl={8} lg={24} md={24} sm={24} xs={24}>
                <Suspense fallback={null}>
                  {/* <TopSearch
                  loading={loading}
                  visitData2={pageData}
                  selectDate={this.selectDate}
                  searchData={searchData}
                  dropdownGroup={dropdownGroup}
                /> */}
                  <Card
                    loading={loading}
                    bordered={false}
                    title="公司信息"
                    style={{ marginTop: 24 }}
                  >
                    <Row gutter={68}>
                      <Col sm={24} xs={24} style={{ marginBottom: 24 }}>
                        <div style={{ padding: '20px 0' }}>
                          <label style={labelStyle}>公司:</label>
                          <span>{pageData.comName ? pageData.comName : ''}</span>
                        </div>
                        <div style={{ padding: '20px 0' }}>
                          <label style={labelStyle}>类型:</label>
                          <span>{pageData.type}</span>
                        </div>
                        {/* <div style={{padding:'20px 0'}}>
          <label style={labelStyle}>发布时间:</label><span>vivo</span>
        </div> */}
                        <div style={{ padding: '20px 0' }}>
                          <label style={labelStyle}>生效周期:</label>
                          <span>vivo</span>
                        </div>
                        <div style={{ padding: '20px 0' }}>
                          <label style={labelStyle}>广告名:</label>
                          <span>{pageData.name}</span>
                        </div>
                        <div style={{ padding: '20px 0' }}>
                          <label style={labelStyle}>位置:</label>
                          <span>{pageData.location}</span>
                        </div>
                      </Col>
                    </Row>
                  </Card>
                </Suspense>
              </Col>
              <Col xl={16} lg={24} md={24} sm={24} xs={24}>
                <Suspense fallback={null}>
                  <Card
                    loading={loading}
                    bordered={false}
                    title="公司信息"
                    style={{ marginTop: 24 }}
                  >
                    <Row gutter={68}>
                      <Col sm={12} xs={24} style={{ marginBottom: 24 }}>
                        <div style={{ height: 305, display: 'flex', alignItems: 'center' }}>
                          <div>
                            <img />
                            <div>
                              <p>点击量</p>
                              <p>310000</p>
                            </div>
                          </div>
                        </div>
                      </Col>
                      <Col sm={12} xs={24} style={{ marginBottom: 24 }}>
                        <div style={{ height: 305, display: 'flex', alignItems: 'center' }}>
                          <div>
                            <img />
                            <div>
                              <p>点击量</p>
                              <p>310000</p>
                            </div>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </Card>
                </Suspense>
              </Col>
            </Row>
          </div>
          <Suspense fallback={null}>
            <Card style={{ marginTop: 24 }} loading={loading} bordered={false} title="广告页面">
              <div style={{ margin: '0 auto', display: 'flex', justifyContent: 'center' }}>
                <img src={pageData.content} style={{ width: 300, height: 'auto' }} />
              </div>
            </Card>
          </Suspense>
        </GridContent>
      </PageHeaderWrapper>
    );
  }
}

export default BannerDetail;
