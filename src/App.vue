<template>
  <div id="micro-app-crm" style="width: 100%; height: 100vh">
    <router-view :key="(new Date()).getTime()" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import i18n from '@/locale'
export default {
  components: {},
  data () {
    return {}
  },
  computed: {
    ...mapState('MainCommon', {
      lang: state => state.common.switchLang
    })
  },
  mounted () {
    console.log(this.a)
  },
  watch: {
    lang: {
      handler: function (val) {
        // 语言切换
        i18n.locale = val
      },
      deep: true
    }
  }
}
</script>
