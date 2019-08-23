export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', name: 'login', component: './User/Login' },
      { path: '/user/register', name: 'register', component: './User/Register' },
      {
        path: '/user/register-result',
        name: 'register.result',
        component: './User/RegisterResult',
      },
      {
        component: '404',
      },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    routes: [
      // dashboard
      { path: '/', redirect: '/dashboard/workmanage', authority: ['admin', 'user'] },
      {
        path: '/indexpage',
        icon: 'form',
        name: 'indexpage',
        component: './IndexPage',
      },
      {
        path: '/dashboard',
        name: 'dashboard',
        icon: 'dashboard',
        routes: [
          {
            path: '/dashboard/workmanage',
            name: 'workmanage',
            component: './Dashboard/WorkManage/WorkManage',
            routes: [
              {
                path: '/dashboard/workmanage',
                redirect: '/dashboard/workmanage/comments',
              },
              {
                path: '/dashboard/workmanage/comments',
                component: './Dashboard/WorkManage/Comments',
              },
              {
                path: '/dashboard/workmanage/pictures',
                component: './Dashboard/WorkManage/Pictures',
              },
              {
                path: '/dashboard/workmanage/videos',
                component: './Dashboard/WorkManage/Videos',
              },
              {
                path: '/dashboard/workmanage/articles',
                component: './Dashboard/WorkManage/Articles',
              },
              {
                path: '/dashboard/workmanage/talks',
                component: './Dashboard/WorkManage/Talks',
              },
            ],
          },
          {
            path: '/dashboard/commentmoderation',
            name: 'commentmoderation',
            component: './Dashboard/CommentModeration',
          },
          {
            path: '/dashboard/picturemoderation',
            name: 'picturemoderation',
            component: './Dashboard/PictureModeration',
          },
          {
            path: '/dashboard/videomoderation',
            name: 'videomoderation',
            component: './Dashboard/VideoModeration',
          },
          {
            path: '/dashboard/articlemoderation',
            name: 'articlemoderation',
            component: './Dashboard/ArticleModeration',
          },
          {
            path: '/dashboard/talkmoderation',
            name: 'talkmoderation',
            component: './Dashboard/TalkModeration',
          },
          // {
          //   path: '/dashboard/analysis',
          //   name: 'analysis',
          //   component: './Dashboard/Analysis',
          // },
          {
            path: '/dashboard/commondetail/:detailid',
            name: 'commondetail',
            hideInMenu: true,
            component: './Dashboard/CommonDetail/CommenDetail',
          },
          // {
          //   path: '/dashboard/monitor',
          //   name: 'monitor',
          //   component: './Dashboard/Monitor',
          // },
          // {
          //   path: '/dashboard/workplace',
          //   name: 'workplace',
          //   component: './Dashboard/Workplace',
          // },
        ],
      },
      // forms
      {
        path: '/form',
        icon: 'form',
        name: 'form',
        routes: [
          {
            path: '/form/authmanage',
            name: 'authmanage',
            hideInMenu:true,
            component: './Forms/AuthManage',
          },
          {
            path: '/form/counselee',
            name: 'counselee',
            component: './Forms/Counselee',
          },
          {
            path: '/form/counseleeset',
            name: 'counseleeset',
            hideInMenu:true,
            component: './Forms/CounseleeSet',
          },
          {
            path: '/form/userlist',
            name: 'userlist',
            component: './Forms/UserList',
          },
          {
            path: '/form/pointset',
            name: 'pointset',
            component: './Forms/PointSet',
          },
          {
            path: '/form/gradeset',
            name: 'gradeset',
            component: './Forms/GradeSet',
          },
          {
            path: '/form/gradeinfo',
            name: 'gradeinfo',
            hideInMenu: true,
            component: './Forms/GradeInfo',
          },
          {
            path: '/form/counseleedetail',
            name: 'counseleedetail',
            hideInMenu: true,
            component: './Forms/CounseleeDetail',
          },
          // {
          //   path: '/form/basic-form',
          //   name: 'basicform',
          //   component: './Forms/BasicForm',
          // },
          // {
          //   path: '/form/step-form',
          //   name: 'stepform',
          //   component: './Forms/StepForm',
          //   hideChildrenInMenu: true,
          //   routes: [
          //     {
          //       path: '/form/step-form',
          //       redirect: '/form/step-form/info',
          //     },
          //     {
          //       path: '/form/step-form/info',
          //       name: 'info',
          //       component: './Forms/StepForm/Step1',
          //     },
          //     {
          //       path: '/form/step-form/confirm',
          //       name: 'confirm',
          //       component: './Forms/StepForm/Step2',
          //     },
          //     {
          //       path: '/form/step-form/result',
          //       name: 'result',
          //       component: './Forms/StepForm/Step3',
          //     },
          //   ],
          // },
          {
            path: '/form/authormanage',
            name: 'authormanage',
            hideInMenu:true,
            component: './Forms/AuthorManage/AuthorManage',
            routes: [
              {
                path: '/form/authormanage',
                redirect: '/form/authormanage/applylist',
                // hideInMenu:true,
              },
              {
                path: '/form/authormanage/applylist',
                component: './Forms/AuthorManage/ApplyList',
              },
              {
                path: '/form/authormanage/settledauthor',
                component: './Forms/AuthorManage/SettledAuthor',
              },
              {
                path: '/form/authormanage/companyteam',
                component: './Forms/AuthorManage/CompanyTeam',
              },
            ],
          },
          {
            path: '/form/addauthor',
            component: './Forms/AddAuthor',
          },

          {
            path: '/form/addteam',
            component: './Forms/AddTeam',
          },
          {
            path: '/form/scandetail/:user',
            name: 'scandetail',
            hideInMenu: true,
            component: './Forms/ScanDetail/ScanDetail',
            // routes: [
            //   {
            //     path: '/form/scandetail/:user',
            //     redirect: '/account/scandetail/article',
            //   },
            //   {
            //     path: '/account/scandetail/article',
            //     component: './Forms/ScanDetail/Article',
            //   },
            //   {
            //     path: '/account/scandetail/picture',
            //     component: './Forms/ScanDetail/Picture',
            //   },
            //   {
            //     path: '/account/scandetail/video',
            //     component: './Forms/ScanDetail/Video',
            //   },
            // ],
          },
          // {
          //   path: '/form/advanced-form',
          //   name: 'advancedform',
          //   authority: ['admin'],
          //   component: './Forms/AdvancedForm',
          // },
        ],
      },
      // list
      {
        path: '/list',
        icon: 'table',
        name: 'list',
        routes: [
          {
            path: '/list/table-list',
            name: 'searchtable',
            component: './List/TableList',
          },
          {
            path: '/list/bannerform',
            name: 'bannerform',
            component: './List/BannerForm',
          },
          // {
          //   path: '/list/basic-list',
          //   name: 'basiclist',
          //   component: './List/BasicList',
          // },
          {
            path: '/list/bannerdetail',
            hideInMenu: true,
            name: 'bannerdetail',
            component: './List/BannerDetail',
          },
          // {
          //   path: '/list/card-list',
          //   name: 'cardlist',
          //   component: './List/CardList',
          // },
          // {
          //   path: '/list/search',
          //   name: 'searchlist',
          //   component: './List/List',
          //   routes: [
          //     {
          //       path: '/list/search',
          //       redirect: '/list/search/articles',
          //     },
          //     {
          //       path: '/list/search/articles',
          //       name: 'articles',
          //       component: './List/Articles',
          //     },
          //     {
          //       path: '/list/search/projects',
          //       name: 'projects',
          //       component: './List/Projects',
          //     },
          //     {
          //       path: '/list/search/applications',
          //       name: 'applications',
          //       component: './List/Applications',
          //     },
          //   ],
          // },
        ],
      },
      {
        path: '/profile',
        name: 'profile',
        icon: 'profile',
        routes: [
          // profile
          {
            path: '/profile/addgame',
            name: 'addgame',
            hideInMenu: true,
            component: './Profile/AddGame',
          },
          {
            path: '/profile/listgame',
            name: 'listgame',
            component: './Profile/ListGame',
          },
          {
            path: '/profile/activitymanager',
            name: 'activitymanager',
            component: './Profile/ActivityManager',
          },
          {
            path: '/profile/activitysend',
            name: 'activitySend',
            hideInMenu:true,
            component: './Profile/ActivitySend',
          },
          {
            path: '/profile/serviceset',
            name: 'serviceset',
            component: './Profile/ServiceSet',
          },
          {
            path: '/profile/pullsend',
            name: 'pullsend',
            component: './Profile/PullSend',
          },
          {
            path: '/profile/addtag',
            name: 'addtag',
            hideInMenu: true,
            component: './Profile/AddTag',
          },
          {
            path: '/profile/moneyprofile',
            name: 'moneyprofile',
            component: './Profile/MoneyProfile',
          },
          {
            path: '/profile/historymoney',
            name: 'historymoney',
            hideInMenu: true,
            component: './Profile/HistoryMoney',
          },
          {
            path: '/profile/accountflow',
            hideInMenu: true,
            name: 'accountflow',
            component: './Profile/AccountFlow',
          },
          {
            path: '/profile/tagmanager',
            // hideInMenu: true,
            name: 'tagmanager',
            component: './Profile/TagManager',
          },
          // {
          //   path: '/profile/basic',
          //   name: 'basic',
          //   component: './Profile/BasicProfile',
          // },
          // {
          //   path: '/profile/basic/:id',
          //   name: 'basic',
          //   hideInMenu: true,
          //   component: './Profile/BasicProfile',
          // },
          // {
          //   path: '/profile/advanced',
          //   name: 'advanced',
          //   authority: ['admin'],
          //   component: './Profile/AdvancedProfile',
          // },
        ],
      },
      // {
      //   name: 'result',
      //   icon: 'check-circle-o',
      //   path: '/result',
      //   routes: [
      //     // result
      //     {
      //       path: '/result/success',
      //       name: 'success',
      //       component: './Result/Success',
      //     },
      //     { path: '/result/fail', name: 'fail', component: './Result/Error' },
      //   ],
      // },
      // {
      //   name: 'exception',
      //   icon: 'warning',
      //   path: '/exception',
      //   routes: [
      //     // exception
      //     {
      //       path: '/exception/403',
      //       name: 'not-permission',
      //       component: './Exception/403',
      //     },
      //     {
      //       path: '/exception/404',
      //       name: 'not-find',
      //       component: './Exception/404',
      //     },
      //     {
      //       path: '/exception/500',
      //       name: 'server-error',
      //       component: './Exception/500',
      //     },
      //     {
      //       path: '/exception/trigger',
      //       name: 'trigger',
      //       hideInMenu: true,
      //       component: './Exception/TriggerException',
      //     },
      //   ],
      // },
      {
        name: 'account',
        icon: 'user',
        path: '/account',
        routes: [
          // {
          //   path: '/account/center',
          //   name: 'center',
          //   component: './Account/Center/Center',
          //   routes: [
          //     {
          //       path: '/account/center',
          //       redirect: '/account/center/articles',
          //     },
          //     {
          //       path: '/account/center/articles',
          //       component: './Account/Center/Articles',
          //     },
          //     {
          //       path: '/account/center/applications',
          //       component: './Account/Center/Applications',
          //     },
          //     {
          //       path: '/account/center/projects',
          //       component: './Account/Center/Projects',
          //     },
          //   ],
          // },
          // {
          //   path: '/account/settings',
          //   name: 'settings',
          //   component: './Account/Settings/Info',
          //   routes: [
          //     {
          //       path: '/account/settings',
          //       redirect: '/account/settings/base',
          //     },
          //     {
          //       path: '/account/settings/base',
          //       component: './Account/Settings/BaseView',
          //     },
          //     {
          //       path: '/account/settings/security',
          //       component: './Account/Settings/SecurityView',
          //     },
          //     {
          //       path: '/account/settings/binding',
          //       component: './Account/Settings/BindingView',
          //     },
          //     {
          //       path: '/account/settings/notification',
          //       component: './Account/Settings/NotificationView',
          //     },
          //   ],
          // },
          {
            path: '/account/scanbranch/:branchid',
            hideInMenu: true,
            name: 'scanbranch',
            component: './Account/ScanBranch/ScanBranch',
          },
          {
            path: '/account/scanstation/:stationid',
            hideInMenu: true,
            name: 'scanstation',
            component: './Account/ScanStation/ScanStation',
          },
          {
            path: '/account/usermanage',
            name: 'usermanage',
            component: './Account/UserManage',
          },
          {
            path: '/account/branch',
            name: 'branch',
            component: './Account/Branch/Branch',
            routes: [
              {
                path: '/account/branch',
                redirect: '/account/branch/branchlist',
              },
              {
                path: '/account/branch/branchlist',
                component: './Account/Branch/BranchList',
              },
              {
                path: '/account/branch/stationlist',
                component: './Account/Branch/StationList',
              },
            ],
          },
        ],
      },
      //  editor
      // {
      //   name: 'editor',
      //   icon: 'highlight',
      //   path: '/editor',
      //   routes: [
      //     {
      //       path: '/editor/flow',
      //       name: 'flow',
      //       component: './Editor/GGEditor/Flow',
      //     },
      //     {
      //       path: '/editor/mind',
      //       name: 'mind',
      //       component: './Editor/GGEditor/Mind',
      //     },
      //     {
      //       path: '/editor/koni',
      //       name: 'koni',
      //       component: './Editor/GGEditor/Koni',
      //     },
      //   ],
      // },
      {
        component: '404',
      },
    ],
  },
];
