import AliOSSUpload from './src/Ali-Oss-Upload.vue';

/* istanbul ignore next */
AliOSSUpload.install = function(Vue) {
  Vue.component(AliOSSUpload.name, AliOSSUpload);
};

export default AliOSSUpload;
