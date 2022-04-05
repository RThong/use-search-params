import useSearchParams from '@/hooks/useSearchParams';
import { Button, message } from 'antd';
import { useEffect } from 'react';

/**
 * 通过initialQuery赋初值
 */
const InitialQuery = () => {
  const [query, setQuery] = useSearchParams({
    page: 1,
    page_size: 10,
  });

  useEffect(() => {
    message.success(`query变更: ${JSON.stringify(query)}`);
    console.log('query变更: ', query);
  }, [query]);

  return (
    <div>
      <p>给query赋初值会和初始url查询参数进行合并</p>
      <div>
        <Button
          onClick={() => {
            setQuery({
              q: 1,
            });
          }}
        >
          {`setQuery({q: 1})`}
        </Button>
      </div>
    </div>
  );
};

export default InitialQuery;
