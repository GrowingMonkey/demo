import React, { memo } from 'react';
import { Card, Radio } from 'antd';
import { FormattedMessage } from 'umi-plugin-react/locale';
import styles from './Analysis.less';
import { Pie } from '@/components/Charts';
import Yuan from '@/utils/Yuan';

const ProportionSales = memo(
  ({ dropdownGroup, salesType, loading, salesPieData, handleChangeSalesType }) => (
    <Card
      loading={loading}
      className={styles.salesCard}
      bordered={false}
      title="标签分类总热度"
      bodyStyle={{ padding: 24 }}
      style={{ marginTop: 24 }}
    >
      <Pie
        hasLegend
        subTitle="标签点击总次数"
        total={() => <span>{salesPieData.reduce((pre, now) => now.y + pre, 0)}</span>}
        data={salesPieData}
        valueFormat={value => <span>{`${value  }次`}</span>}
        height={270}
        lineWidth={4}
        style={{ padding: '8px 0' }}
      />
    </Card>
  )
);

export default ProportionSales;
