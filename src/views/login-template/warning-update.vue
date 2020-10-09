<template>
  <div style="width:100%;text-align: center;color:#ffffff">
    <h2 style="font-size: 25px;margin-bottom:26px">{{mode.title}}</h2>
    <p>{{mode.long}}</p>
    <p>{{mode.msg}}</p>
  </div>
</template>

<script type="text/javascript">

export default {
  name: 'warningUpdate',
  computed: {
    mode () {
      return {
        title: '系统升级维护中...',
        long: '预计1小时内完成升级',
        msg: '请待会儿再来噢~'
      }
    }
  }
}
</script>
