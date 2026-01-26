import { lazy } from 'react';

const routes = [
    {
        path: '/',
        component: lazy(() => import('@/pages/home')),
        name: '首页'
    },
    {
        path: '/about',
        component: lazy(() => import('@/pages/about')),
        name: '关于'
    },
    {
        path: '/user',
        component: lazy(() => import('@/pages/user')),
        name: '用户中心',
        children: [
            {
                path: 'profile',
                component: lazy(() => import('@/pages/user/profile')),
                name: '个人资料'
            },
            {
                path: 'settings',
                component: lazy(() => import('@/pages/user/settings')),
                name: '账户设置'
            }
        ]
    }
];

export default routes;