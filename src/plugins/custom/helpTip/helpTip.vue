<template>
  <a :href="href" :title="title">
    <!-- 图标 -->
    <Icon :type="iconType" :size="iconSize" :color="iconColor" :custom="iconCustom" :class="iconClass" :style="iconStyle"></Icon>
    <!-- 自定义内容 -->
    <slot></slot>
  </a>
</template>

<script>
import Icon from '../icon'

export default {
  name: 'HelpTip',
  components: {
    Icon
  },
  props: {
    href: {
      type: String,
      default: 'javascript:void(0);'
    },
    title: {
      type: String,
      default: '',
      required: true
    },
    iconType: {
      type: String,
      default: ''
    },
    iconSize: [Number, String],
    iconColor: String,
    iconCustom: {
      type: String,
      default: 'custom custom-tip'
    },
    iconClass: {
      type: String,
      default: ''
    },
    iconStyle: {
      type: String,
      default: ''
    }
  }
}
</script>
