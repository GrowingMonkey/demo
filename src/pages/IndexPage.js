import React, { Component, Suspense } from 'react';
import { connect } from 'dva';
import { Row, Col, Icon, Menu, Dropdown, Card } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import { Pie, WaterWave, Gauge, TagCloud } from '@/components/Charts';
import { getTimeDistance } from '@/utils/utils';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import numeral from 'numeral';
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
      picOpusTotal,
      inviteCount,
      inviteTotal,
      adContentCount,
      adContentTotal,
      pointVo,
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
      inviteCount,
      inviteTotal,
      
      pointVo,
      // opusPoint,
      // opusPointTotal,
      // extendPoint,
      // extendPointTotal
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
    const rankingListData=[{title:'公专路',total:3323},{title:'公专路',total:3323},{title:'公专路',total:3323},{title:'公专路',total:3323},]
    let arrlist=[];
    // const {pointVo}=chart;
    if(pointVo){
    arrlist.push({name:'活跃积分',daycount:pointVo.actCount,totalCount:pointVo.actTotal})
    arrlist.push({name:'发帖积分',daycount:pointVo.pubCount,totalCount:pointVo.pubTotal})
    arrlist.push({name:'点赞积分',daycount:pointVo.likeCount,totalCount:pointVo.likeTotal})
    arrlist.push({name:'评论积分',daycount:pointVo.commentCount,totalCount:pointVo.commentTotal})
    arrlist.push({name:'收藏积分',daycount:pointVo.collectCount,totalCount:pointVo.collectTotal})
    arrlist.push({name:'邀请积分',daycount:pointVo.inviteCount,totalCount:pointVo.inviteTotal})
    arrlist.push({name:'游戏总产出积分',daycount:pointVo.outputCount,totalCount:pointVo.outputTotal})
    arrlist.push({name:'游戏总回收积分',daycount:pointVo.recoverCount,totalCount:pointVo.recoverTotal})
    arrlist.push({name:'总产出积分',daycount:pointVo.allCount,totalCount:pointVo.allTotal})
    console.log(arrlist);
    console.log(pointVo);
    }
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
        <Row gutter={24}>
          <Col xl={16} lg={24} sm={24} xs={24} style={{ marginBottom: 24 }}>
            <Card
              title="广告统计"
              bordered={false}
              className={styles.pieCard}
            >
              <Row style={{ padding: '16px 0' }}>
                <Col span={8}>
                  <Pie
                  color="#4495F2"
                    animate={false}
                    percent={100}
                    total={parseInt(adLoginTotal/(adLoginTotal+adBannerTotal+adContentCount)*100)+'%'}
                    height={128}
                    lineWidth={2}
                  />
                  <div style={{fontSize:14,textAlign:"center"}}>启动广告页</div>
                  <div style={{fontSize:14,textAlign:"center",marginTop:62}}>
                    <p style={{fontSize:14,textAlign:"center"}}>点击量(今日):{adLoginCount}</p>
                    <p style={{fontSize:14,textAlign:"center",marginBottom:72}}>点击量(总量):{adLoginTotal}</p>
                  </div>
                </Col>
                <Col span={8}>
                  <Pie
                    animate={false}
                    color="#FFDE5B"
                    percent={100}
                    total={parseInt(adBannerTotal/(adLoginTotal+adBannerTotal+adContentCount)*100)+'%'}
                    height={128}
                    lineWidth={2}
                  />
                  <div style={{fontSize:14,textAlign:"center"}}>推荐页banner</div>
                  <div style={{fontSize:14,textAlign:"center",marginTop:62}}>
                    <p style={{fontSize:14,textAlign:"center"}}>点击量(今日):{adBannerCount}</p>
                    <p style={{fontSize:14,textAlign:"center",marginBottom:72}}>点击量(总量):{adBannerTotal}</p>
                  </div>
                </Col>
                <Col span={8}>
                  <Pie
                    animate={false}
                    color="#F95F5F"
                    percent={100}
                    total={100-parseInt(adLoginTotal/(adLoginTotal+adBannerTotal+adContentCount)*100)-parseInt(adBannerTotal/(adLoginTotal+adBannerTotal+adContentCount)*100)}
                    height={128}
                    lineWidth={2}
                  />
                  <div style={{fontSize:14,textAlign:"center"}}>内容页广告广告页</div>
                  <div style={{fontSize:14,textAlign:"center",marginTop:62}}>
                    <p style={{fontSize:14,textAlign:"center"}}>点击量(今日):{adContentCount}</p>
                    <p style={{fontSize:14,textAlign:"center",marginBottom:72}}>点击量(总量):{adContentTotal}</p>
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
          <Col xl={8} lg={12} sm={24} xs={24} style={{ marginBottom: 24 }}>
          <Card
              title="积分统计"
              bordered={false}
              className={styles.pieCard}
            >
            <div className={styles.salesRank}>
                  <ul className={styles.rankingList} style={{marginTop:4}}>
                      <li style={{marginTop:0}}>
                        <span></span>
                        <span className={styles.rankingItemTitle}>
                        </span>
                        <span  className={styles.rankingItemTitle} style={{fontWeight:'bold'}}>当日积分统计</span>
                        <span  className={styles.rankingItemTitle} style={{fontWeight:'bold'}}>总积分产出量</span>
                      </li>
                    {arrlist.map((item, i) => (
                      <li key={item.title}>
                        <span
                          className={`${styles.rankingItemNumber} ${i < 3 ? styles.active : ''}`}
                        >
                          {i + 1}
                        </span>
                        <span className={styles.rankingItemTitle} title={item.name}>
                          {item.name}
                        </span>
                        <span  className={styles.rankingItemTitle}>{numeral(item.daycount).format('0,0')}</span>
                        <span  className={styles.rankingItemTitle}>{numeral(item.totalCount).format('0,0')}</span>
                      </li>
                    ))}
                  </ul>
                </div>
            </Card>
          </Col>
        </Row>
      </GridContent>
    );
  }
}

export default IndexPage;
