<!--
 * @Description: 忘记密码页面
 * @Author: niumkiki
 * @Date: 2020-04-24 16:10:29
 * @LastEditTime: 2020-06-15 14:03:57
 * @LastEditors: niumkiki
 -->
<template>
    <div class="forget-pwd clearfix">
        <!-- 上方按钮及图标 -->
        <div class="pwd-head clearfix">
            <span class='top-icon' style="color:#FF752A">
                <Icon
                    v-if="lang === 'zh-CN'"
                    custom="custom custom-main-logo"
                    size="32"/>
                <Icon
                    v-if="lang === 'zh-CN'"
                    custom="custom custom-logo-text"
                    size="20"/>
                <Icon
                    v-else
                    custom="custom custom-logo-en"
                    size="36" style="margin-left: 10px;"/>
            </span>
            <span  class='top-btns'>
                <span style="color: rgba(0,0,0,0.60);margin-right:10px">{{$t('login.ForgetPwd.haveAccount')}}</span>
                <Button
                    plain
                    type="primary"
                    size="small"
                    class="login-directly"
                    @click="handleLoginDirectly">
                        {{$t('login.ForgetPwd.loginDirectly')}}
                </Button>
            </span>
        </div>
        <!-- 重置密码表单 -->
        <div class="pwd-wrap">
            <div class="reset-form">
                <!-- 标题 -->
                <div style="font-size: 22px;color: rgba(0,0,0,0.80);font-weight:600;padding-bottom:30px;">{{$t('login.ForgetPwd.resetPwd')}}</div>
                <!-- 内容 -->
                <Form
                    label-position="left"
                    ref="resetPwd"
                    :model="resetPwdForm"
                    :label-width="lang === 'zh-CN'? '90px': '150px'"
                    :rules="resetPwdFormRules">
                        <FormItem prop="loginUserName" :label="$t('login.ForgetPwd.loginUserName')">
                            <ElInput
                                v-model="resetPwdForm.loginUserName"
                                autocomplete="off"
                                :placeholder="$t('login.ForgetPwd.loginUserNameTip')">
                            </ElInput>
                        </FormItem>
                        <FormItem prop="loginEmail" :label="$t('login.ForgetPwd.RegisterEmail')">
                            <ElInput
                                :maxlength="60"
                                v-model="resetPwdForm.loginEmail"
                                :placeholder="$t('login.ForgetPwd.loginEmailTip')">
                                    <Button
                                        :loading="isLoading"
                                        :disabled="isGetCaptcha"
                                        slot="append"
                                        @click="hendleGetCode">
                                            {{getCaptchaBtnText}}
                                    </Button>
                            </ElInput>
                            <!-- <Button @click="handleGetCaptcha">获取验证码</Button> -->
                        </FormItem>
                        <FormItem prop="captcha" :label="$t('login.ForgetPwd.captcha')">
                            <ElInput
                                :maxlength="20"
                                v-model="resetPwdForm.captcha"
                                :placeholder="$t('login.ForgetPwd.loginCaptchaTip')">
                            </ElInput>
                        </FormItem>
                        <FormItem>
                            <Button @click="handleToNextStep('resetPwd')"
                                    style="font-size: 18px"
                                    class="xhl-btn-long forget-pass-nextStep">
                                {{$t('login.ForgetPwd.nextStep')}}
                            </Button>
                        </FormItem>
                </Form>
                <div class="foot-explanation">
                    <span :style="{'padding-left': lang === 'zh-CN'? '90px':'150px'}">{{$t('login.ForgetPwd.notReceiveCaptcha')}}</span>&nbsp;
                    <span @click="captchaHelpVisible = true" style="color:#3B78DE;cursor: pointer;" class="view-help">{{$t('login.ForgetPwd.viewHelp')}}</span>
                </div>
            </div>
        </div>

        <Modal
            :title="$t('login.ForgetPwd.notReceiveCaptcha')"
            :visible.sync="captchaHelpVisible"
            :close-on-click-modal="false"
            width="480px"
            :custom-class="lang === 'zh-CN'?'':'line-breaks'"
            :show-close="false"
            center>
                <div >{{$t('login.ForgetPwd.notReceiveCaptchaTip1')}}</div>
                <div >{{$t('login.ForgetPwd.notReceiveCaptchaTip2')}}</div>
                <div >{{$t('login.ForgetPwd.notReceiveCaptchaTip3')}}</div>
                <span slot="footer" class="dialog-footer">
                    <Button type="primary" @click="captchaHelpVisible = false">{{$t('login.ForgetPwd.Iknow')}}</Button>
                </span>
        </Modal>

        <!-- 帮助中心 trigger -->
        <TriggerIconContainer @clickHelpIcon="isDrawerShow = true"></TriggerIconContainer>

        <!-- 帮助中心分屏 -->
        <floating-window :is-drawer-show="isDrawerShow"
                         :float-window-type="'help'"
                         :isFullHeight="true"
                         :onlyHelpCenter="true"
                         @changeDrawerShow="val => isDrawerShow = val"
                         class="fullHeight-drawer"></floating-window>
    </div>
