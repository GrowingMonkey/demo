import React, { PureComponent, Fragment } from 'react';
import {Card, List, Alert } from 'antd';
const {CDN_ADDRESS}=process.env;

import styles from '../../pages/Forms/ScanDetail/ScanDetail.less';
// import styles from './index.less';

function initTotalList(columns) {
  const totalList = [];
  columns.forEach(column => {
    if (column.needTotal) {
      totalList.push({ ...column, total: 0 });
    }
  });
  return totalList;
}

class StandardList extends PureComponent {
  constructor(props) {
    super(props);
    const { columns } = props;
    const needTotalList = initTotalList(columns);

    this.state = {
      selectedRowKeys: [],
      needTotalList,
    };
  }

  static getDerivedStateFromProps(nextProps) {
    // clean state
    // if (nextProps.selectedRows.length === 0) {
    //   const needTotalList = initTotalList(nextProps.columns);
    //   return {
    //     selectedRowKeys: [],
    //     needTotalList,
    //   };
    // }
    return null;
  }

  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    let { needTotalList } = this.state;
    needTotalList = needTotalList.map(item => ({
      ...item,
      total: selectedRows.reduce((sum, val) => sum + parseFloat(val[item.dataIndex], 10), 0),
    }));
    const { onSelectRow } = this.props;
    if (onSelectRow) {
      onSelectRow(selectedRows);
    }

    this.setState({ selectedRowKeys, needTotalList });
  };

  handleTableChange = (pagination, filters, sorter) => {
    const { onChange } = this.props;
    console.log(filters);
    if (onChange) {
      onChange(pagination, filters, sorter);
    }
  };

  cleanSelectedKeys = () => {
    this.handleRowSelectChange([], []);
  };

  render() {
    console.log(this.props);
    const { selectedRowKeys, needTotalList } = this.state;
    const { data = {}, rowKey, ...rest } = this.props;
    const { list = [], pagination } = data;
    console.log(data);
    console.log(list);
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: data.pageSize,
      total: data.count,
      ...pagination,
    };
    console.log(paginationProps);
    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
      getCheckboxProps: record => ({
        disabled: record.disabled,
      }),
    };
    return (
      <div className={styles.standardTable}>
        <div className={styles.tableAlert} />
        {/* <Table
          rowKey={rowKey || 'key'}
          // rowSelection={rowSelection}
          dataSource={list}
          pagination={paginationProps}
          onChange={this.handleTableChange}
          {...rest}
        /> */}
        <List 
            className={stylesProjects.coverCardList}
            rowKey="id"
            grid={{ gutter: 24, xxl: 3, xl: 2, lg: 2, md: 2, sm: 2, xs: 1 }}
            dataSource={videolist}
            renderItem={item => (
            <List.Item>
                <Card
                    className={stylesProjects.card}
                    hoverable
                    cover={<img src={`${CDN_ADDRESS?CDN_ADDRESS:'http://file-t.imuguang.com'}/${item.bgpUrl}`} style={{ height: 150 }}/>}>
                    <Card.Meta description={item.detail ? item.detail : '暂无资料'} />
                        <div className={stylesProjects.cardItemContent} style={{display:'flex',justifyContent:'space-between'}}>
                            <span>{moment(parseInt(item.createTime)).fromNow()}</span>
                            <span style={{textAlign:"right",color:"red"}} onClick={()=>this.handleModalVisible(true,item.id)}>打赏</span>
                        </div>
                </Card>
            </List.Item>
         )}
        />
      </div>
    );
  }
}

export default StandardList;
