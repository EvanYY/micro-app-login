<template>
  <div class="home">
    <h1>Hello Daddy</h1>
  </div>
</template>

<script>
// @ is an alias to /src
import SharedModule from '@/shared'

export default {
  name: 'Home',
  mounted () {
    const shared = SharedModule.getShared()

    console.log('from crm home', shared)
  }
}
</script>
