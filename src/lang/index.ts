import { createI18n } from 'vue-i18n'
import zhCn from 'element-plus/lib/locale/lang/zh-cn'
import en from 'element-plus/lib/locale/lang/en';
import { dictMap } from "@/lang/common";
import Cookies  from 'js-cookie';

const i18n = createI18n({
    locale:Cookies.get("lang")||'zh',
    fallbackLocale: "zh",
    legacy: true,
    globalInjection: true,
    messages: {
      en: {
        ...en,
        ...dictMap.en
      },
      zh: {
        ...dictMap.ch,
        ...zhCn,
      }
    }
  })

  export {
    i18n
  }