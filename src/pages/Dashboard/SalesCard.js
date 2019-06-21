import React, { memo } from 'react';
import { Row, Col, Card, Tabs, DatePicker } from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import numeral from 'numeral';
import styles from './Analysis.less';
import { Bar } from '@/components/Charts';

const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

const rankingListData = [];
for (let i = 0; i < 7; i += 1) {
  rankingListData.push({
    title: formatMessage({ id: 'app.analysis.test' }, { no: i }),
    total: 323234,
  });
}

const SalesCard = memo(
  ({ rangePickerValue, salesData, isActive, handleRangePickerChange, loading, selectDate }) => (
    <Card loading={loading} bordered={false} bodyStyle={{ padding: 0 }}>
      <div className={styles.salesCard}>
        <Tabs>
          <TabPane tab="当日标签分类热度" key="views">
            <Row>
              <Col xl={24} lg={12} md={12} sm={24} xs={24}>
                <div className={styles.salesBar}>
                  <Bar height={292} data={salesData} />
                </div>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </div>
    </Card>
  )
);

export default SalesCard;
