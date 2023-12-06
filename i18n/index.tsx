import I18n from 'react-native-i18n';
import en from './locales/en';
import zh from './locales/zh';
import React, {
  PropsWithChildren,
  createContext,
  useEffect,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

I18n.defaultLocale = 'zh'; //设置默认的语言

I18n.fallbacks = true; //设置

I18n.locale = 'zh'; //设置当前的语言环境

I18n.translations = {
  //支持的语言列表
  en,
  zh,
};

function strings(name: string, params = {}) {
  //params默认为json类型
  return I18n.t(name, params);
}

type LocaleType = 'en' | 'zh';

export interface LocaleState {
  locale: string;
  changeLocale: (lo: LocaleType) => void;
}

const LocaleContext = createContext<LocaleState>({} as LocaleState);

const LocaleProvider: React.FC<PropsWithChildren> = ({children}) => {
  const [lang, setLang] = useState('zh');

  const [_, forceRefresh] = useState(0);
  const onRefresh = () => forceRefresh(0);

  const updateLocale = (le: LocaleType) => {
    setLang(le);
    AsyncStorage.setItem('locale', le);
    I18n.locale = lang;
    onRefresh();
  };

  useEffect(() => {
    const loadLocale = async () => {
      try {
        const savedLocale = await AsyncStorage.getItem('locale');
        if (savedLocale && (savedLocale === 'zh' || savedLocale === 'en')) {
          setLang(savedLocale);
        }
      } catch (error) {
        console.error('Error loading locale:', error);
      }
    };
    loadLocale();
  }, []);

  return (
    <LocaleContext.Provider value={{locale: lang, changeLocale: updateLocale}}>
      {children}
    </LocaleContext.Provider>
  );
};

export {LocaleProvider, strings};