</template>

<script>
import util from '../../libs/util'
import Vue from 'vue'
import { mapState } from 'vuex'
import FloatingWindow from '@/views/main-components/floating-window/floating-window'
import TriggerIconContainer from '@/views/main-components/help-center/trigger-icon-container'

export default {
  name: 'forgetPwd',
  components: {
    FloatingWindow,
    TriggerIconContainer
  },
  data () {
    return {
      lang: '',
      // 表单信息
      resetPwdForm: {
        loginUserName: '',
        loginEmail: '',
        captcha: ''
      },
      resetPwdFormRules: {
        loginUserName: [
          { required: true, message: this.$t('login.ForgetPwd.loginUserNameEmpty'), trigger: 'blur' }
          // { validator: this.validateUserNameAndEmail, trigger: 'blur' }
        ],
        loginEmail: [
          { required: true, message: this.$t('login.ForgetPwd.loginEmailEmpty'), trigger: 'blur' },
          { validator: this.validateEmail, trigger: 'blur' }
        ],
        captcha: [
          { required: true, message: this.$t('login.ForgetPwd.captchaEmpty'), trigger: 'blur' },
          { max: 20, message: this.$t('login.ForgetPwd.captchaLengthErro'), trigger: 'blur' }
          // { validator: this.validateCaptcha, trigger: 'blur' }
        ]
      },
      // 帮助弹框
      captchaHelpVisible: false,
      // 验证码相关
      emaiErroFlag: false,
      isGetCaptcha: true, // 获取验证码按钮是否可以点击
      getCaptchaBtnText: this.$t('login.ForgetPwd.getCaptcha'),
      waitTime: 60,
      isLoading: false,
      timerFlag: false,
      timer: null,

      /* 帮助中心 */
      isDrawerShow: false
    }
  },
  computed: {
    ...mapState({
      // lang: state => state.app.lang
    })
  },
  created () {
    // 先判断是否从重置密码页面跳转过来
    console.log('先判断是否从重置密码页面跳转过来', this.$route.params)
    if (window.sessionStorage.getItem('resetPwdForm')) {
      // 从sessionStorage拿到之前的数据,回填表单
      const tempData = window.sessionStorage.getItem('resetPwdForm')
      this.resetPwdForm = JSON.parse(tempData)
    }
    // 回填之后清除之前保存的数据
    // 如果不是从重置密码页面跳转过来，也要清除sessionStorage
    window.sessionStorage.removeItem('resetPwdForm')
    this.lang = Vue.config.lang
  },
  mounted () {
    // 将获取验证码按钮置灰
    const element = document.querySelector('.el-input-group__append .el-button')
    element.style.color = '#ccc'
  },
  methods: {
    /* 接口 */
    // 获取验证码接口
    sendIdentifyingCode () {
      const { loginUserName, loginEmail } = this.resetPwdForm
      // 发送请求获取
      return util.ajax({
        url: '/cuss-login/sendIdentifyingCodeByEmail',
        method: 'post',
        data: {
          userName: loginUserName,
          mailAddress: loginEmail,
          template: this.lang === 'zh-CN' ? 'cn' : 'en'
        }
      }).then(res => {
        if (res.data.code === '0') {
          if (res.data.message === '邮箱错误') {
            this.$Message({
              message: this.$t('login.ForgetPwd.loginEmailErro'),
              type: 'error'
            })
          } else if (res.data.message === '发送邮件失败') {
            this.$Message({
              message: this.$t('login.ForgetPwd.sendEmailErro'),
              type: 'error'
            })
          } else if (res.data.message === '用户名错误') {
            this.$Message({
              message: this.$t('login.ForgetPwd.loginUserNameErro'),
              type: 'error'
            })
          }
          return false
        } else if (res.data.code === '1') {
          this.$Message.success(this.$t('login.ForgetPwd.sendCaptchaSuccess'))
          return true
        }
      }).catch(error => {
        console.log('login time out error', error)
        return false
      })
    },

    // 验证码验证
    verifyIdentifyingCode () {
      const { loginUserName, loginEmail, captcha } = this.resetPwdForm
      // 发送请求获取
      util.ajax({
        url: '/cuss-login/verifyResetPasswordCode',
        method: 'post',
        data: {
          userName: loginUserName,
          mailAddress: loginEmail,
          identifyingCode: captcha
        }
      }).then(response => {
        if (response.data.code === '1') {
          // 跳转至设置新密码页面
          this.$router.push({
            path: '/login/setUpPwd',
            name: 'setUpPwd',
            params: {
              flag: 'fromForgetPwd'
            }
          })
          // 验证成功，保存邮箱密码这些值
          window.sessionStorage.setItem('resetPwdForm', JSON.stringify(this.resetPwdForm))
        } else {
          // 验证失败
          if (response.data.message === '0') {
            this.$Message({
              message: this.$t('login.ForgetPwd.loginEmailErro'),
              type: 'error'
            })
          } else if (response.data.message === '2') {
            this.$Message({
              message: this.$t('login.ForgetPwd.loginCaptchaErro'),
              type: 'error'
            })
          } else if (response.data.message === '3') {
            this.$Message({
              message: this.$t('login.ForgetPwd.loginUserNameErro'),
              type: 'error'
            })
          }
        }
      }).catch(error => {
        // Network Error
        // time out
        console.log('login time out error', error)
      })
    },

    /* 表单验证 */
    // 验证邮箱
    validateEmail (rule, value, callback) {
      console.log('validateUserNameAndEmail', rule, value, callback)
      // 需要验证是否是邮箱
      const reg = /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/mg

      if (!reg.test(value)) {
        this.emaiErroFlag = true
        callback(new Error(this.$t('login.ForgetPwd.loginEmailFormatErro')))
      } else {
        this.emaiErroFlag = false
        callback()
      }
    },

    // 验证验证码
    validateCaptcha (rule, value, callback) {
      console.log('validateCaptcha', rule, value, callback)
      // 需要验证是否是纯数字
      const reg = /^\d{1,}$/

      if (!reg.test(value)) {
        callback(new Error(this.$t('login.ForgetPwd.captchaFormatErro')))
      } else {
        callback()
      }
    },

    /* 操作 */
    // 直接登录
    handleLoginDirectly () {
      // 清空表单验证
      this.$refs.resetPwd.resetFields()
      // 跳转至登录页面
      this.$router.push({
        path: '/login',
        name: 'login'
      }).catch((err) => {
        throw new Error(`Problem handling something: ${err}.`)
      })
    },

    // 获取验证码
    async hendleGetCode () {
      // 先验证邮箱和登录名是否都填写了,如果有一个没有填写，则停止操作
      if (!this.resetPwdForm.loginUserName || !this.resetPwdForm.loginEmail) {
        this.$Message({
          message: this.$t('login.ForgetPwd.loginUserNameOrEmailEmpty'),
          type: 'error'
        })
        return
      }
      // 验证通过后
      if (!this.emaiErroFlag) {
        // 发送验证码
        this.isLoading = true
        const isSendCapchaFlag = await this.sendIdentifyingCode()
        this.isLoading = false

        console.log('isSendCapchaFlag', isSendCapchaFlag)
        if (isSendCapchaFlag) {
          // 获取验证码60秒倒计时，不能点击按钮
          const element = document.querySelector('.el-input-group__append .el-button')
          console.log(element)
          // 先直接改变按钮的样式及文字内容
          element.style.color = '#ccc'
          this.timerFlag = true
          this.isGetCaptcha = true
          this.getCaptchaBtnText = this.lang === 'zh-CN' ? `${this.waitTime}秒后重新获取` : `Reacquire after ${this.waitTime} seconds`
          // 定时器
          if (this.timer) {
            clearInterval(this.timer)
          }
          this.timer = setInterval(() => {
            element.style.color = '#ccc'
            this.waitTime--
            this.getCaptchaBtnText = this.lang === 'zh-CN' ? `${this.waitTime}秒后重新获取` : `Reacquire after ${this.waitTime} seconds`
            if (this.waitTime === 0) {
              this.isGetCaptcha = false
              this.getCaptchaBtnText = this.$t('login.ForgetPwd.getCaptcha')
              element.style.color = '#3B78DE'
              clearInterval(this.timer)
              this.waitTime = 60
              this.timerFlag = false
            }
          }, 1000)
        }
      }
    },

    // 下一步
    handleToNextStep (formName) {
      // 校验规则
      this.$refs[formName].validate((valid) => {
        console.log('valid', valid)
        if (!valid) {
          console.log('校验未通过')
          return false
        }
        console.log('校验通过')
        // 调接口
        this.verifyIdentifyingCode()
      })
    }
  },
  beforeDestroy () {
    // 清除定时器
    if (this.timer) {
      clearInterval(this.timer)
    }
  },
  watch: {
    resetPwdForm: {
      handler (val) {
        // 当登录名和邮箱都有值时, 获取验证码的按钮才能点击
        const element = document.querySelector('.el-input-group__append .el-button')
        const reg = /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/mg

        if (val.loginUserName && val.loginEmail && reg.test(val.loginEmail) && !this.timerFlag) {
          this.isGetCaptcha = false
          element.style.color = '#3B78DE'
        } else {
          this.isGetCaptcha = true
          element.style.color = '#ccc'
        }
      },
      deep: true
    }
  }
}
</script>

