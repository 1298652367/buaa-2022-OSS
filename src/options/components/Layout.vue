<template>
  <div class="main">
    <div class="content">
      <div class="left-content">
        <p class="title">设置</p>
        <div class="settings-menu-left">
          <div class="search-box">
            <ul class="search-list-result" v-show="searchTxt && searchResult.length && isFocus">
              <li @click="pushRoute(search.routeName)" v-for="search in searchResult" :key="search.routeName">
                {{ search.name }}
              </li>
            </ul>
            <div class="clear-icon" v-show="searchTxt" @click="searchTxt = ''"></div>
          </div>
          <Menu :list="NavConfig.list" @pushRoute="pushRoute"></Menu>
        </div>
      </div>
      <div class="right-content">
        <slot name="page"></slot>
      </div>
    </div>
  </div>
</template>

<script>
import NavConfig from '../utils/nav';
import Menu from './menu';

export default {
  data() {
    return {
      isFocus: false,
      NavConfig,
      searchTxt: '',
      searchResult: [],
      current: ['Index'],
    };
  },
  components: {
    Menu,
  },
  mounted() {
    document.addEventListener('click', this.documentEvent);
  },
  beforeDestroy() {
    document.removeEventListener(this.documentEvent);
  },
  methods: {
    documentEvent() {
      this.isFocus = false;
    },
    inputFocus(e) {
      e.stopPropagation();
      e.preventDefault();
      this.isFocus = true;
    },
    pushRoute(name) {
      if (name === this.$route.name) return;
      this.$router.push({ name });
    },
    searchRouter() {
      const searchTxt = this.searchTxt;
      this.searchResult = NavConfig.search(searchTxt);
    },
  },
};
</script>

