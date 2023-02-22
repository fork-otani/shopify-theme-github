import { addons } from '@storybook/addons';
import { create } from '@storybook/theming';

addons.setConfig({
  theme: create({
    base: 'light', // light or dark
    brandTitle: 'STORYBOOK', // タイトル名変えたい場合
    // brandUrl: '',
  }),
});

