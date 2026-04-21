// import { useState, useEffect, useCallback } from 'react';

// export function useModalAnimation(isOpen: boolean, onClose: () => void) {
//   const [closing, setClosing] = useState(false);
//   const [shouldRender, setShouldRender] = useState(false);

//   useEffect(() => {
//     if (isOpen) {
//       setShouldRender(true);
//       setClosing(false);
//     }
//   }, [isOpen]);

//   const triggerClose = useCallback(() => {
//     setClosing(true);
//   }, []);

//   const handleAnimationEnd = useCallback(() => {
//     if (closing) {
//       setClosing(false);
//       setShouldRender(false);
//       onClose();
//     }
//   }, [closing, onClose]);

//   return { shouldRender, closing, triggerClose, handleAnimationEnd };
// }


import { useState, useEffect, useCallback, useRef } from 'react';

export function useModalAnimation(isOpen: boolean, onClose: () => void) {
  const [closing, setClosing] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  // 使用 ref 缓存最新的 onClose 函数，避免闭包陷阱和无意义的依赖更新
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setClosing(false);
    } else if (shouldRender) {
      // 核心修复 1：当外部将 isOpen 置为 false 时，自动触发离场动画
      setClosing(true);
    }
  }, [isOpen, shouldRender]);

  // 接收 React.AnimationEvent 作为参数
  const handleAnimationEnd = useCallback((e?: React.AnimationEvent) => {
    // 核心修复 2：防止子元素的动画事件冒泡导致提前触发
    if (e && e.target !== e.currentTarget) {
      return;
    }

    if (closing) {
      setClosing(false);
      setShouldRender(false);
      onCloseRef.current(); // 调用最新的 onClose
    }
  }, [closing]);

  // 保留 triggerClose 以兼容你原有的用法，但通常不再需要
  const triggerClose = useCallback(() => {
    setClosing(true);
  }, []);

  return { shouldRender, closing, triggerClose, handleAnimationEnd };
}