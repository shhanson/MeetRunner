(function () {
  angular.module('meetrunner', ['ui.router'])
    .config(config);

  config.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider'];

  function config($stateProvider, $urlRouterProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $stateProvider
      .state({
        name: 'splash',
        url: '/',
        component: 'splash',
      });
  }
}());
