<template>
  <div class="popup-wrap">
    <div class="top-content">
      <img
        class="close"
        @click="close"
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAiCAYAAAA+stv/AAABqklEQVRYR+2Vu07DQBBFZ3koKFCAREEKPgBokJAQHwAlraOkcuUkDa+G0nJJw6tJ4spVomxLCR+AIiHRAB9AEQokKCAi4rHIJAFj2d6ZNVIonNKZnXt8986YwYB/bMD6kAAkDvxfB3I5YzqVyjw5jvUSZ1J03RzrdFoT9bp9H9Qn0AHTNIeub+5aAOJ2dGR4rVYrP6hA5POlqde391MANjs/N5OxLOvD3yf0CjTN2BcA2wBwoQLxIw5LDOCAc3sH7UC/UNOMIwGw4UKMp9OrjnP4iHHCJ37Mub0Zdk4aQiqErm9NPrfbZwBfbx4p7kJJAdwiLARVHA2AgVARJwFEQaiKkwGCINxnlDtHj2FU2j2ZuOzVLWICRx7DaIhCWYAodm1kFc6rJcyI/okD3jvvNSTtCS8Eagy9B/yBc/9TWVb9niSAsLRj90SsDMhGTRUC5YBMPM63QwqAFVeFiASgiqtAhAKoilMhAgGEEEzLFs8BxLLqhvu9tlmTNyorjDGBWkRdgMIJY3DFG/auyob7diJr7AkBC7xRXUcDxBGknpVOAbUhtT4BSBz4BL3LHjJDG6Z/AAAAAElFTkSuQmCC"
      />
    </div>
    <Settings></Settings>
  </div>
</template>

<script>
import Settings from './components/Setting.vue';

export default {
  data() {
    return {};
  },
  components: { Settings },
  methods: {
    close() {
      window.close();
    },
  },
};
</script>

<style lang="scss">
body {
  margin: 0;
  padding: 0;
  background: #ededed;
}

.popup-wrap {
  padding-bottom: 30px;
  .ant-collapse-icon-position-right {
    > .ant-collapse-item {
      > .ant-collapse-header {
        padding: 4px 12px 4px 16px;
      }
    }
  }
  .ant-collapse-content > .ant-collapse-content-box {
    padding: 0;
  }
  .ant-switch-checked {
    background-color: #d2eafe;
    box-shadow: none !important;
    outline: none !important;
  }
  .ant-switch-checked:after {
    background-color: #1a87ff;
  }
  .ant-switch,
  .ant-switch:after {
    box-shadow: none !important;
    outline: none !important;
  }
}

.popup-wrap {
  width: 400px;
  // height: 100%;
  background: #ededed;
  .disabled-text {
    border: 1px solid #ffd77a;
    background-color: #fff9e6;
    line-height: 30px;
    text-align: center;
    bottom: 0;
    position: fixed;
    font-size: 13px;
    width: 100%;
  }
  .top-content {
    padding: 10px 16px;
    padding-top: 12px;
    font-size: 0;
    right: 0;
    top: 0;
    margin-bottom: 24px;
    img {
      width: 32px;
      height: 32px;
      vertical-align: middle;
    }
    > img.close {
      position: absolute;
      right: 7px;
      top: 16px;
      width: 27px;
      height: 27px;
      padding: 4px;
      user-select: none;
      cursor: pointer;
    }
    span {
      height: 22px;
      font-size: 17px;
      font-weight: 500;
      vertical-align: middle;
      color: #000000;
      line-height: 22px;
      letter-spacing: 1px;
    }
  }
}

@media (prefers-color-scheme: dark) {
  body {
    background: #383838;
  }
  .popup-wrap {
    background: #383838;
    .top-content {
      .navs {
        background: rgba(222, 222, 222, 0.45);
        .active-bar {
          background: #353535;
        }
        .nav-item {
          span {
            color: #d6d6d6;
          }
          &.active {
            span {
              color: #ffffff;
            }
          }
        }
      }
      .img.close {
        filter: brightness(2.5);
      }
    }
  }
}
</style>
