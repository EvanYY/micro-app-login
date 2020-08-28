<template>
  <div>
    <div @click="getShared">
      i am crm app Main   FUCK!
    </div>
    <h1 @click="dispatchs">
      i am crm app Main   FUCK!
    </h1>
    <div v-for="(item) in menus" :key="item.key">
      <router-link :to="item.route">
        {{item.title}}
      </router-link>
    </div>
    <router-view :key="(new Date()).getTime()" />
  </div>
</template>

<script>
// import _ from 'lodash'
// import actions from '@/shared/actions'
import SharedModule from '@/shared'
export default {
  name: 'AppCrmMain',
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
      ],
      store: null
    }
  },
  methods: {
    test () {
      return false
    },
    getShared () {
      console.log(this.store.getState())
    },
    dispatchs () {
      const { common } = this.store.getState()
      this.store.dispatch({ type: 'SET_STATUS', payload: !common.status })
      this.store.dispatch({
        type: 'DECREMENT',
        text: 'Use Redux'
      })
      this.getShared()
    }
  },
  created () { this.store = SharedModule.getShared() },
  mounted () {

  },
  beforeDestroy () {
    console.log('main beforeDestroy')
  }
}
</script>
<style lang="scss" scoped>
</style>
