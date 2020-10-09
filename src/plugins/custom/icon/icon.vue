<template>
    <i :class="classes" :style="styles" @click="handleClick"></i>
</template>
<script>
const prefixCls_type = 'ivu-icon'
const prefixCls_custom = 'custom'

export default {
  name: 'Icon',
  props: {
    type: {
      type: String,
      default: ''
    },
    size: [Number, String],
    color: String,
    custom: {
      type: String,
      default: ''
    }
  },
  computed: {
    classes () {
      return [
        this.type !== '' ? `${prefixCls_type}` : '',
        this.custom === '' ? '' : `${prefixCls_custom}`,
        {
          [`${prefixCls_type}-${this.type}`]: this.type !== '' && this.type.indexOf('custom') === -1,
          [`${this.custom}`]: this.custom !== ''
        }
      ]
    },
    styles () {
      const style = {}

      if (this.size) {
        style['font-size'] = `${this.size}px`
      }

      if (this.color) {
        style.color = this.color
      }

      return style
    }
  },
  methods: {
    handleClick (event) {
      this.$emit('click', event)
    }
  }
}
</script>
