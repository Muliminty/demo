import React from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const GsapReactDemo = () => {
  // 创建一个 ref 来引用动画元素
  const boxRef = React.useRef(null);
  const titleRef = React.useRef(null);
  const buttonRef = React.useRef(null);

  // 使用 useGSAP hook 来管理 GSAP 动画
  useGSAP(() => {
    // 初始状态（动画开始前的样式）
    gsap.set([boxRef.current, titleRef.current, buttonRef.current], {
      opacity: 0,
      y: 20
    });

    // 盒子动画
    gsap.to(boxRef.current, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power2.out",
      rotation: 360,
      backgroundColor: "#4CAF50",
      delay: 0.2
    });

    // 标题动画
    gsap.to(titleRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "back.out(1.7)",
      delay: 0.4
    });

    // 按钮动画
    gsap.to(buttonRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "elastic.out(1, 0.5)",
      delay: 0.6
    });

    // 悬停效果
    buttonRef.current.addEventListener('mouseenter', () => {
      gsap.to(buttonRef.current, {
        scale: 1.1,
        duration: 0.3
      });
    });

    buttonRef.current.addEventListener('mouseleave', () => {
      gsap.to(buttonRef.current, {
        scale: 1,
        duration: 0.3
      });
    });

    // 点击效果
    buttonRef.current.addEventListener('click', () => {
      gsap.to(boxRef.current, {
        x: 100,
        duration: 0.5,
        yoyo: true,
        repeat: 1
      });
    });
  }, []); // 空依赖数组表示只在组件挂载时运行一次

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundColor: '#f5f5f5'
    }}>
      <div
        ref={boxRef}
        style={{
          width: '150px',
          height: '150px',
          backgroundColor: '#2196F3',
          borderRadius: '8px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      />
      
      <h1 ref={titleRef} style={{ marginBottom: '20px', color: '#333' }}>
        GSAP + React 动画演示
      </h1>
      
      <button
        ref={buttonRef}
        style={{
          padding: '10px 20px',
          backgroundColor: '#FF5722',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '16px'
        }}
      >
        点击我有惊喜
      </button>
    </div>
  );
};

export default GsapReactDemo;