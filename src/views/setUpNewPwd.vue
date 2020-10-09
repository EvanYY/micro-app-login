<!--
 * @Description: 重置密码页面
 * @Author: niumkiki
 * @Date: 2020-04-24 16:10:29
 * @LastEditTime: 2020-06-12 18:31:26
 * @LastEditors: niumkiki
 -->
<template>
    <div class="set-up-pwd clearfix">
        <!-- 上方按钮及图标 -->
        <div class="pwd-head clearfix">
            <span class='top-icon'>
                <Icon custom="custom custom-main-logo" size="32"/>
                <Icon custom="custom custom-logo-text" size="20" style="margin-left: 10px;"/>
            </span>
        </div>
        <!-- 设置新密码 -->
        <div class="pwd-wrap">
            <div class="set-up-pwd-form">
                <div style="font-size: 22px;color: rgba(0,0,0,0.80);font-weight:600;padding-bottom:30px;">
                    {{$t('login.setUpNewPwd.setNewPwd')}}
                </div>
                <Form
                    label-position="left"
                    ref="setUpPwd"
                    :model="setUpPwdForm"
                    :label-width="lang === 'zh-CN'? '90px': '150px'"
                    :rules="setUpPwdFormRules">
                        <FormItem prop="newPwd" :label="$t('login.setUpNewPwd.newPwd')">
                            <ElInput v-model="setUpPwdForm.newPwd"
                                   type="password"
                                   :placeholder="$t('login.setUpNewPwd.pwdTip')"
                                   class="password-input">
                                <!-- 超长提示 -->
                                <div slot="suffix"
                                     :class="{'password-input-overLength': setUpPwdForm.newPwd.length > 20}">{{ `${setUpPwdForm.newPwd.length}/20` }}</div>
                            </ElInput>
                            <!-- 系统 tip -->
                            <HelpTip :title="$t('helpTip.password')"
                                     class="password-rule-tip"></HelpTip>
                        </FormItem>
                        <FormItem prop="reSurePwd" :label="$t('login.setUpNewPwd.reSurePwd')">
                            <ElInput
                                :maxLength="32"
                                v-model="setUpPwdForm.reSurePwd"
                                type="password"
                                :placeholder="$t('login.setUpNewPwd.surePwdTip')">
                            </ElInput>
                        </FormItem>
                        <FormItem>
                            <Button
                                size="small"
                                plain
                                :disabled="saveDisabled"
                                class="save-new-pwd"
                                :class="saveDisabled? 'disabled-btn':'seve-able-btn'"
                                :type="saveDisabled?'info': 'primary'"
                                @click="handleSaveNewPwd('setUpPwd')">
                                    {{$t('save')}}
                            </Button>
                            <Button
                                plain
                                type="primary"
                                size="small"
                                class="previous-step"
                                @click="handleToPreviousStep('setUpPwd')">
                                    {{$t('login.setUpNewPwd.previousStep')}}
                            </Button>
                        </FormItem>
                </Form>
            </div>
        </div>

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
import util from '@/libs/util'
import Vue from 'vue'
import FloatingWindow from '@/views/main-components/floating-window/floating-window'
import TriggerIconContainer from '@/views/main-components/help-center/trigger-icon-container'

