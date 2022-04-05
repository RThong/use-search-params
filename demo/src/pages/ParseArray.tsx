import useSearchParams from '@/hooks/useSearchParams';
import { Button, message } from 'antd';
import { useEffect } from 'react';

/**
 */
const ParseArray = () => {
  const [query, setQuery] = useSearchParams(
    {
      ids: ['1', '2', '3'],
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

  return (
    <div>
      <p>1. 可以通过配置项来对数组类型的url查询参数进行自定义解析配置</p>

      <p>2. query数组类型只支持string[]类型的值</p>

      <p>
        3. 支持的数组解析方式参考：
        <a target="_blank" href="https://www.npmjs.com/package/query-string">
          query-string
        </a>
      </p>

      <Button
        onClick={() => {
          setQuery((q) => ({
            ids: Array(3)
              .fill(undefined)
              .map(() => Math.floor(Math.random() * 100))
              .map(String),
          }));
        }}
      >
        改变数组query
      </Button>
    </div>
  );
};

export default ParseArray;
