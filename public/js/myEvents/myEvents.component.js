(function () {
  angular.module('meetrunner')
    .component('myEvents', {
      controller: MyEventsController,
      templateUrl: '/js/myEvents/myEvents.template.html',
    });

  MyEventsController.$inject = ['$state', '$localStorage'];

  function MyEventsController($state, $localStorage) {

  }
}());
