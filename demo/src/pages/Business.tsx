import useSearchParams from '@/hooks/useSearchParams';
import { message, Select, Table } from 'antd';
import { mapValues } from 'lodash';
import { stringify } from 'query-string';
import React, { useEffect } from 'react';
import { useRequest } from 'umi';
import list from './data';

const getData = (query?: {
  page?: string;
  page_size?: string;
  status?: string;
}): Promise<{
  data: {
    results: {
      key: string;
      name: string;
      status: string;
      address: string;
    }[];
    total: number;
  };
}> =>
  new Promise((resolve) => {
    const page = query?.page ? Number(query.page) : 1;
    const page_size = query?.page_size ? Number(query.page_size) : 10;
    const status = query?.status ? query.status.split(',') : [];

    setTimeout(() => {
      const res = status.length
        ? list.filter((item) => status.includes(item.status))
        : list;

      resolve({
        data: {
          results: res.slice((page - 1) * page_size, page * page_size),
          total: res.length,
        },
      });
    }, 1000);
  });

const STATUS_CONFIG = [
  { label: '运行中', value: 'running' },
  { label: '失败', value: 'failed' },
  { label: '成功', value: 'success' },
];

const STATUS_TEXT_MAP = {
  running: '运行中',
  failed: '失败',
  success: '成功',
};

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    width: 300,
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 300,
    render: (_: any) => STATUS_TEXT_MAP[_ as keyof typeof STATUS_TEXT_MAP],
  },
  {
    title: 'Address',
    dataIndex: 'address',
  },
];

const Business = () => {
  const [query, setQuery] = useSearchParams(
    {
      page: 1,
      page_size: 10,
    },
    {
      stringifyOptions: { arrayFormat: 'comma' },
      parseOptions: { arrayFormat: 'comma' },
    },
  );

  useEffect(() => {
    message.success(`query变更: ${JSON.stringify(query)}`);
    console.log('query变更: ', query);
  }, [query]);

  const { data, loading } = useRequest(
    () =>
      getData(
        // 后端处理数组查询参数采用,分隔
        mapValues(query, (val) => (Array.isArray(val) ? val.join(',') : val)),
      ),
    {
      refreshDeps: [query],
    },
  );

  return (
    <div>
      <Select
        mode="multiple"
        options={STATUS_CONFIG}
        showSearch={false}
        allowClear
        showArrow
        style={{ width: 300 }}
        value={query?.status}
        onChange={(value: string[]) => {
          setQuery((q) => ({
            ...q,
            status: value,
            page: 1,
          }));
        }}
      />

      <Table
        rowKey="key"
        columns={columns}
        loading={loading}
        dataSource={data?.results}
        pagination={{
          current: query?.page ? Number(query.page) : 1,
          pageSize: query?.page_size ? Number(query.page_size) : 10,
          total: data?.total,
          showTotal: (total) => `共 ${total} 条`,
          position: ['bottomCenter'],
          showSizeChanger: true,
          onChange: (page, pageSize) => {
            setQuery((q) => ({
              ...q,
              page,
              page_size: pageSize,
            }));
          },
        }}
      />
    </div>
  );
};

export default Business;
