const { defineConfig } = require('@vue/cli-service');
module.exports = defineConfig({
  transpileDependencies: true,
  pluginOptions: {
    vuetify: {
			// https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
		},
  },
  configureWebpack: {
    externals: [
      'vue',
      'vuetify',
      'vue-router',
      '@mdi/font',
      'core-js',
      'register-service-worker',
      'roboto-fontface',
      'webfontloader',
    ],
  },
});
