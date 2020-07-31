<template>
  <div>
    i am demo app
    <div v-for="(item) in menus" :key="item.key">
      <router-link :to="item.route">
        {{item.title}}
      </router-link>
    </div>
    <router-view :key="(new Date()).getTime()" />
  </div>
</template>

<script>
import _isFunction from 'lodash/isFunction'
export default {
  name: '',
  beforeRouteEnter (to, from, next) {
    next(vm => {
      return true
    })
  },
  beforeRouteLeave (to, from, next) {
    next()
  },
  components: {},
  mixins: [],
  props: {},
  watch: {},
  computed: {},
  data () {
    return {
      menus: [
        {
          key: 'vue',
          route: '/home',
          title: 'Home'
        },
        {
          key: 'vue-list',
          route: '/about',
          title: 'About'
        }
      ]
    }
  },
  methods: {
    test () {
      return false
    }
  },
  created () {},
  mounted () {
    console.log('app   children crm', _isFunction(this.test))
  },
  beforeDestroy () {
    console.log('main beforeDestroy')
  }
}
</script>
<style lang="scss" scoped>
</style>
