import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Row, Col } from 'antd';
import moment from 'moment';
import router from 'umi/router';
import styles from './CopllapseDetail.less';
import DescriptionList from '@/components/DescriptionList';
import{imgUrl}from '@/utils/utils'
const {Description }=DescriptionList;
class CopllapseDetail extends PureComponent {

  render() {
    console.log(this.props);
    const {datatype,infodata:{detail,name,phone,picList,tag,createTime,video,article}}=this.props;
    
    const taglist=tag?tag.split(','):[];
    // const listp=infodata.picList;
    // console.log(infodata);
    const myhtml =datatype==='article'&&article?article.content:'';
    const bg=datatype==='article'&&article?article.bgpUrl:'';
    const articleTemp = () => (
      <div className={styles.typeContainer}>
        <Row>
          <Col span={2}>
            <span>标题：</span>
          </Col>
          <Col span={22}>
            <div className={styles.title}>{article?article.title:''}</div>
          </Col>
        </Row>
        <Row>
          <Col span={2}>
            <span>封面：</span>
          </Col>
          <Col span={22}>
            
            <img
              src={imgUrl+'/'+bg}
              className={styles.cover}
            />
          </Col>
        </Row>
        <Row>
          <Col span={2}>
            <span>正文：</span>
          </Col>
          <Col span={22}>
            <div
              dangerouslySetInnerHTML={{
                __html: myhtml,
              }}
            />
          </Col>
        </Row>
      </div>
    );
    const videoTemp = () => (
      <div className={styles.typeContainer}>
        <Row>
          <Col span={2}>
            <span>视频：</span>
          </Col>
          <Col span={22}>
            <div className={styles.videoBox}>
              <video
                className={styles.myVideo}
                loop="loop"
                autoPlay="autoplay"
                src={`${imgUrl}/${video?video.videoUrl:''}`}
                id="video-tvc"
                data-object-fit
              >
                抱歉，您的浏览器不支持内嵌视频
              </video>
            </div>
          </Col>
        </Row>
        <Row>
          <Col span={2}>
            <span>说明：</span>
          </Col>
          <Col span={22}>
            
            <span className={styles.videoinfo}>
             {detail}
            </span>
          </Col>
        </Row>
      </div>
    );
    const pictureTemp = () => (
      <div className={styles.typeContainer}>
        <Row>
          <Col span={2}>
            <span>图片：</span>
          </Col>
          <Col span={22}>
            <DescriptionList style={{ marginBottom: -24 }}>
              {/* <Description term="用户姓名">付小小</Description>
            <Description term="会员卡号">32943898021309809423</Description>
            <Description term="身份证">3321944288191034921</Description>
            <Description term="联系方式">18112345678</Description>
            <Description term="联系地址">
              曲丽丽 18100000000 浙江省杭州市西湖区黄姑山路工专路交叉路口
            </Description> */}
    
              {picList&&picList.map((item,index)=>{
                return (<div className={styles.imgbox} key={index}>
                <img
                  src={`${imgUrl}/${item.displayUrl}`}
                />
              </div>)
              })}
            </DescriptionList>
          </Col>
        </Row>
        <Row>
          <Col span={2}>
            <span>说明：</span>
          </Col>
          <Col span={22}>
            
            <span className={styles.videoinfo}>{detail}</span>
          </Col>
        </Row>
        <Row>
          <Col span={2}>
            <span>标签：</span>
          </Col>
          <Col span={22}>
          {taglist&&taglist.map((ite,inde)=>{
            return (<span className={styles.tag} key={inde}>{ite}</span>)
          }
          )}
          </Col>
        </Row>
      </div>
    );
    const detailAera = key => {
      let temp;
      switch (key) {
        case 'article':
          temp = articleTemp();
          break;
        case 'videos':
          temp = videoTemp();
          break;
        case 'picture':
          temp = pictureTemp();
          break;
        default:
          break;
      }
      return temp;
    };
    return (
      <div className={styles.container}>
        <Card title="用户信息" bordered={false}>
          <div className={styles.anthorInfo}>
            <span>作者：{name}</span>
            <span>手机号：{phone}</span>
            <span>发布时间：{moment(parseInt(createTime)).format('YYYY-MM-DD HH:mm:ss')}</span>
          </div>
        </Card>
        <Card title="内容详情" bordered={false}>
          {detailAera(datatype)}
        </Card>
      </div>
    );
  }
}
export default CopllapseDetail;
