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
      })
      .state({
        name: 'loginReg',
        url: '/login',
        component: 'loginReg',
      })
      .state({
        name: 'profile',
        url: '/users/:user_id',
        component: 'profile',
      })
      .state({
        name: 'allEvents',
        url: '/events',
        component: 'allEvents',
      })
      .state({
        name: 'myEvents',
        url: '/users/:user_id/events',
        component: 'myEvents',
      })
      .state({
        name: 'event',
        url: '/events/:id',
        component: 'event',
      })
      .state({
        name: 'eventReg',
        url: '/events/:event_id/register',
        component: 'eventReg',
      })
      .state({
        name: 'createEvent',
        url: '/events/new',
        component: 'createEvent',
      })
      .state({
        name: 'session',
        url: '/events/:event_id/sessions/:session_id',
        component: 'session',
      })
      .state({
        name: 'createSession',
        url: '/events/:id/sessions/new',
        component: 'createSession',
      })
      .state({
        name: 'athletes',
        url: '/events/:id/athletes',
        component: 'athletes',
      });
  }
}());