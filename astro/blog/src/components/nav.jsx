import React, { useState } from 'react';

const Nav = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className="bg-white shadow-md py-4 sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
                {/* Logo */}
                <div className="logo">
                    <a href="/" className="text-2xl font-bold text-gray-800 no-underline">我的博客</a>
                </div>

                {/* 移动端菜单按钮 */}
                <button
                    className="md:hidden bg-transparent border-0 cursor-pointer p-2"
                    onClick={toggleMenu}
                    aria-label="菜单"
                >
                    <div className="w-6 h-5 relative flex flex-col justify-between">
                        <span className={`w-full h-0.5 bg-gray-800 transition-all ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                        <span className={`w-full h-0.5 bg-gray-800 transition-all ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                        <span className={`w-full h-0.5 bg-gray-800 transition-all ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                    </div>
                </button>

                {/* 导航链接 */}
                <ul className={`md:flex md:items-center ${isMenuOpen ? 'block' : 'hidden'} absolute md:static top-full left-0 right-0 bg-white md:bg-transparent shadow-md md:shadow-none flex-col md:flex-row p-4 md:p-0 w-full md:w-auto`}>
                    <li className="md:ml-8 text-center md:text-left py-3 md:py-0">
                        <a href="/" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">首页</a>
                    </li>
                    <li className="md:ml-8 text-center md:text-left py-3 md:py-0">
                        <a href="/blog" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">博客</a>
                    </li>
                    <li className="md:ml-8 text-center md:text-left py-3 md:py-0">
                        <a href="/about" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">关于我</a>
                    </li>
                    <li className="md:ml-8 text-center md:text-left py-3 md:py-0">
                        <a href="/contact" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">联系我</a>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Nav;