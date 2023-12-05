import I18n from 'react-native-i18n';
import en from './locales/en';
import zh_CN from './locales/zh_CN';
I18n.fallbacks = true;

I18n.translations = {
  en,
  zh_CN,
};

export default I18n;
