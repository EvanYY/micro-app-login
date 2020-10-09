<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-07-10 15:13:46
 * @LastEditTime: 2020-08-04 21:47:06
 * @LastEditors: niumkiki
 -->
<style lang="scss" scoped>
@import "~@/assets/styles/login";
</style>

<template>
  <div class="login" @keydown.enter="handleSubmit" @click="defaultStyle = false">
    <div class="pulse">
      <div class="login-body ">
        <div class="login-icon">
          <span>
            <span style="font-size: 70px;margin-right: 10px;color:#FF752A" class="custom custom-main-logo"></span>
            <span v-if="getLang" class="custom custom-logo2" style="font-size: 58px;color:#ffffff"></span>
            <span v-else class="custom custom-English1" style="font-size: 58px;color: #ffffff"></span>
          </span>
        </div>
        <template v-if="!isUpgrade">
          <div class="form-con">
            <formLogin ref="loginForm" :defaultStyle="defaultStyle"></formLogin>
            <span>
              <button style="margin-top: 40px;" class="login-button" :disabled="loading" @click="handleSubmit" :loading="loading">
                <span v-if="!loading">{{$t('login.loginBtn')}}</span>
                <span v-else>{{$t('login.loginBtnLoading')}}</span>
              </button>
              <div style="width: 100%;text-align:center;margin-top: 20px">
                <span style="" class="login__forget-pass" @click="handleForgetPass">{{$t('login.forgetPass')}}</span>
              </div>
            </span>
          </div>
        </template>
        <warningUpdate v-else style="margin-top: 100px"></warningUpdate>
      </div>
      <div class="login-copyright" style="margin-top:20px">{{$t('login.tip')}}</div>
    </div>
    <div style="position: fixed;top: 30px;right: 30px;font-size: 12px" v-if="!isUpgrade">
      <span class="login_chart login__forget-pass" v-if="getLang" @click="handleSwitch('en-US')">English</span>
      <span class="login_chart login__forget-pass" v-else @click="handleSwitch('zh-CN')">中文</span>
    </div>
  </div>

</template>

<script>
import Cookies from 'js-cookie'
import util from '@/libs/util'
import { mapState } from 'vuex'
import formLogin from './login-template/form-login'
import warningUpdate from './login-template/warning-update'
import { debounce } from 'lodash'
import { syncBiPrivilege, serverLogin } from '@/api/reusableApi/common'
import { userpass, signRsa } from '@/utils/safe'

