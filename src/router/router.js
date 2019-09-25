import Vue from 'vue'
import Router from 'vue-router'

const User = {
    template: '<router-view></router-view>',
};
const Empty = {
    template: '<router-view></router-view>',
};

Vue.use(Router);

const routerLink = [
    {
        path: '/',
        redirect: {
            name: 'index'
        }
    },
    {
        path: '/index',
        name: 'index',
        component: resolve => require(['@/pages/index/index.vue'], resolve)
    },
    {
        path: '/login',
        name: 'login',
        component: resolve => require(['@/pages/login/login.vue'], resolve),
        meta: {
            showContainer: false
        }
    },
    {
        path: '/revisit/session/:id',
        name: 'revisit-session',
        component: resolve => require(['@/pages/revisit/session.vue'], resolve),
        meta: {
            showFooter: false
        }
    },
    {
        path: '/user',
        name: 'user',
        component: User,
        children: [
            {
                path: 'revisitList',
                name: 'user-revisitList',
                component: resolve => require(['@/pages/user/revisit-list.vue'], resolve),
                meta: {
                    requireAuth: true,
                    showAside: true
                }
            },

            {
                path: 'rtcRevisitList',
                name: 'user-rtcRevisitList',
                component: resolve => require(['@/pages/user/rtc-revisit-list.vue'], resolve),
                meta: {
                    requireAuth: true,
                    showAside: true
                }
            },

            {
                path: 'prescriptionList',
                name: 'user-prescriptionList',
                component: resolve => require(['@/pages/user/prescription-list.vue'], resolve),
                meta: {
                    requireAuth: true,
                    showAside: true
                }
            },

            {
                path: 'revisitPaper',
                name: 'user-revisitPaper',
                component: resolve => require(['@/pages/user/revisit-paper.vue'], resolve),
                meta: {
                    requireAuth: true,
                    showAside: true
                }
            },

            {
                path: 'info',
                name: 'user-info',
                component: resolve => require(['@/pages/user/info.vue'], resolve),
                meta: {
                    requireAuth: true,
                    showAside: true
                }
            }
        ]
    },
    {
        path: '/diseaseknowledge',
        name: 'diseaseknowledge',
        component: Empty,
        children: [
            {
                path: 'list',
                name: 'diseaseknowledge-list',
                component: resolve => require(['@/pages/diseaseknowledge/list.vue'], resolve)
            },
            {
                path: 'detail',
                name: 'diseaseknowledge-detail',
                component: resolve => require(['@/pages/diseaseknowledge/detail.vue'], resolve)
            },
        ]
    },
    {
        path: '/prescription',
        name: 'prescription',
        component: Empty,
        children: [
            {
                path: '/prescription/detail/:id',
                name: 'prescription-detail',
                component: resolve => require(['@/pages/prescription/detail.vue'], resolve)
            },
        ]
    },
    {
        path: '**',
        redirect: {
            name: 'index'
        }
    } // 错误路由
];

export default routerLink
