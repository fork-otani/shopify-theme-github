export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}

import { storiesOf } from '@storybook/html';
import { renderer } from 'storypug'
const path = require('path')
const pugData = require(`./pug-data.js`)
const pugContext = require.context('@stories', true, /\.stories\.pug$/);
import '../stories/assets/add.scss'
pugContext.keys().forEach(function(pathStr) {
  const ext = path.extname(pathStr)
  const dirName = path.dirname(pathStr) !== '.' ? path.dirname(pathStr).replace('./','') : 'Others'
  const pugPath = path.dirname(pathStr) !== '.' ? `${dirName}/${path.basename(pathStr)}` : path.basename(pathStr)
  const baseName = path.basename(pathStr.replace('.stories',''),`${ext}`)
  const pugSrc = require(`@stories/${pugPath}`);
  let addConfData = {};
  storiesOf( dirName , module)
    .addParameters({ layout: 'fullscreen',})
    .add( baseName , () => {
      // $(()=>{common()});
      const { html } = renderer(Object.assign(pugData,addConfData))
      return html(pugSrc)
    })
});
