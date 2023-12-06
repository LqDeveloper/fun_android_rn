import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import {ColorSchemeName, useColorScheme} from 'react-native';
import light from './light_theme';
import dark from './dark_theme';
import Theme from './theme';

export interface ThemeState {
  type: ColorSchemeName;
  theme: Theme;
  changeTheme: () => void;
}

const themes: {[key: string]: Theme} = {
  light,
  dark,
};

const ThemeContext = createContext<ThemeState>({} as ThemeState);

const ThemeProvider: React.FC<PropsWithChildren> = ({children}) => {
  const systemTheme = useColorScheme() ?? 'light';
  const [type, setType] = useState<ColorSchemeName>(systemTheme);
  const [_, forceRefresh] = useState(0);

  const onRefresh = () => forceRefresh(0);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('theme');
        if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
          setType(savedTheme as ColorSchemeName);
        }
      } catch (error) {
        console.error('Error loading theme:', error);
      }
    };
    loadTheme();
  }, []);

  const toggleTheme = () => {
    const newTheme = type === 'light' ? 'dark' : 'light';
    setType(newTheme);

    AsyncStorage.setItem('theme', newTheme);
    onRefresh();
  };

  return (
    <ThemeContext.Provider
      value={{
        type: type,
        theme: themes[type ?? 'light'],
        changeTheme: toggleTheme,
      }}>
      {children}
    </ThemeContext.Provider>
  );
};

const useTheme = () => {
  const context = useContext<ThemeState>(ThemeContext);
  if (!context) {
    throw new Error('useTheme必须在ThemeProvider内使用');
  }
  return context;
};

export {ThemeProvider, useTheme};