<style lang="scss">
.main {
  background: rgb(247, 247, 247);

  .white-card {
    background: #fff;
    margin-bottom: 16px;
    padding: 16px 24px;
    border-radius: 8px;
    box-shadow: 0 0 5px 0px #e0e0e0;
    > h4 {
      margin-bottom: 30px;
    }
    .tips {
      margin-left: 16px;
      font-size: 14px;
    }
  }
  .content {
    display: flex;
    width: 100%;
    min-height: 100vh;
    justify-content: space-between;
    padding-left: 320px;
    .left-content {
      position: fixed;
      overflow-y: auto;
      overflow-x: hidden;
      left: 0;
      height: 100vh;
      background: #fff;
      width: 320px;
      border-right: 1px solid #c3c3c3;
      > p.title {
        width: 100%;
        margin: 30px 10% 10px 10%;
        font-size: 18px;
        font-weight: bold;
      }
      // .ant-menu-sub .ant-menu-item:hover {
      //   & {
      //     background: #fff;
      //     span {
      //       font-weight: 600;
      //     }
      //   }
      // }
      > .settings-menu-left {
        margin: 0 auto;
        width: 100%;

        .ant-menu {
          width: 100% !important;
        }

        .search-box {
          position: relative;

          .search-list-result {
            list-style: none;
            position: absolute;
            z-index: 10;
            top: 35px;
            padding: 0;
            width: 100%;
            margin: 0;
            background-color: #fff;
            border: 1px solid #b3b3b3;
            border-top: none;

            li {
              padding: 6px 16px;
              border-top: 1px solid #b3b3b3;
              transition: all 0.3s;
              cursor: pointer;

              &:first-child {
                border-top: none;
              }

              &:hover {
                background: rgb(229, 229, 229);
              }

              img {
                width: 16px;
                height: 16px;
                position: absolute;
                left: 10px;
                top: 50%;
                transform: translateY(-50%);
              }
            }
          }

          .clear-icon {
            background-repeat: no-repeat;
            width: 16px;
            height: 16px;
            position: absolute;
            padding: 3px;
            cursor: pointer;
            right: 10px;
            background-size: 100%;
            top: 50%;
            transform: translateY(-50%);
            background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAADuklEQVRYR+2WW2hcRRjH/99JNpGAkUUKFp/7oOCTT7GEVotSRLw8VPtgNNayki7ZmTFNRMFEBYsll/nm7CZesBoUVNoXW1EfFGqtIlZKLdQLiojWB0GwbvFGknM+Gdgtp+vZs2d9CUIHDgfOd/vNN/+ZM4R1HrTO9XEJ4P/XAaXUDiLaAcC/z4nIOQD++V5EDq+urr65tLT0e15t5e6A1rpMRBMiUgTwAYBjAM6IyBVEVPTfiWgYwE0AjgRBsH9hYeF0J5COAMaYq0VkP4BbRGSsXq+/vby8/He7xEqp24ioBOA6EbnfOfdhFkQmgFLqdiJ6GcCPIlJyzn3WaUZNu1LqHiJ6gYjutda+1S4uE0BrfRRAnYh2WWt/zVs8ATFJRJOFQmFodnb2u7T4tgDGmD0iMh3H8XAYht92W7zpr7WuiQg558q5AcbHxzcEQfAJEdWYmRPJjorIknPuUFqyiYmJa6MoWmTmG5N2rbWf/YPM7MV70UjtgFLqPiIaYeabk95KqWkielJE7m6FaBQ/6HcGM+9sAXgOwEZmviMvwAKAs8452xqgtX4UwL4kRLM4EZ2y1o60xhhjtovIMjNflQvAGPM+gKq19nBaq7XWewHMeoje3t4voig6SEQnrLW72mlFa/1LT0/P8Pz8/NdJn9Ql0FrX4zjeHIbhmXYJjTFKRLw+zgJ4l5kfyhKq31FE9Ky11i/ThdEO4Cci2mSt/atd0kbbfac2pmkiZelOxnF8KAzDZ/IAeNpHrLUnMtTuZ+IBvgTwfBZEqVQqDAwM/BnH8UgYhm/kATggIj84555qBUio3bd90tuNMQ+IyEvtILTWmwF8tLa2dk2tVsulgRkAQ8y8PQmQKH6EmR9r2Wpe/a+kQSil9gAYcc4N5doF5XL5ykKhcDKKom3VavXCEdo4mo8z83Ta0hhjdorI68x8kba01u8B+JiZn8gF4J201hrAFma+K0vdnWyNPLujKLqhWq2ezw0wMzPTW6/XPyWid6y1j3cqlGavVCqbgiD4hoh2W2sPpPlk/g0TJ9w+a+1r3UBUKpVtQRD4XeL18q8juJmr44UkecYT0aK19ngWyNTU1OUrKyuLXnREtNdaO5/l3xHABzcgngZwJ4AXicj/FU8x81fePjo6etng4OBWItpCRLcCOC8iD+e5wOQCaM6gUqlcHwSBv275x4/fAHwOYKuI/OzviiJyrK+v79W5ubk/8ixZVwDJhGNjY8X+/v5iHMfFIAgiZvYgXY//DNB1pTYBlwDWvQP/ADKczDByPL0uAAAAAElFTkSuQmCC);
          }

          input {
            width: 100%;
            border: 1px solid #b9b9b9;
            height: 35px;
            padding-left: 38px;
            outline: none;
          }
        }
        .ant-menu:not(.ant-menu-horizontal) .ant-menu-item-selected {
          background: #e5e5e5;
        }
        li {
          font-size: 0;
          position: relative;
          transition: all 0.3s;
          user-select: none;
          cursor: pointer;
          &:hover {
            background: rgb(229, 229, 229);
          }
          &.ant-menu-submenu:hover {
            background: #fff;
          }

          &.active {
            background: rgb(229, 229, 229);

            &::after {
              content: '';
              position: absolute;
              left: 0;
              top: 50%;
              transform: translateY(-50%);
              width: 4px;
              height: 60%;
              background-color: #1890ff;
            }
          }

          img {
            width: 16px !important;
            height: 16px !important;
            vertical-align: middle;
            margin-right: 8px;
          }

          span {
            font-size: 17px;
            vertical-align: middle;
            color: rgba(0, 0, 0, 0.65);
          }
        }
      }
    }

    .right-content {
      width: 100%;
      > div {
        padding: 20px;
        padding-top: 30px;
        // max-width: 1000px;
        max-width: calc(100vw - 320px);
        margin: 0 auto;
      }
    }
  }
}

@media (max-width: 750px) {
  .settings-menu-left .settings-nav li span {
    display: none !important;
  }
  .main .content .left-content > .settings-menu-left .settings-nav li {
    text-align: center;
  }
  .main .content .left-content > .settings-menu-left .settings-nav li > img {
    width: 22px;
    height: 22px;
  }
}
</style>
