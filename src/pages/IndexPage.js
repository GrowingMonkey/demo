import React, { Component, Suspense } from 'react';
import { connect } from 'dva';
import { Row, Col, Icon, Menu, Dropdown, Card } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import { getTimeDistance } from '@/utils/utils';
import styles from './Dashboard/Analysis.less';
import PageLoading from '@/components/PageLoading';
import { ChartCard, MiniArea, MiniBar, MiniProgress, Field } from '@/components/Charts';

const IntroduceRow = React.lazy(() => import('./Dashboard/IntroduceRow'));
const SalesCard = React.lazy(() => import('./Dashboard/SalesCard'));
const TopSearch = React.lazy(() => import('./Dashboard/TopSearch'));
const ProportionSales = React.lazy(() => import('./Dashboard/ProportionSales'));
// const OfflineData = React.lazy(() => import('./Dashboard/OfflineData'));
const topColResponsiveProps = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 8,
  style: { marginBottom: 24},
};
@connect(({ chart, loading }) => ({
  chart,
  loading: loading.effects['chart/fetch'],
}))
class IndexPage extends Component {
  state = {
    salesType: 'all',
    currentTabKey: '',
    rangePickerValue: getTimeDistance('year'),
  };

  componentDidMount() {
    const { dispatch } = this.props;
    this.reqRef = requestAnimationFrame(() => {
      dispatch({
        type: 'chart/fetch',
      });
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'chart/clear',
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
      type: 'chart/fetchSalesData',
    });
  };

