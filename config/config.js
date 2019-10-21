// https://umijs.org/config/
import os from 'os';
import pageRoutes from './router.config';
import webpackPlugin from './plugin.config';
import defaultSettings from '../src/defaultSettings';
import slash from 'slash2';
const { pwa, primaryColor } = defaultSettings;
const { APP_TYPE,NODE_ENV,TEST,API_ENV} = process.env;
const sysConfig={
  aiyu:{
   API_ADDRESS:'http://www.aiyu2019.com',
   OPEN_ADDRESS_IOS:'https://aiyu-out.oss-cn-hongkong.aliyuncs.com/a/aiyu_v1.0.0.apk',
   OPEN_ADDRESS_ANDROID:'https://aiyu-out.oss-cn-hongkong.aliyuncs.com/a/aiyu_v1.0.0.apk',
   DOWN_ADDRESS_IOS:'https://aiyu-out.oss-cn-hongkong.aliyuncs.com/a/aiyu_v1.0.0.apk',
   DOWN_ADDRESS_ANDROID:'https://aiyu-out.oss-cn-hongkong.aliyuncs.com/a/aiyu_v1.0.0.apk',
   APP_NAME:'艾鱼',
   OSS_ADDRESS:'https://aiyu-out.oss-cn-hongkong.aliyuncs.com',
   OSS_IN_ADDRESS:'https://aiyu-in.oss-cn-hongkong.aliyuncs.com',
   CDN_ADDRESS:'https://aiyu-out.oss-cn-hongkong.aliyuncs.com',
   OSS_BURKET:'aiyu-out',
   OSS_END_POINT:'oss-cn-hongkong.aliyuncs.com'
  },
  muguang:{
    API_ADDRESS:'http://www.imuguang.com',
    OPEN_ADDRESS_IOS:'muGuang://com.dove.muGuang',
    OPEN_ADDRESS_ANDROID:'dove://com.imuguang',
    DOWN_ADDRESS_IOS:'https://apps.apple.com/cn/app/id1469181052?l=zh&ls=1',
    DOWN_ADDRESS_ANDROID:'https://sj.qq.com/myapp/detail.htm?apkName=com.dove.imuguang',
    APP_NAME:'目光',
    OSS_ADDRESS:'http://imuguang-file.oss-cn-shenzhen.aliyuncs.com',
    OSS_IN_ADDRESS:'http://imuguang-in.oss-cn-shenzhen.aliyuncs.com',
    CDN_ADDRESS:'https://f-bd.imuguang.com',
    DOVE_NAME:'四川鸽子科技',
    OSS_BURKET:'imuguang-file',
    OSS_END_POINT:'http://oss-cn-shenzhen.aliyuncs.com',
  }
}
console.log(sysConfig);
const plugins = [
  [
    'umi-plugin-react',
    {
      antd: true,
      dva: {
        hmr: true,
      },
      locale: {
        enable: true, // default false
        default: 'zh-CN', // default zh-CN
        baseNavigator: true, // default true, when it is true, will use `navigator.language` overwrite default
      },
      dynamicImport: {
        loadingComponent: './components/PageLoading/index',
        webpackChunkName: true,
        level: 3,
      },
      pwa: pwa
        ? {
            workboxPluginMode: 'InjectManifest',
            workboxOptions: {
              importWorkboxFrom: 'local',
            },
          }
        : false,
      ...(!TEST && os.platform() === 'darwin'
        ? {
            dll: {
              include: ['dva', 'dva/router', 'dva/saga', 'dva/fetch'],
              exclude: ['@babel/runtime', 'netlify-lambda'],
            },
            hardSource: false,
          }
        : {}),
    },
  ],
];

// 针对 preview.pro.ant.design 的 GA 统计代码
// 业务上不需要这个
if (APP_TYPE === 'site') {
  plugins.push([
    'umi-plugin-ga',
    {
      code: 'UA-72788897-6',
    },
  ]);
}

export default {
  // add for transfer to umi
  plugins,
  define: {
    APP_TYPE: APP_TYPE || '',
    APP_ENV:'1',
     'process.env': {
     NODE_ENV,
     API_ENV,
        ...(API_ENV=='aiyu'?sysConfig.aiyu:sysConfig.muguang)
      },
  },
  treeShaking: true,
  targets: {
    ie: 11,
  },
  // 路由配置
  routes: pageRoutes,
  // Theme for antd
  // https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': primaryColor,
  },
  proxy: {
    '/api/': {
      // target: 'http://www.imuguang.com/admin',//正式服
      target: 'http://test-admin.imuguang.com',
      // target: 'http://192.168.1.107:11111',
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    },
    '/adminapi/': {
      // target: 'http://www.imuguang.com/admin',//正式服
      target: 'http://www.aiyu2019.com',
      // target: 'http://192.168.1.107:11111',
      changeOrigin: true,
      pathRewrite: { '^/adminapi': '' },
    },
  },
  ignoreMomentLocale: true,
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  disableRedirectHoist: true,
  cssLoaderOptions: {
    modules: true,
    getLocalIdent: (context, localIdentName, localName) => {
      if (
        context.resourcePath.includes('node_modules') ||
        context.resourcePath.includes('ant.design.pro.less') ||
        context.resourcePath.includes('global.less')
      ) {
        return localName;
      }
      const match = context.resourcePath.match(/src(.*)/);
      if (match && match[1]) {
        const antdProPath = match[1].replace('.less', '');
        const arr = slash(antdProPath)
          .split('/')
          .map(a => a.replace(/([A-Z])/g, '-$1'))
          .map(a => a.toLowerCase());
        return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
      }
      return localName;
    },
  },
  manifest: {
    basePath: '/',
  },

  chainWebpack: webpackPlugin,
};
