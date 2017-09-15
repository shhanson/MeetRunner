(function () {
  angular.module('meetrunner')
    .component('splash', {
      controller: SplashController,
      templateUrl: '/js/splash/splash.template.html',
    });

  function SplashController() {
    const vm = this;
  }
}());
