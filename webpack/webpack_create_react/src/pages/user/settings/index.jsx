import React from 'react'

const Settings = () => (
    <div className="settings-page">
        <h2>账户设置</h2>
        <div className="settings-content">
            <div className="settings-item">
                <label>密码修改：</label>
                <button className="btn-change-password">修改密码</button>
            </div>
            <div className="settings-item">
                <label>通知设置：</label>
                <div className="notification-options">
                    <label>
                        <input type="checkbox" defaultChecked /> 接收系统通知
                    </label>
                    <label>
                        <input type="checkbox" defaultChecked /> 接收邮件提醒
                    </label>
                </div>
            </div>
            <div className="settings-item">
                <label>账户安全：</label>
                <button className="btn-security">安全设置</button>
            </div>
        </div>
    </div>
)

export default Settings