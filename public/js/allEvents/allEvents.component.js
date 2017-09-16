(function () {
  angular.module('meetrunner')
    .component('allEvents', {
      controller: AllEventsController,
      templateUrl: '/js/allEvents/allEvents.template.html',
    });

  AllEventsController.$inject = ['EventsService'];
  function AllEventsController(EventsService) {
    const vm = this;
    vm.events = [];

    vm.$onInit = function onInit() {
      EventsService.getEvents().then(() => {
        vm.events = EventsService.events;
      });
      vm.sortSelected = 'start_date';
    };
  }
}());
