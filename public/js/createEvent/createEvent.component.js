(function () {
  angular.module('meetrunner')
    .component('createEvent', {
      controller: CreateEventController,
      templateUrl: '/js/createEvent/createEvent.template.html',
    });


  function CreateEventController() {
    const vm = this;
    vm.form = {};

    vm.createEvent = function createEvent() {

    };
  }
}());
