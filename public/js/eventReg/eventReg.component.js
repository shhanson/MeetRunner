(function () {
  angular.module('meetrunner')
    .component('eventReg', {
      controller: EventRegController,
      templateUrl: '/js/eventReg/eventReg.template.html',
    });

  EventRegController.$inject = ['EventsService', '$stateParams', '$state'];

  function EventRegController(EventsService, $stateParams, $state) {
    const vm = this;
    const event = {};
    const tempReg = {};

    vm.$onInit = function onInit() {
      vm.eventID = $stateParams.event_id;
      EventsService.getEvent(vm.eventID).then((response) => {
        vm.event = response.data;
      });
    };
  }
}());
