(function () {
  angular.module('meetrunner')
    .component('eventReg', {
      controller: EventRegController,
      templateUrl: '/js/eventReg/eventReg.template.html',
    });

  EventRegController.$inject = ['EventsService', 'AthletesService', 'CategoriesService', '$stateParams', '$state'];

  function EventRegController(EventsService, AthletesService, CategoriesService, $stateParams, $state) {
    const vm = this;
    const event = {};
    const tempReg = {};
    const categories = [];

    vm.$onInit = function onInit() {
      vm.eventID = $stateParams.event_id;
      EventsService.getEvent(vm.eventID).then((response) => {
        vm.event = response.data;
      });
    };

    vm.getCategories = function getCategories() {
      if (vm.tempReg.year_of_birth && vm.tempReg.gender) {
        CategoriesService.getCategories(vm.tempReg.year_of_birth, vm.tempReg.gender).then(() => {
          vm.categories = CategoriesService.categories;
        });
      }
    };

    vm.register = function register() {
      console.log('BEFORE POST REQ');
      console.log(vm.tempReg);
      vm.tempReg.gender_id = vm.tempReg.gender === 'female' ? 1 : 2;
      AthletesService.registerAthlete(vm.eventID, vm.tempReg).then(() => {
        console.log('REGISTRATION SUCCESS');
      });
    };
  }
}());
