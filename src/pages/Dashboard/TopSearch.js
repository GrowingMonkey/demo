import React, { memo } from 'react';
import { Row, Col, Table, Tooltip, Card, Icon, Form } from 'antd';
import { FormattedMessage } from 'umi-plugin-react/locale';

import Trend from '@/components/Trend';
import numeral from 'numeral';
import styles from './Analysis.less';
import NumberInfo from '@/components/NumberInfo';
import { MiniArea } from '@/components/Charts';

const FormItem = Form.Item;
const labelStyle = {
  display: 'inline-block',
  width: 80,
  textAlign: 'right',
  marginRight: 20,
};
const TopSearch = memo(({ loading, visitData2, searchData, dropdownGroup }) => (
  <Card loading={loading} bordered={false} title="公司信息" style={{ marginTop: 24 }}>
    <Row gutter={68}>
      <Col sm={24} xs={24} style={{ marginBottom: 24 }}>
        <div style={{ padding: '20px 0' }}>
          <label style={labelStyle}>公司:</label>
          <span>{visitData2}</span>
        </div>
        <div style={{ padding: '20px 0' }}>
          <label style={labelStyle}>类型:</label>
          <span>vivo</span>
        </div>
        <div style={{ padding: '20px 0' }}>
          <label style={labelStyle}>发布时间:</label>
          <span>vivo</span>
        </div>
        <div style={{ padding: '20px 0' }}>
          <label style={labelStyle}>生效周期:</label>
          <span>vivo</span>
        </div>
        <div style={{ padding: '20px 0' }}>
          <label style={labelStyle}>广告名:</label>
          <span>vivo</span>
        </div>
        <div style={{ padding: '20px 0' }}>
          <label style={labelStyle}>位置:</label>
          <span>vivo</span>
        </div>
      </Col>
    </Row>
  </Card>
));

export default TopSearch;
