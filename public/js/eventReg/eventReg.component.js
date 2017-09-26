(function () {
  angular.module('meetrunner')
    .component('eventReg', {
      controller: EventRegController,
      templateUrl: '/js/eventReg/eventReg.template.html',
    });

  EventRegController.$inject = ['EventsService', 'AthletesService', 'CategoriesService', '$stateParams', '$state'];

  function EventRegController(EventsService, AthletesService, CategoriesService, $stateParams, $state) {
    const vm = this;
    vm.event = {};
    vm.tempReg = {};
    vm.categories = [];
    vm.descriptionDisplay = [];
    vm.sessions = [];


    vm.$onInit = function onInit() {
      vm.eventID = $stateParams.event_id;
      EventsService.getEvent(vm.eventID).then(() => {
        vm.event = EventsService.event;
        vm.descriptionDisplay = vm.event.description.split('\n').filter(item => item !== '');
      });

      EventsService.getEventSessions(vm.eventID).then((response) => {
        vm.sessions = response.data;
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
      vm.tempReg.gender_id = vm.tempReg.gender === 'female' ? 1 : 2;
      vm.tempReg.category_id = vm.tempReg.category.id;
      vm.tempReg.division_id = vm.getDivision();

      AthletesService.registerAthlete(vm.eventID, vm.tempReg).then(() => {
        Materialize.toast('Registration Success!', 6000);
      });
    };

    vm.getDivision = function getDivision() {
      const age = new Date().getFullYear() - vm.tempReg.year_of_birth;
      if (age >= 35) {
        return 6; // Masters
      } else if (age >= 21 && age <= 34) {
        return 5; // Senior
      } else if (age >= 18 && age <= 20) {
        return 4; // Junior
      } else if (age >= 16 && age <= 17) {
        return 3; // youth1617
      } else if (age >= 14 && age <= 15) {
        return 2; // youth1415
      }
      return 1; // youth13u
    };
  }
}());
