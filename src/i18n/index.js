import { createI18n } from 'vue-i18n'
import { getCookie } from '@/utils/cookie'
import { message_cn, message_en } from './message'
import { label_cn, label_en } from './label'

export default createI18n({
  legacy: false, // 我猜测其是指是否开启兼容旧版本
  locale: getCookie('lang') ? getCookie('lang') : 'cn',
  messages: {
    cn: {
      label: label_cn,
      message: message_cn,
    },
    en: {
      label: label_en,
      message: message_en,
    },
  },
})
