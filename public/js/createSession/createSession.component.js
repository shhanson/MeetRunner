(function () {
  angular.module('meetrunner')
    .component('createSession', {
      controller: CreateSessionController,
      templateUrl: '/js/createSession/createSession.template.html',
    });

  CreateSessionController.$inject = ['EventsService', 'UsersService', '$localStorage', '$stateParams', '$state'];

  function CreateSessionController(EventsService, UsersService, $localStorage, $stateParams, $state) {
    const vm = this;
    vm.event = {};
    vm.form = {};
    vm.timezone = '';

    vm.$onInit = function onInit() {
      EventsService.getEvent($stateParams.event_id).then((response) => {
        vm.event = response.data;
      });

      UsersService.getUserInfo(vm.getSession().id).then((response) => {
        vm.timezone = response.data.timezone;
      });
    };

    vm.createSession = function createSession() {
      vm.form.event_id = $stateParams.event_id;
      if (!vm.form.date) {
        vm.form.date = vm.event.start_date;
      }

      vm.form.weigh_time = vm.timeParser(vm.form.date, vm.form.weigh_time);
      vm.form.start_time = vm.timeParser(vm.form.date, vm.form.start_time);

      EventsService.postSession($stateParams.event_id, vm.form).then(() => {
        $state.go('manageEvent', { event_id: $stateParams.event_id });
      });
    };

    vm.timeParser = function timeParser(date, time) {
      const AMPM = time.match(/AM|PM/)[0].toLowerCase();
      let hours = Number.parseInt(time.match(/^.+?(?=:)/), 10);
      const minutes = time.match(/:.{2}/);

      if (AMPM === 'pm' && hours < 12) {
        hours += 12;
      }

      if (AMPM === 'am' && hours === 12) {
        hours -= 12;
      }

      const result = `${date.match(/^.+?(?=T)/)} ${hours}${minutes}:00${vm.timezone}`;
      return result;
    };

    vm.getSession = function getSession() {
      return $localStorage.session;
    };
  }
}());
