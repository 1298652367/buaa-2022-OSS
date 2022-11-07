import BScroll from '@better-scroll/core';
import MouseWheel from '@better-scroll/mouse-wheel';
import Scrollbar from '@better-scroll/scroll-bar';
BScroll.use(MouseWheel);
BScroll.use(Scrollbar);

export default BScroll;
