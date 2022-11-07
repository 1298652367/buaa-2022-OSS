<template>
  <div :class="['input-wrapper', { 'is-focused': isFocused }]">
    <input class="title" v-bind="$attrs" :value="value" @focus="isFocused = true" @blur="isFocused = false" @input="e => $emit('input', e.target.value)" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      isFocused: false,
    };
  },
  props: ['value'],
  methods: {},
};
</script>

<style lang="scss" scoped>
.input-wrapper {
  position: relative;
  margin-bottom: 12px;
  border-bottom: 1px solid var(--md-editor-border-color);
  transition: all 0.3s;
  > input {
    border: none;
    border-radius: 4px;
    font-variant-ligatures: none;
    width: 100%;
    height: 48px;
    max-height: 140px;
    outline: none;
    color: #202124;
    transition: all 0.3s;
    // &:focus {
    //   border: 1px solid var(--md-editor-border-color-active);
    // }
  }
  &.is-focused {
    border-bottom: 1px solid #409eff;
    // &::after {
    //   transform: scaleX(1);
    // }
  }
  // &::after {
  //   transform: scaleX(0);
  //   bottom: -1px;
  //   border: 1px solid #409eff;
  // }
  // &::before {
  //   border: 1px solid #e8e8eb;
  // }
  // &::before,
  // &::after {
  //   width: 100%;
  //   position: absolute;
  //   bottom: 0;
  //   left: 0;
  //   content: '';
  //   transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
  // }
}
</style>
