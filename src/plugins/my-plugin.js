// const defaultOptions = {
//   cutoff: 50
// };

export default {
  // called by Vue.use(FirstPlugin)
  install(Vue) {
    require('@/css/reset.css')
    require('@/css/style.css')
    require('@/css/custom_class.css')

    // // merge default options with arg options
    // let userOptions = {...defaultOptions, ...options};

    // create a mixin 
    Vue.mixin({
      created() {
      }
    });

    // // define a global property
    // Vue.VERSION = 'v2.0.3';

    // // define an instance method
    // Vue.prototype.$italicHTML = function (text) {
    //   return '<i>' + text + '</i>';
    // }

    // // define a global filter
    // Vue.filter('preview', (value) => {
    //   if (!value) {
    //     return '';
    //   }
    //   return value.substring(0, userOptions.cutoff) + '...';
    // })

    // // add a custom directive
    // Vue.directive('focus', {
    //   // When the bound element is inserted into the DOM...
    //   inserted: function (el) {
    //     // Focus the element
    //     el.focus();
    //   },
    //   update: function (el) {
    //       Vue.nextTick(function() {
    //             el.focus();
    //       })
    //   }
    // })
  }
}