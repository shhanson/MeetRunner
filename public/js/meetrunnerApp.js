(function () {
  angular.module('meetrunner', ['ui.router', 'ui.materialize', 'ngStorage'])
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
        url: '/events/:event_id',
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
        name: 'manageEvent',
        url: '/events/:event_id/manage',
        component: 'manageEvent',
      })
      .state({
        name: 'manageSession',
        url: '/events/:event_id/sessions/:session_id/manage',
        component: 'manageSession',
      })
      .state({
        name: 'session',
        url: '/events/:event_id/sessions/:session_id',
        component: 'session',
      })
      .state({
        name: 'createSession',
        url: '/events/:event_id/sessions/new',
        component: 'createSession',
      })
      .state({
        name: 'athletes',
        url: '/events/:event_id/athletes',
        component: 'athletes',
      });
  }
}());