<style lang="less" scoped>
    .forget-pwd {
        min-width: 700px;
        min-height:600px;
        background: #fff;
        width: 100%;
        height:100%;
        padding:30px 30px 0;
        box-sizing: border-box;
        overflow: hidden;

        display:flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items:center;
        flex-wrap:nowrap;

        .line-breaks {
            div {
                word-break : keep-all
            }
        }

        .pwd-head {
            width: 100%;
        }

        .top-icon {
            float: left
        }

        .top-btns {
            float: right;
            font-size: 12px;
        }

        .pwd-wrap {
            flex: 1;
            display:flex;
            flex-direction: column;
            justify-content:center;
            align-items:center;
            margin-top:-70px ;
        }

        .reset-form {
            width:600px;
            margin:0 auto;


            /deep/ .el-input__inner{
                height: 50px;
                padding-left: 16px;
                padding-right: 16px;
            }

            /deep/  .el-form-item__label {
                line-height: 50px;
            }

            /deep/  .el-input-group__append {
                .el-button{
                    background-color: #f5f7fa;
                    color: #3B78DE;
                    border-radius: 4px;
                    height:48px;

                    &:hover {
                        border-color: transparent;
                    }
                }
            }
            .el-button{
                height: 50px;
                border-radius: 4px;
                background-color: #FA8241;
                color: #ffffff;
                &:hover{
                    border-color: #FA8241;
                }
            }

            .ivu-form-item{
                margin-bottom: 30px;
            }


        }

        .foot-explanation {
            margin:0 auto;
            text-align: center;
            box-sizing: border-box;

            span {
                font-size: 12px;
            }
        }
    }

    .fullHeight-drawer {
        /deep/ .el-drawer {
            height: 100%;
            top: 0;
        }
    }
</style>