export default {
  name: 'setUpPwd',
  components: {
    FloatingWindow,
    TriggerIconContainer
  },
  data () {
    return {
      lang: '',
      // 重置密码
      setUpPwdForm: {
        newPwd: '',
        reSurePwd: ''
      },
      setUpPwdFormRules: {
        newPwd: [
          { required: true, message: this.$t('new_password_tip'), trigger: 'blur' },
          { min: 8, message: this.$t('password_min_tip'), trigger: 'blur' },
          { max: 20, message: this.$t('password_max_tip'), trigger: ['blur', 'change'] },
          { validator: this.validePassword, trigger: 'blur' }
        ],
        reSurePwd: [
          { required: true, message: this.$t('new_password_comfir_tip'), trigger: 'blur' },
          { validator: this.valideReSurePwd, trigger: 'blur' }
        ]
      },
      // 保存按钮是否禁用
      saveDisabled: true,

      /* 帮助中心 */
      isDrawerShow: false
    }
  },
  created () {
    this.lang = Vue.config.lang
    console.log('resetPwdForm', this.$route.params)
    // this.$route.params && this.$route.params.flag === 'fromForgetPwd' && sessionStorage.getItem('resetPwdForm')
    if (!sessionStorage.getItem('resetPwdForm')) {
      // 如果sessionStorage中没有该值，也就是不是从设置新密码中跳转过来的，则重新跳转至登录页面
      this.$router.push({
        path: '/login',
        name: 'login'
      }).catch((err) => {
        throw new Error(`Problem handling something: ${err}.`)
      })
    }
  },
  methods: {
    // 验证新密码
    validePassword (rule, value, callback) {
      // 是否包含空格
      if (/\s/.test(value)) {
        callback(new Error(this.$t('password_space_tip')))
        return
      }
      // 字符种类判断
      if (/^(\d+$|[a-z]+$|[A-Z]+$|((?=[!-~])[^\da-zA-Z])+$)/.test(value)) {
        callback(new Error(this.$t('password_charKindCount_tip')))
        return
      }
      // 输入了其他类别的字符
      if (/[^!-~]/.test(value)) {
        callback(new Error(this.$t('password_charKindError_tip')))
        return
      }
      callback()
    },
    // 验证确认密码是否和新密码一致
    valideReSurePwd (rule, value, callback) {
      console.log('valideReSurePwd', rule, value, callback)
      if (value !== this.setUpPwdForm.newPwd) {
        callback(new Error(this.$t('login.setUpNewPwd.pwdComfirTip')))
      } else {
        callback()
      }
    },
    // 保存新密码
    handleSaveNewPwd (formName) {
      // 校验规则
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          console.log('校验未通过')
          return false
        }
        console.log('校验通过')
        // 从sessionStorage拿到重置密码界面的数据
        const tempData = window.sessionStorage.getItem('resetPwdForm')
        const { loginUserName, loginEmail, captcha } = JSON.parse(tempData)
        console.log(loginUserName, loginEmail, captcha)
        // 调接口保存新密码
        util.ajax({
          url: '/cuss-login/resetUserPassword',
          method: 'post',
          data: {
            userName: loginUserName,
            mailAddress: loginEmail,
            newPwd: this.setUpPwdForm.newPwd,
            identifyingCode: captcha
          }
        }).then(res => {
          if (res.data.code === '1') {
            // 重置密码成功
            this.$Message.success(this.$t('login.setUpNewPwd.resetPwdSuccess'))
            // 跳转至登录页面
            this.$router.push({
              path: '/login',
              name: 'login'
            }).catch((err) => {
              throw new Error(`Problem handling something: ${err}.`)
            })
            // 清空数据
            this.setUpPwdForm = {
              newPwd: '',
              reSurePwd: ''
            }
            // 清除sessionStorage
            window.sessionStorage.removeItem('resetPwdForm')
          } else {
            // 重置密码失败
            this.$Message.error(this.$t('login.setUpNewPwd.resetPwdErro'))
          }
        }).catch(error => {
          // Network Error
          // time out
          console.log('login time out error', error)
        })
      })
    },
    // 上一步
    handleToPreviousStep (formName) {
      // 清空校验
      this.$refs[formName].resetFields()
      // 跳转至忘记密码页面--传一个标识
      this.$router.push({
        path: '/login/forgetPwd',
        name: 'forgetPwd',
        params: {
          flag: 'fromSetUpPwd'
        }
      }).catch((err) => {
        throw new Error(`Problem handling something: ${err}.`)
      })
    }
  },
  watch: {
    // 监听表单，当新密码和确认密码框都有值时保存按钮可以点击，否则不可以点击
    setUpPwdForm: {
      handler (val) {
        if (val.newPwd && val.reSurePwd) {
          this.saveDisabled = false
        } else {
          this.saveDisabled = true
        }
      },
      deep: true
    }
  }
}
</script>

<style lang="less" scoped>
    .set-up-pwd {
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

        .pwd-head {
            width: 100%;
        }

        .top-icon {
            float: left
        }

        .pwd-wrap {
            flex: 1;
            display:flex;
            flex-direction: column;
            justify-content:center;
            align-items:center;
            margin-top:-62px ;
        }

        .set-up-pwd-form {
            width:600px;
            margin:0 auto;

            /deep/ .el-input__inner{
                /*height: 50px;*/
                padding-left: 16px;
                padding-right: 16px;
            }

            /deep/  .el-form-item__label {
                /*line-height: 50px;*/
            }

            .el-button{
                height: 38px;
                border-radius: 4px;
                // background-color: #FA8241;
                // color: #ffffff;
                // &:hover{
                    // border-color: #FA8241;
                // }
            }

            .disabled-btn {
                background: #E7ECF2;
                border-radius: 4px;
                color: #6E819A;
                border: none;
                padding: 0 33px;
            }

            .seve-able-btn {
                padding: 0px 33px;
            }

            .previous-step {
                padding: 0px 26px;
                margin-left:20px;
            }

            .ivu-form-item{
                margin-bottom: 30px;
            }

            /deep/ .password-rule-tip {
                position: absolute;
                right: -24px;
            }

            /deep/ .password-input {
                /deep/ .el-input__inner {
                    padding-right: 50px;
                }

                /deep/ .password-input-overLength {
                    color: #f56c6c;
                }
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
