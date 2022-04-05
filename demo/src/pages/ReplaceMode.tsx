import useSearchParams from '@/hooks/useSearchParams';
import { Button, message } from 'antd';
import { useEffect } from 'react';

/**
 * 基础使用
 */
export default function Base() {
  const [query, setQuery] = useSearchParams(
    {},
    {
      navigateMode: 'replace',
    },
  );

  useEffect(() => {
    message.success(`query变更: ${JSON.stringify(query)}`);
    console.log('query变更: ', query);
  }, [query]);

  return (
    <div>
      <p>
        设置navigateMode为replace模式，在变更query时不会在history中添加新的记录，可以通过浏览器的回退看到效果
      </p>

      <Button
        onClick={() => {
          setQuery((q) => ({
            count: Math.floor(Math.random() * 100),
          }));
        }}
      >
        改变query
      </Button>

      <div>query状态: {JSON.stringify(query)}</div>
    </div>
  );
}
