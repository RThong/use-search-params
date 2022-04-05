import { Divider, Tabs } from 'antd';
import { FC } from 'react';
import { history, useLocation } from 'umi';

const { TabPane } = Tabs;

const routesList = [
  {
    path: '/base',
    title: '基础使用',
    key: 'base',
  },
  {
    path: '/replace',
    title: 'replace模式',
    key: 'replace',
  },
  {
    path: '/init',
    title: '设置初始值',
    key: 'init',
  },
  {
    path: '/array',
    title: '数组型查询参数',
    key: 'array',
  },
  {
    path: '/business',
    title: '业务demo',
    key: 'business',
  },
];

const Index: FC = (props) => {
  const handleLink = (route: string) => {
    history.push(`/${route}`);
  };
  const location = useLocation();
  console.log(location);

  const activeRoute = routesList.find(
    (item) => item.path === location.pathname,
  )?.key;

  return (
    <div>
      <div>
        <Tabs activeKey={activeRoute} type="line" onChange={handleLink}>
          {routesList.map(({ title, key }) => (
            <TabPane key={key} tab={title} />
          ))}
        </Tabs>
      </div>

      <h2 style={{ paddingLeft: 20, paddingTop: 20 }}>
        {routesList.find((item) => item.path === location.pathname)?.title}
      </h2>

      <Divider style={{ margin: '20px 0', borderColor: 'red' }} dashed />

      {props.children}
    </div>
  );
};

export default Index;
