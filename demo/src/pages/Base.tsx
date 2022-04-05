import useSearchParams from '@/hooks/useSearchParams';
import { Button, message } from 'antd';
import { useEffect } from 'react';

/**
 * 基础使用
 */
export default function Base() {
  const [query, setQuery] = useSearchParams();

  useEffect(() => {
    message.success(`query变更: ${JSON.stringify(query)}`);
    console.log('query变更: ', query);
  }, [query]);

  return (
    <div>
      <p>1. url查询参数会保存到query状态中, </p>

      <p>
        2. 可以通过setQuery来修改query的值, query的变更会自动保存到url查询参数中
      </p>

      <p>3. setQuery的值与当前url查询参数&quot;相同&quot;不会重新变更query</p>

      <p>4. 手动setQuery传入的number类型的query, 都会被转换成string类型</p>

      <Button
        onClick={() => {
          setQuery((q) => ({
            count: Math.floor(Math.random() * 100),
          }));
        }}
      >
        改变query
      </Button>

      <Button
        onClick={() => {
          setQuery((q) => ({
            ...q,
            count: q?.count ? Number(q.count) + 1 : 0,
          }));
        }}
      >
        回调形式修改query
      </Button>

      <Button
        onClick={() => {
          setQuery({
            ...JSON.parse(JSON.stringify(query)),
          });
        }}
      >
        改变成当前查询参数&quot;相同&quot;的query
      </Button>

      <div>query状态: {JSON.stringify(query)}</div>
    </div>
  );
}
