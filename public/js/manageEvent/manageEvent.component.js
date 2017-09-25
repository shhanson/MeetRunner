(function () {
  angular.module('meetrunner')
    .component('manageEvent', {
      controller: ManageEventController,
      templateUrl: '/js/manageEvent/manageEvent.template.html',
    });

  ManageEventController.$inject = ['EventsService', '$stateParams', '$state', '$localStorage'];

  function ManageEventController(EventsService, $stateParams, $state, $localStorage) {
    const vm = this;
    vm.sessions = [];
    vm.event = {};

    vm.$onInit = function onInit() {
      // get sessions
      EventsService.getEventSessions($stateParams.event_id).then((response) => {
        vm.sessions = response.data;
      });

      EventsService.getEvent($stateParams.event_id).then(() => {
        vm.event = EventsService.event;
      });
    };

    vm.getSession = function getSession() {
      return $localStorage.session;
    };

    vm.updateEvent = function updateEvent() {
      EventsService.updateEvent(vm.event.id, vm.event).then(() => {
        vm.event = EventsService.event;
      });
    };

    vm.toggleRegStatus = function toggleRegStatus() {
      vm.event.registration_open = !vm.event.registration_open;
      EventsService.updateEvent(vm.event.id, vm.event).then(() => {
        vm.event = EventsService.event;
      });
    };
  }
}());