  selectDate = type => {
    const { dispatch } = this.props;
    this.setState({
      rangePickerValue: getTimeDistance(type),
    });

    dispatch({
      type: 'chart/fetchSalesData',
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
    const { chart, loading } = this.props;
    console.log(this.props);
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
      // 实用数据
      actCount,
      adCount,
      opusCount,
      opusTotal,
      regCount,
      regTotal,
      adLoginCount,
      adBannerCount,
      adBannerMonthCount,
      adLoginMonthCount,
      todayTagList,
      totalTagList,
      actRate,
      adBannerTotal,
      adLoginTotal,
      actOpusTotal,
      actOpusCount,
      vdOpusCount,
      vdOpusTotal,
      picOpusCount,
      picOpusTotal
    } = chart;
    const cardUpData = {
      actCount,
      adCount,
      opusCount,
      opusTotal,
      regCount,
      regTotal,
      actRate,
      adtotal: parseInt(adLoginCount) + parseInt(adBannerCount),
      adDownTotal: parseInt(adBannerTotal) + parseInt(adLoginTotal),
    };
    const mySalesData = [];
    todayTagList &&
      todayTagList.map((item, index) => {
        const obj = {};
        console.log(item);
        obj.x = item.name;
        obj.y = item.count;
        mySalesData.push(obj);
      });
    console.log(mySalesData);
    const mySalesData2 = totalTagList;
    const salesPieData = [];
    totalTagList &&
      totalTagList.map((item, index) => {
        const obj = {};
        console.log(item);
        obj.x = item.name;
        obj.y = item.count;
        salesPieData.push(obj);
      });
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

    return (
      <GridContent>
        <Suspense fallback={<PageLoading />}>
          <IntroduceRow loading={loading} visitData={cardUpData} />
        </Suspense>
        <Suspense fallback={null}>
          <SalesCard
            rangePickerValue={rangePickerValue}
            salesData={mySalesData}
            isActive={this.isActive}
            handleRangePickerChange={this.handleRangePickerChange}
            loading={loading}
            selectDate={this.selectDate}
          />
        </Suspense>
        <div className={styles.twoColLayout} style={{ marginBottom: 24,}}>
          <Row gutter={24}>
            <Col xl={12} lg={24} md={24} sm={24} xs={24}>
              <Suspense fallback={null}>
                <ProportionSales
                  dropdownGroup={dropdownGroup}
                  salesType={salesType}
                  loading={loading}
                  salesPieData={salesPieData}
                  handleChangeSalesType={this.handleChangeSalesType}
                />
              </Suspense>
            </Col>
            <Col xl={12} lg={24} md={24} sm={24} xs={24}>
              <Suspense fallback={null}>
                <div style={{ marginTop: 24,background:'#fff',padding:24 }} loading={loading}>
                  <div style={{display:'flex'}}>
                    <div><h1>作品发布量统计</h1></div>
                    <div style={{width:'75%',display:'flex',justifyContent:'space-between',fontSize:12,marginTop:8}}>
                      <div>当日发布量:{opusCount}&nbsp;&nbsp;总量:{opusTotal}</div>
                      <div style={{display:'flex',alignItems:'center'}}>
                        图片&nbsp;<i style={{width:2,height:12,background:'#3DD8A6',display:'inline-block'}}></i>&nbsp;
                        视频&nbsp;<i style={{width:2,height:12,background:'#816DF5 ',display:'inline-block'}}></i>&nbsp;
                        文章&nbsp;<i style={{width:2,height:12,background:'#E47387',display:'inline-block'}}></i>&nbsp;
                      </div>
                    </div>
                  </div>

                  <div style={{display:'flex',justifyContent: 'space-between',}}>
                    <div style={{background:'#3DD8A6 ',borderRadius:5,border:'1px solid #ddd',width:'30%',padding:8,height:100}}>
                    <p style={{textAlign:'right',marginBottom:0,color:'#fff'}}>今日发布量</p>
                    <p style={{textAlign:'right',marginBottom:0,color:'#fff'}}>{picOpusCount}</p>
                    <p style={{textAlign:'right',marginBottom:0,color:'#fff'}}>历史发布量</p>
                    <p style={{marginBottom:0,textAlign:'right',color:'#fff'}}>{picOpusTotal}</p>
                    </div>
                    <div style={{background:'#816DF5 ',borderRadius:5,border:'1px solid #ddd',width:'30%',padding:8,height:100}}>
                    <p style={{textAlign:'right',marginBottom:0,color:'#fff'}}>今日发布量</p>
                    <p style={{textAlign:'right',marginBottom:0,color:'#fff'}}>{vdOpusCount}</p>
                    <p style={{textAlign:'right',marginBottom:0,color:'#fff'}}>历史发布量</p>
                    <p style={{marginBottom:0,textAlign:'right',color:'#fff'}}>{vdOpusTotal}</p>
                    </div>
                    <div style={{background:'#E47387 ',borderRadius:5,border:'1px solid #ddd',width:'30%',padding:8,height:100}}>
                    <p style={{textAlign:'right',marginBottom:0,color:'#fff'}}>今日发布量</p>
                    <p style={{textAlign:'right',marginBottom:0,color:'#fff'}}>{actOpusCount}</p>
                    <p style={{textAlign:'right',marginBottom:0,color:'#fff'}}>历史发布量</p>
                    <p style={{marginBottom:0,textAlign:'right',color:'#fff'}}>{actOpusTotal}</p>
                    </div>
                  </div>
                </div>
                <div style={{ marginTop: 24 ,background:'#fff',padding:24 }}>
                  <div><h1>广告点击量统计</h1></div>
                  <div style={{display:'flex'}}>
                    <div style={{width:'25%'}}></div>
                    <div style={{padding:2,display:'flex',justifyContent:'space-around',width:'75%',borderBottom:'2px solid #ddd'}}>
                      <span>启动页</span><span>banner</span>
                    </div>
                  </div>
                  <div style={{display:'flex'}}>
                    <div style={{width:'25%',paddingRight:24,textAlign:'right'}}>点击量(日)</div>
                    <div style={{padding:2,display:'flex',justifyContent:'space-around',width:'75%',borderBottom:'2px solid #ddd'}}>
                      <span>{adLoginCount}</span><span>{adBannerCount}</span>
                    </div>
                  </div>
                  <div style={{display:'flex'}}>
                    <div style={{width:'25%',paddingRight:24,textAlign:'right'}}>点击量(月)</div>
                    <div style={{padding:2,display:'flex',justifyContent:'space-around',width:'75%',borderBottom:'2px solid #ddd'}}>
                      <span>{adLoginMonthCount}</span><span>{adBannerMonthCount}</span>
                    </div>
                  </div>
                  <div style={{display:'flex'}}>
                    <div style={{width:'25%',paddingRight:24,textAlign:'right'}}>总点击量</div>
                    <div style={{padding:2,display:'flex',justifyContent:'space-around',width:'75%',borderBottom:'2px solid #ddd'}}>
                      <span>{adLoginTotal}</span><span>{adBannerTotal}</span>
                    </div>
                  </div>
                </div>
              </Suspense>
            </Col>
          </Row>
        </div>
        <Suspense fallback={null}>
        <Row gutter={24}>
    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        title="日新增用户"
        loading={loading}
        total={() => <h6>1</h6>}
        footer={
          <Field
            label="用户总量"
            value={
              `3`
              // visitData.regTotal
            }
          />
        }
        contentHeight={46}
      />
    </Col>

    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        title="日活跃用户"
        loading={loading}
        total={() => <h6>2</h6>}
        footer={
          <Field
            label="用户活跃率"
            value={
              // `${numeral(visitData.actRate).format('0,0')}`
              `2%`
            }
          />
        }
        contentHeight={46}
      />
    </Col>
    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        title="日作品发布量"
        loading={loading}
        total={() => <h6>3</h6>}
        footer={
          <Field label="总作品发布量" value={`1`} />
        }
        contentHeight={46}
      />
    </Col>
  </Row>
        </Suspense>
        <Suspense fallback={null}>
        <Row gutter={24}>
    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        title="日新增用户"
        loading={loading}
        total={() => <h6>1</h6>}
        footer={
          <Field
            label="用户总量"
            value={
              `3`
              // visitData.regTotal
            }
          />
        }
        contentHeight={46}
      />
    </Col>

    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        title="日活跃用户"
        loading={loading}
        total={() => <h6>2</h6>}
        footer={
          <Field
            label="用户活跃率"
            value={
              // `${numeral(visitData.actRate).format('0,0')}`
              `2%`
            }
          />
        }
        contentHeight={46}
      />
    </Col>
    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        title="日作品发布量"
        loading={loading}
        total={() => <h6>3</h6>}
        footer={
          <Field label="总作品发布量" value={`1`} />
        }
        contentHeight={46}
      />
    </Col>
  </Row>
        </Suspense>
      </GridContent>
    );
  }
}

export default IndexPage;
