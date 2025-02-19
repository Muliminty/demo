import React from 'react'
import { Outlet, Link } from 'react-router-dom'

const User = () => (
    <div className="user-center">
        <h1>用户中心 （Outlet 嵌套路由）</h1>
        <nav>
            <ul>
                <li>
                    <Link to="profile">个人资料</Link>
                </li>
                <li>
                    <Link to="settings">账户设置</Link>
                </li>
            </ul>
        </nav>
        <div className="user-content">
            <Outlet />
        </div>
    </div>
)

export default User