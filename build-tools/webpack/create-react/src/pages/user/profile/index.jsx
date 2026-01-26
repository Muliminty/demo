import React from 'react'

const Profile = () => (
    <div className="profile-page">
        <h2>个人资料</h2>
        <div className="profile-content">
            <div className="profile-item">
                <label>用户名：</label>
                <span>张三</span>
            </div>
            <div className="profile-item">
                <label>邮箱：</label>
                <span>zhangsan@example.com</span>
            </div>
            <div className="profile-item">
                <label>手机号：</label>
                <span>138****8888</span>
            </div>
        </div>
    </div>
)

export default Profile