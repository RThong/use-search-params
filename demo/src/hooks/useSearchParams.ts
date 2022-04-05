import { isEmpty, mapValues, omitBy, size } from 'lodash';
import type { ParseOptions, StringifyOptions } from 'query-string';
import { parse, stringify } from 'query-string';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import * as tmp from 'react-router';

// ignore warning `"export 'useHistory' (imported as 'rc') was not found in 'react-router'`
const rc = tmp as any;

type QueryType = Record<string, string | number | string[]>;
type ParsedParams = Record<string, string | string[]>;
/**
 * ?a= ?a=[] 过滤
 */
const filterInvalid = (obj: Record<string, unknown>) =>
  omitBy(
    obj,
    (val: unknown) =>
      val === undefined || JSON.stringify(val) === '[]' || val === '',
  );

/**
 * 比较两个对象里面的key value是否相等
 * 与key顺序无关
 */
const isShadowEqual = (
  a: Record<string, unknown> | undefined,
  b: Record<string, unknown> | undefined,
) => {
  if (isEmpty(a) && isEmpty(b)) return true;

  if (!a || !b) {
    return false;
  }

  // 为了处理数组查询参数中空数组的情况
  const x = filterInvalid(a);
  const y = filterInvalid(b);

  if (size(x) !== size(y)) {
    return false;
  }

  for (const key of Object.keys(y)) {
    if (!(key in x)) {
      return false;
    }
    // 使用JSON.stringify为了处理url中 ?status=a 实际为数组类型的情况
    if (JSON.stringify(x[key]) !== JSON.stringify(y[key])) {
      if (
        `[${JSON.stringify(x[key])}]` === JSON.stringify(y[key]) ||
        `[${JSON.stringify(y[key])}]` === JSON.stringify(x[key])
      ) {
        return true;
      }
      return false;
    }
  }
  return true;
};

/**
 * 过滤空对象query
 */
// eslint-disable-next-line no-undefined
const filterEmpty = (obj: ParsedParams | undefined) =>
  isEmpty(obj) ? undefined : obj;

/**
 * 将对象中value从数字转成字符串
 */
const transformObjValNumber2Str = (obj: QueryType | undefined) => {
  return obj
    ? mapValues(obj, (item) => (typeof item === 'number' ? String(item) : item))
    : undefined;
};

/**
 * 判断obj的key是都都在target中
 * @returns
 */
const isPartof = (obj: QueryType, target: ParsedParams) => {
  return !Object.keys(obj).some((key) => !(key in target));
};

function useSearchParams(
  initialQuery?: QueryType,
  options?: {
    parseOptions?: ParseOptions;
    stringifyOptions?: StringifyOptions;
    navigateMode?: 'replace' | 'push';
  },
) {
  const urlSearch = window.location.search;

  const initialQueryRef = useRef(initialQuery);
  // 为了依赖完整
  const optionsRef = useRef(options);

  // 当前使用的合并了initialQuery的查询参数对象
  const curSearchParams = useMemo(
    () =>
      filterEmpty({
        ...transformObjValNumber2Str(initialQueryRef.current),
        ...(parse(urlSearch, optionsRef.current?.parseOptions) as ParsedParams),
      }),
    [urlSearch],
  );

  const prevSearchParamsRef = useRef<ParsedParams>();

  const history = rc.useHistory?.();

  const [query, setQuery] = useState<ParsedParams | undefined>(curSearchParams);

  /**
   * 外部的setQuery实际都是去push url，再由url的变化去更新query
   */
  const changeQuery = useCallback(
    (val: React.SetStateAction<QueryType | undefined>) => {
      const temp = filterEmpty({
        ...transformObjValNumber2Str(initialQueryRef.current),
        ...transformObjValNumber2Str(
          typeof val === 'function' ? val(prevSearchParamsRef.current) : val,
        ),
      });

      if (!isShadowEqual(prevSearchParamsRef.current, temp)) {
        const navigateMode = optionsRef.current?.navigateMode ?? 'push';

        history[navigateMode]({
          search: stringify(temp ?? {}, optionsRef.current?.stringifyOptions),
        });
      }
    },
    [history],
  );

  /**
   * 当initialQuery设置的初始query不在当前url中时，使用history.replace需要更新url
   */
  useEffect(() => {
    const _innerInitialQuery = initialQueryRef.current;
    if (!_innerInitialQuery) {
      return;
    }
    if (
      !urlSearch ||
      !isPartof(
        _innerInitialQuery,
        parse(urlSearch, optionsRef.current?.parseOptions) as ParsedParams,
      )
    ) {
      history.replace({
        search: stringify(
          {
            ...transformObjValNumber2Str(_innerInitialQuery),
            ...(parse(
              urlSearch,
              optionsRef.current?.parseOptions,
            ) as ParsedParams),
          },
          optionsRef.current?.stringifyOptions,
        ),
      });
    }
  }, [urlSearch, history]);

  useEffect(() => {
    const _innerInitialQuery = initialQueryRef.current;

    // 当url查询参数中没有initialQuery时，等待history.replace后再更新query
    if (
      _innerInitialQuery &&
      urlSearch &&
      !isPartof(
        _innerInitialQuery,
        parse(urlSearch, optionsRef.current?.parseOptions) as ParsedParams,
      )
    ) {
      return;
    }

    if (!isShadowEqual(curSearchParams, prevSearchParamsRef.current)) {
      setQuery(curSearchParams);
      prevSearchParamsRef.current = curSearchParams;
    }
  }, [curSearchParams, urlSearch]);

  return [query, changeQuery] as const;
}
export default useSearchParams;
