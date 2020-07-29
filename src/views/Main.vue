<template>
 <div>
    i am crm app
 </div>
</template>

<script>
import _isFunction from 'lodash/isFunction'
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
  watch: {

  },
  computed: {},
  data () {
    return {}
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
