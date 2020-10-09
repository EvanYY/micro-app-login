<template>
  <div style="width:100%" class="login-form" ref="loginFormRoom">
    <div class="input" v-for="(item, index) in inputConfig" :key="index">
      <label :for="item.id" :style="(defaultStyle || (current === index || !!form[item.val]) ) ? labelStyle : {}">{{item.label}}</label>
      <input ref="loginFormInput" autocomplete="on" :type="item.type" :name="item.name" :id="item.id" v-model="form[item.val]" @focus="focus(index)" @blur="blur(item)" @change="change(form[item.val], item.val)" />
      <span class="spin" :class="{'is-current': index === current, 'is-error': !rules[item.val].status}"></span>
      <span class="error-message" v-if="!rules[item.val].status">{{rules[item.val].message}}</span>
    </div>
  </div>
</template>
<script>
import { getFormStatus } from '@/utils/form-rules-methods'
import { cloneDeep } from 'lodash'
// import $cookie from 'js-cookie';
// import { decode, encode } from 'js-base64';
import { userpass } from '@/utils/safe'

const form = {
  userName: '',
  password: ''
}
const rulesModule = {
  userName: {
    status: true,
    rule: 'isEmptyStr'
  },
  password: {
    status: true,
    rule: 'isEmptyStr'
  }
}
export default {
  props: {
    defaultStyle: Boolean
  },
  data () {
    return {
      form: cloneDeep(form),
      rulesDemo: cloneDeep(rulesModule),
      labelStyle: {
        'line-height': '16px',
        'font-size': '12px',
        'font-weight': '100',
        top: '0px'
      },
      current: -1,
      pass: 'password'
    }
  },
  mounted () {
    userpass.check()
    const info = userpass.getInfo()
    this.form = {
      userName: info.account,
      password: info.password
    }
  },
  computed: {
    inputConfig () {
      return [
        {
          type: 'text',
          name: 'name',
          val: 'userName',
          id: 'loginName',
          label: this.$t('login.account')
        },
        {
          type: this.pass,
          name: 'pass',
          val: 'password',
          id: 'loginPass',
          label: this.$t('login.formPass')
        }
      ]
    },
    rules () {
      return {
        userName: {
          ...this.rulesDemo.userName,
          message: this.$t('login.usernameTip')
        },
        password: {
          ...this.rulesDemo.password,
          message: this.$t('login.passwordTip')

        }
      }
    }
  },
  methods: {
    change (val, name) {
      this.form[name] = val.trim()
    },
    focus (index) {
      this.current = index
    },
    blur (item) {
      this.current = -1
      if (this.form[item.val]) {
        this.validate(item.val)
      }
    },
    validate (method) {
      let flag = true
      if (method && typeof method === 'string' && this.rules[method]) {
        flag = this.rulesDemo[method].status = !getFormStatus[this.rules[method].rule](this.form[method])
      } else {
        for (const k in this.rules) {
          if (getFormStatus[this.rules[k].rule](this.form[k])) {
            flag = this.rulesDemo[k].status = false
          }
        }
      }
      if (typeof method === 'function') {
        method(flag)
      }
      return flag
    },
    getForm () {
      return cloneDeep(this.form)
    },
    resetFields () {
      this.form = cloneDeep(form)
      this.rulesDemo = cloneDeep(rulesModule)
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~@/assets/styles/form-login";
</style>
