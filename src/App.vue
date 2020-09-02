<template>
  <div id="micro-app-crm">
    <h1>micro-app-login</h1>
    <router-view :key="(new Date()).getTime()" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  components: {},
  data () {
    return {}
  },
  computed: {
    ...mapState('MainCommon', {
      a: state => state.common
    })
  },
  mounted () {
    console.log(this.a)
  },
  watch: {
    a: {
      handler: function (val) {
        console.log('from crm change', val)
      },
      deep: true
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
