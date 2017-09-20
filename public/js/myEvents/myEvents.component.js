(function () {
  angular.module('meetrunner')
    .component('myEvents', {
      controller: MyEventsController,
      templateUrl: '/js/myEvents/myEvents.template.html',
    });

  MyEventsController.$inject = ['$state', '$stateParams', '$localStorage', 'UsersService'];

  function MyEventsController($state, $stateParams, $localStorage, UsersService) {
    const vm = this;
    vm.myEvents = [];

    vm.$onInit = function onInit() {
      UsersService.getEvents(vm.getSession().id).then((response) => {
        vm.myEvents = response.data;
      });
      vm.sortSelected = 'start_date';
    };

    vm.getSession = function getSession() {
      return $localStorage.session;
    };
  }
}());
