<template>
    <div class="error404">
        <div class="error404-body-con">
            <div class="error404-body-con-title">
                <img :src="require('@/svg/404.svg')" alt="">
            </div>
            <div class="error404-body-con-tip">
                <span class="error404-body-con-message">很抱歉，您要访问的页面不存在！</span>
                <Button @click="goHome"
                        style="width: 80px;height:30px;line-height: 28px;border-radius: 15px;margin-left: 20px;padding: 0;"
                        type="primary">
                        backPage
                </Button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  name: 'Error404',
  methods: {
    backPage () {
      this.$router.go(-1)
    },
    goHome () {
      this.$router.replace({
        name: 'Home'
      })
    }
  }
}
</script>