export default {
  components: {
    formLogin,
    warningUpdate
  },
  computed: {
    ...mapState('MainCommon', {
      // enterpriseId: 'enterpriseId',
      // biHttp: 'biHttp',
      // bi_report_menu: 'bi_report_menu',
      // isUpgrade: 'isUpgrade',
      // router_map: (state) => state.app.router_map
      lang: state => state.common.switchLang
    }),
    ...mapState('App', ['isUpgrade']),
    getLang () {
      return this.lang === 'zh-CN'
    },
    rules () {
      return {
        userName: [
          {
            required: true,
            message: this.$t('login.usernameTip'),
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: this.$t('login.passwordTip'),
            trigger: 'blur'
          }
        ]
      }
    }
  },
  data () {
    return {
      single: false,
      loginIcon: '../../images/loginIcon.png',
      loading: false,
      form: {
        userName: '',
        password: ''
      },
      upgradeTimer: '',
      defaultStyle: true
    }
  },
  methods: {
    // 每10分钟调一次接口，若接口正常，自动改为登陆界面
    handleTimerUpdate () {
      // 清除定时
      if (this.upgradeTimer) {
        clearInterval(this.upgradeTimer)
      }
      // 设置定时
      this.upgradeTimer = setInterval(() => {
        this.handleUpdate()
      }, 600000)
    },
    // 刷新页面调接口判断返回是否正常，若该接口code码返回406, 则显示正在升级中
    handleUpdate () {
      util
        .ajax({
          url: '/cuss-login/status/health',
          method: 'GET'
        })
        .then((res) => {
          console.log(res)
          if (res.data === 1) {
            if (this.isUpgrade) {
              this.$store.commit('setIsUpgrade', false)
            }
          }
        })
    },
    /**
     * @Date: 2020-04-29 13:52:07
     * @LastEditors: niumkiki
     * @description: 增加忘记密码需求
     * @param:
     * @return:
     */
    handleForgetPass () {
      // 点击忘记密码：在当前窗口跳转至忘记密码页面
      this.$router
        .push({
          name: 'forgetPwd'
        })
        .catch((err) => {
          throw new Error(`Problem handling something: ${err}.`)
        })
      // 新窗口打开
      // const routeUrl = this.$router.resolve({
      //     path: '/login/forgetPwd',
      //     name: 'forgetPwd'
      // });
      // window.open(routeUrl.href, '_blank');
    },
    compareName (origin, password) {
      const store = userpass.getInfo()
      return origin === store.account && store.password === password
    },
    handleSubmit: debounce(function () {
      if (!this.$refs.loginForm) return false
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true
          const params = this.$refs.loginForm.getForm()
          if (!this.compareName(params.userName, params.password)) {
            params.password = signRsa.encrypted(params.password)
          }
          // userpass.setInfo(params.userName, params.password);
          // return;
          util
            .ajax({
              url: '/cuss-login/login',
              //   url: '/cuss-login-privilege/login',
              method: 'post',
              data: params
            })
            .then(async (response) => {
              if (response.data.code === '1') {
                /**
                 * @Description: 每次登陆成功后，移除‘timeStampList’，保证不会有之前留下的数据
                 * @author mayuanzhi
                 * @date 2020/6/1
                 */
                localStorage.removeItem('timeStampList')

                this.$store.state.app.pageOpenedList = []
                const userData = response.data.data
                const userId = userData.userId
                const orgId = userData.orgId
                Cookies.set('accId', userData.accId)
                Cookies.set('token', userData.token)
                Cookies.set('fullName', encodeURI(userData.fullName))
                Cookies.set('userName', params.userName)
                Cookies.set('userId', userData.userId)
                Cookies.set('agentOrgList', userData.agentOrgList)
                Cookies.set('enterpriseId', userData.orgId)
                this.$store.commit('setUserName', params.userName)
                this.$store.commit('setFullName', userData.fullName)
                this.$store.commit('setUserId', {
                  userId: userData.userId,
                  accId: userData.accId
                })
                this.$store.commit('setEnterpriseId', userData.orgId)
                this.getMenu(userData.userId, userData.orgId)
                syncBiPrivilege({ userId, orgId })
                this.get_buttons(userData.userId, userData.orgId)
                this.serverLogin(
                  userData.orgId,
                  userData.accId,
                  userData.token,
                  userData.fullName,
                  userData.canChat
                )
                localStorage.setItem('XHLLogin', 'LOGIN')

                // 异地登录提醒, 前端做了 demo 后端未做, 先注释掉, 后续排期了再解注继续做
                // if (true) {
                //     const location = '河北';
                //     const create = this.$createElement;
                //     const loginWarnPannel = this.$Notice({
                //         title: '异地登录提醒',
                //         position: 'bottom-right',
                //         showClose: false,
                //         duration: 0,
                //         customClass: 'loginWarnPannel',
                //         message: create('div', null, [
                //             create('div', {
                //                 style: {
                //                     color: 'red',
                //                     padding: '20px 0 5px 0'
                //                 }
                //             }, `您上次登录的地址为：${location}`),
                //             create('div', null, [
                //                 '如果不是您本人的操作，建议您立即',
                //                 create('a', {
                //                     on: {
                //                         click: () => {
                //                             this.$router.push({
                //                                 path: 'personal-set'
                //                             }, () => {
                //                                 loginWarnPannel.close();
                //                             });
                //                         }
                //                     }
                //                 }, '修改密码》')
                //             ]),
                //             create('br'),
                //             create('Button', {
                //                 props: {
                //                     type: 'primary'
                //                 },
                //                 on: {
                //                     click: () => {
                //                         loginWarnPannel.close();
                //                     }
                //                 }
                //             }, this.$t('login.ForgetPwd.Iknow'))
                //         ])
                //     });
                // }
                userpass.setInfo(params.userName, params.password)
                // 初始化聊天相关
                this.$store.state.personSubscribes = {}
                this.$store.state.isServerOnlineChecked = false
              } else {
                const code = response.data.code
                this.$Message.error(this.$t('login' + code))
                // if (response.data.code === '0') {
                //   this.$Message.error(this.$t('login.logErrTips'))
                // } else if (response.data.code === '-1') {
                //   this.$Message.error(this.$t('login.logErrTips1'))
                // } else if (response.data.code === '-2') {
                //   this.$Message.error(this.$t('login.logErrTips2'))
                // } else if (response.data.code === '-3') {
                //   this.$Message.error(this.$t('login.logErrTips3'))
                // }
                this.loading = false
              }
              /**
               * @Description: bug描述：切换账号登陆，查看下属邮件记忆了上个账号勾选的内容 --【ID1006234】
               *              Bug原因：退出账号时，存储在vuex中的数据未重置完成
               *              解决方案：账号登录成功时，将该值置为初始值。
               * @author 杨娣
               * @date 2020/6/6
               */
              this.$store.commit('setCurrentAccountIds', [])
              localStorage.removeItem('leadsCloud-globalSearchKeyWords')
            })
            .catch((error) => {
              // Network Error
              // time out
              this.loading = false
              console.log('login time out error', error)
            })
        }
      })
    }, 200),
    getMenu (userId, enterpriseId) {
      util
        .ajax({
          url: 'new-privilege/resource/getMenu',
          method: 'GET',
          params: {
            userId: userId,
            orgId: enterpriseId
          }
        })
        .then(({ data }) => {
          if (data.code === '1') {
            Cookies.set('initMenu', '0')
            /* 获取BI报表的 Path相对的url */
            const BIUrlObj = {}
            this.get_url_List(data.data.menuList, BIUrlObj)
            this.$store.commit(
              'set_BI_urlList',
              Object.assign(this.bi_report_menu, BIUrlObj)
            )

            // 处理原始数据, 更新 vuex menuList (平铺数组), 更新 vuex roleMenu (原始数据)并存入 localStorage , 更新 vuex router_map (添加动态路由 + 给左侧目录使用)
            this.$store.commit('set_menu_list', data.data.menuList)
          } else {
            this.$Message.error(this.$t('main.getMenu'))
          }
          this.get_home_page(userId, enterpriseId)
        })
    },
    /** 递归遍历menulist,获取BI报表的 Path相对的url */
    get_url_List (menuList, urlObj) {
      menuList.forEach((menu) => {
        if (menu.path.includes('bi_report_')) {
          urlObj[menu.path] = this.biHttp + menu.href
        }
        if (menu.children && menu.children.length > 0) {
          this.get_url_List(menu.children, urlObj)
        }
      })
    },
    get_home_page (userId, enterpriseId) {
      util
        .ajax({
          url: '/new-privilege/person/setting/homePage/getHomePage',
          method: 'GET',
          params: {
            userId: userId,
            orgId: enterpriseId
          }
        })
        .then(({ data }) => {
          this.loading = false
          if (data.code === '1') {
            const homeName = data.data !== '' ? data.data : 'mail_home'
            this.$router.push({
              name: homeName
            })
            this.$store.commit('setHomeName', homeName)
            Cookies.set('HOMEPAGE', homeName)
          }
        })
        .catch(() => {
          this.loading = false
        })
    },
    get_buttons (userId, orgId) {
      util
        .ajax({
          url: 'new-privilege/resource/getButton',
          method: 'GET',
          params: {
            userId: userId,
            orgId: orgId
          }
        })
        .then(({ data }) => {
          console.log(data)
          if (data.code === '1') {
            this.$store.commit('set_button_list', data.data.buttonsList)
            localStorage.setItem(
              'BUTTONS',
              JSON.stringify(data.data.buttonsList)
            )
          }
        })
    },
    serverLogin (enterpriseId, accid, token, serviceName, userType) {
      serverLogin({
        enterpriseId: enterpriseId,
        accid: accid,
        token: token,
        serviceName: serviceName,
        userType: userType
      })
    },
    handleSwitch: debounce(function (lang) {
      console.log(`lang= ${lang}`)
      //                this.lang = lang;
      // this.$store.commit('switchLang', lang)
      this.$store.commit('MainCommon/updateMainCommonKey', { switchLang: lang })
      Cookies.set('LANG', lang)

      this.$store.state.sourceDocumentTitle = this.$t('leads')
      console.log('this.$t(leads)', this.$t('leads'))
      if (this.form.userName === '' && this.form.password === '') {
        this.$refs.loginForm.resetFields()
      }
      this.$store.commit('MainCommon/updateMainCommonKey', { sourceDocumentTitle: this.$t('leads') })
      //                alert(window.parent.document.title);
    }, 200)
  },
  mounted () {
    // 去掉"Google / Facebook 账号绑定失效 tip 已关闭"信息
    localStorage.removeItem('invalidMsgClosed')
  },
  created () {
    // this.$store.commit('updateIsModeRead', true)
    // this.$store.commit('updateIfSystem', '-1')
    // 重置部分全局变量
    this.$store.commit('MainCommon/updateMainCommonKey', { isModeRead: true, ifSystem: '-1' })
    localStorage.setItem('XHLLogin', 'LOGOUT')
    // console.log('this.$store.state.MESSAGE_ws', this.$store.state.MESSAGE_ws);
    // 所有跳转到登录界面的情况都需要设置store.state.WEBSOCKET_reconnect=false;避免websocket重新连接
    // this.$store.state.WEBSOCKET_reconnect = false // 全局关闭websocket
    // if (this.$store.state.MESSAGE_ws) {
    //   this.$store.state.MESSAGE_ws.close()
    // }
    // 如果sessionStorage中有resetPwdForm信息，则需要删除该值
    if (window.sessionStorage.getItem('resetPwdForm')) {
      window.sessionStorage.removeItem('resetPwdForm')
    }
    this.handleUpdate()
    this.handleTimerUpdate()
  }
}
</script>
