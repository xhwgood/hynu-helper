import Taro, { Component, useState } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import { AtButton, AtInput } from 'taro-ui'
import { showError } from '@utils/taroutils'
import ajax from '@utils/ajax'

const Login = ({
  onSubmit = () => {},
  phone,
  verification,
  setPhone,
  setVerification
}) => {
  // 每分钟只能获取一次验证码
  const [verificationTime, setVerificationTime] = useState(-1)
  /** 计时器 */
  let timerInterval
  /** 获取验证码 */
  const getVerification = () => {
    if (!String(phone).length) {
      return showError('还未输入手机号')
    }
    if (/^[0-9]*$/.test(phone) && phone.length == 11) {
      const data = {
        func: 'getVerification',
        data: { phone }
      }
      ajax('card', data).then(() => {
        /** 获取按钮设为禁用状态 */
        setVerificationTime(60)
        timerInterval = setInterval(() => {
          setVerificationTime(preTime => {
            if (preTime == 0) {
              clearInterval(timerInterval)
            }
            return preTime - 1
          })
        }, 1000)
      })
    } else {
      showError('手机号格式错误')
    }
  }

  return (
    <View>
      <AtInput
        title='手机号'
        placeholder='请输入手机号'
        value={phone}
        clear
        type='digit'
        onChange={txt => setPhone(txt)}
      />
      <AtInput
        clear
        title='验证码'
        placeholder='请输入验证码'
        maxLength='6'
        value={verification}
        onChange={txt => setVerification(txt)}
        onConfirm={onSubmit}
      >
        <AtButton
          onClick={getVerification}
          type='primary'
          size='small'
          disabled={verificationTime > -1}
        >
          {/* 一分钟内限制发一次验证码，如果在 0~60，就显示倒计时，否则显示发送 */}
          {verificationTime > -1
            ? verificationTime + '秒后可重发'
            : '发送验证码'}
        </AtButton>
      </AtInput>
    </View>
  )
}

export default Login
