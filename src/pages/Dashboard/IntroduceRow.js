import React, { memo } from 'react';
import { Row, Col, Icon, Tooltip } from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import styles from './Analysis.less';
import { ChartCard, MiniArea, MiniBar, MiniProgress, Field } from '@/components/Charts';
import Trend from '@/components/Trend';
import numeral from 'numeral';
import Yuan from '@/utils/Yuan';

const topColResponsiveProps = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 8,
  style: { marginBottom: 24 },
};
const IntroduceRow = memo(({ loading, visitData }) => (
  <div>
    <Row gutter={24}>
    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        title="日新增用户"
        loading={loading}
        total={() => <h6>{visitData.regCount}</h6>}
        footer={
          <Field
            label="用户总量"
            value={
              `${numeral(visitData.regTotal).format('0,0')}`
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
        total={() => <h6>{visitData.actCount}</h6>}
        footer={
          <Field
            label="用户活跃率"
            value={
              // `${numeral(visitData.actRate).format('0,0')}`
              `${visitData.actRate  }%`
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
        total={() => <h6>{visitData.opusCount}</h6>}
        footer={
          <Field label="总作品发布量" value={`${numeral(visitData.opusTotal).format('0,0')}`} />
        }
        contentHeight={46}
      />
    </Col>
  </Row>
  <Row gutter={24}>
    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        title="作品激励积分(本周)"
        loading={loading}
        total={() => <h6>{visitData.pointVo?visitData.pointVo.opusPoint:0}</h6>}
        footer={
          <Field
            label="总收益:"
            value={
              `${numeral(visitData.pointVo?visitData.pointVo.opusPointTotal:0).format('0,0')}`
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
        title="师徒产生积分(本周)"
        loading={loading}
        total={() => <h6>{visitData.pointVo?visitData.pointVo.extendPoint:0}</h6>}
        footer={
          <Field
            label="总收益:"
            value={
              // `${numeral(visitData.actRate).format('0,0')}`
              `${visitData.pointVo?visitData.pointVo.extendPointTotal:0}`
            }
          />
        }
        contentHeight={46}
      />
    </Col>
    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        title="邀请注册人数(当日):"
        loading={loading}
        total={() => <h6>{visitData.pointVo?visitData.pointVo.inviteCount:0}</h6>}
        footer={
          <Field label="总邀请注册人数" value={`${numeral(visitData.pointVo?visitData.pointVo.inviteTotal:0).format('0,0')}`} />
        }
        contentHeight={46}
      />
    </Col>
  </Row>

  </div>
));

export default IntroduceRow;
