const { defineConfig } = require('@vue/cli-service');
const path = require('path');

module.exports = defineConfig({
  transpileDependencies: true,
  pluginOptions: {
    vuetify: {
			// https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
		},
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve('../web-adratcliff/src'),
      },
    },
    externals: [
      'vue',
      'vuetify',
      'vue-router',
      'pinia',
      '@mdi/font',
      'core-js',
      'register-service-worker',
      'roboto-fontface',
      'webfontloader',
    ],
  },
});
