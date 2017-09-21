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

    vm.$onInit = function onInit() {
      // get sessions
      EventsService.getEventSessions($stateParams.event_id).then((response) => {
        vm.sessions = response.data;
      });
    };

    vm.getSession = function getSession() {
      return $localStorage.session;
    };
  }
}());
