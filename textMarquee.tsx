import { useCallback, useEffect, useRef } from 'react';
import './textMarquee.scss';

const Marquee = ({ text }) => {
  const boxE = useRef<HTMLDivElement>(null);
  const contentE = useRef<HTMLDivElement>(null);
  const textE = useRef<HTMLParagraphElement>(null);
  let intervalId: NodeJS.Timeout;
  let textWidth: number;
  const judgeRoll = useCallback(() => {
    const boxWidth: number = boxE.current?.offsetWidth || 0;
    textWidth = textE.current?.offsetWidth || 0;
    if (textWidth <= boxWidth) return false;
    textE.current?.classList.add('padding');
    return true;

  }, [])
  const judgeVisible = useCallback(() => {
    const callback = (entries) => {
      entries.forEach(element => {
        if (element.isIntersecting) {
          console.log("start")
          toScrollLeft(textWidth);
        } else {
          console.log("stop", intervalId)
          clearInterval(intervalId);
        }

      });
    }
    const options = {
      root: null, // 使用视口作为根
      rootMargin: '0px',
      threshold: 0 // 元素进入或离开视口的阈值
    };
    const observer = new IntersectionObserver(callback, options);
    observer.observe(boxE.current);
  }, [])
  useEffect(() => {
    if (judgeRoll()) {
      judgeVisible();
    }
    return () => {
      clearTimeout(intervalId);
    }
  }, [text])

  const toScrollLeft = (textWidth2) => {
    clearInterval(intervalId);
    intervalId = setInterval(() => {
      // console.log('setTimeout')
      if (textWidth2 > boxE.current?.scrollLeft) {
        boxE.current.scrollLeft = boxE.current.scrollLeft + 1;
      } else {
        boxE.current.scrollLeft = 1;
      }
    }, 20)
    // console.log(intervalId)

  }
  return (
    <div className="marqueebox" ref={boxE}>
      <div className='marqueecontent' ref={contentE}>
        <p className='marqueetext' ref={textE} >{text}</p>
        <p className='marqueetext'  >{text}</p>
      </div>
    </div>
  );
};

export default Marquee;
