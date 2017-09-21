(function () {
  angular.module('meetrunner')
    .component('createEvent', {
      controller: CreateEventController,
      templateUrl: '/js/createEvent/createEvent.template.html',
    });

  CreateEventController.$inject = ['EventsService', '$state', '$localStorage'];

  function CreateEventController(EventsService, $state, $localStorage) {
    const vm = this;
    vm.form = {};

    vm.createEvent = function createEvent() {
      vm.form.entry_fee_cents = Number.parseInt(vm.form.entry_fee_cents, 10) * 100;
      vm.form.start_date = new Date(vm.form.start_date).toISOString();
      vm.form.end_date = new Date(vm.form.end_date).toISOString();


      EventsService.postEvent(vm.form)
        .then(() => {
          $state.go('myEvents', { user_id: vm.getSession().id });
        });
    };

    vm.getSession = function getSession() {
      return $localStorage.session;
    };
  }
}());