import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    {
      path: '/',
      component: '@/pages/index',
      routes: [
        { path: '/', redirect: '/base' },
        { path: '/base', component: './Base' },
        { path: '/replace', component: './ReplaceMode' },
        { path: '/init', component: './InitialQuery' },
        { path: '/array', component: './ParseArray' },
        { path: '/business', component: './Business' },
      ],
    },
  ],
  fastRefresh: {},
  publicPath: '/use-search-params/',
  base: '/use-search-params',
});
