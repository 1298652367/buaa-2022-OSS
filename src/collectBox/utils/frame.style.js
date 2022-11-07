const style = `
  iframe.collectBoxFrame { 
    height: 100vh;
    margin: 0px;
    padding: 0px;
    position: fixed;
    right: 0;
    top: 0;
    width: 610px;
    z-index: 2147483647;
    overflow: hidden;
    background-color: transparent;
    color-scheme: light;   
    border: none;
    visibility: hidden;
  }
  .mask {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 10000; 
    opacity: 0; 
    background-color: rgba(0,0,0,.4);
  }
  @keyframes slideInRight {
    from {
      -webkit-transform: translate3d(100%, 0, 0);
      transform: translate3d(100%, 0, 0); 
      opacity: 0;
    }
    to {
      -webkit-transform: translate3d(0, 0, 0);
      transform: translate3d(0, 0, 0);
      opacity: 1;
    }
  }
  @keyframes slideOutRight {
    from {
      -webkit-transform: translate3d(0, 0, 0);
      transform: translate3d(0, 0, 0);
      visibility: visible;
      opacity: 1;
    }
    to {
      -webkit-transform: translate3d(100%, 0, 0);
      transform: translate3d(100%, 0, 0);
      visibility: hidden;
      opacity: 0;
    }
  }
  iframe.FrameUIComponentHidden {
    animation: slideOutRight 0.3s ease-out;    
    animation-fill-mode: forwards;
  } 
  iframe.FrameUIComponentVisible { 
    animation: slideInRight 0.3s ease-in;  
    visibility: visible; 
  }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }

  iframe.FrameUIComponentVisible + .mask{ animation: fadeIn 0.3s linear; animation-fill-mode: forwards; }
  iframe.FrameUIComponentHidden + .mask{ animation: fadeOut 0.3s linear; animation-fill-mode: forwards; }

  iframe.vimiumNonClickable {
    pointer-events: none;
  }

  @media (prefers-color-scheme: dark) { 
    iframe.reverseDarkReaderFilter {
      -webkit-filter: invert(100%) hue-rotate(180deg) !important;
      filter: invert(100%) hue-rotate(180deg) !important;
    }
    iframe.collectBoxFrame { 
    }
  }
  `
  .replace(/<\/?.+?>/g, '')
  .replace(/[\r\n]/g, '');

export default style;
