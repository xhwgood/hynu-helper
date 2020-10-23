import Taro, { Component, useState } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import { AtButton, AtInput } from 'taro-ui'
import ajax from '@utils/ajax'

const Login = ({ onSubmit = () => {} }) => {
  /** 验证码 */
  const [verification, setVerification] = useState('')
  // 每分钟只能获取一次验证码
  const [verificationTime, setVerificationTime] = useState(0)
  /** 计时器 */
  let timerInterval
  // 手机号
  const [phone, setPhone] = useState('')
  /** 获取验证码 */
  const getVerification = () => {
    const data = {
      func: 'getVerification',
      data: {}
    }
    // ajax('card', data).then(res => {
    //   /** 获取按钮设为禁用状态 */
    // })
    setVerificationTime(60)
    timerInterval = setInterval(() => {
      setVerificationTime(preTime => {
        if (preTime == 0) {
          clearInterval(timerInterval)
        }
        return preTime - 1
      })
    }, 1000)
  }

  return (
    <View>
      <AtInput
        title='手机号'
        placeholder='请输入手机号'
        value={phone}
        clear
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
          disabled={verificationTime == 0}
        >
          {/* 一分钟内限制发一次验证码，如果在 0~60，就显示倒计时，否则显示发送 */}
          {verification == 0 ? verificationTime : '发送验证码'}
        </AtButton>
      </AtInput>
    </View>
  )
}

export default Login
