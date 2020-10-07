import { useEffect } from 'react';

const checkAtTheEnd = element => element.scrollHeight - element.scrollTop === element.clientHeight;

export default (ref, handler) => {
  useEffect(() => {
    const scrollHandle = event => {
      if (ref.current && checkAtTheEnd(ref.current)) {
        handler(event);
      }
    };
    ref.current.addEventListener('scroll', scrollHandle);

    return () => {
      ref.current.removeEventListener('scroll', scrollHandle);
    };
  });
};
