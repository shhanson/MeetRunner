(function () {
  angular.module('meetrunner')
    .component('editSession', {
      controller: EditSessionController,
      templateUrl: '/js/editSession/editSession.template.html',
    });

  EditSessionController.$inject = ['EventsService', 'UsersService', '$stateParams', '$state', '$localStorage'];

  function EditSessionController(EventsService, UsersService, $stateParams, $state, $localStorage) {
    const vm = this;
    vm.session = {};
    vm.event = {};
    vm.timezone = '';
    vm.eventID = $stateParams.event_id;
    vm.sessionID = $stateParams.session_id;

    vm.$onInit = function onInit() {
      EventsService.getSession(vm.eventID, vm.sessionID).then(() => {
        vm.session = EventsService.session;
        vm.session.date = new Date(vm.session.date);
        vm.session.weigh_time = vm.display(vm.session.weigh_time);
        vm.session.start_time = vm.display(vm.session.start_time);
      });

      EventsService.getEvent(vm.eventID).then(() => {
        vm.event = EventsService.event;
      });

      UsersService.getUserInfo(vm.getSession().id).then((response) => {
        vm.timezone = response.data.timezone;
      });
    };

    vm.updateSession = function updateSession() {
      vm.session.date = new Date(vm.session.date).toISOString();
      vm.session.start_time = vm.timeParser(vm.session.date, vm.session.start_time);
      vm.session.weigh_time = vm.timeParser(vm.session.date, vm.session.weigh_time);
      EventsService.updateSession(vm.eventID, vm.sessionID, vm.session).then(() => {
        vm.session = EventsService.session;
        $state.go('manageEvent', { event_id: vm.eventID });
      });
    };

    vm.display = function display(time){
      let tempDate = new Date(time);
      let hour = tempDate.getHours();
      let minutes = tempDate.getMinutes();
      let AMPM = (hour >= 12) ? 'PM' : 'AM';

      hour = (hour > 12) ? hour % 12 : hour;

      return `${hour < 10 ? '0': ''}${hour}:${minutes < 10 ? '0': ''}${minutes}${AMPM}`;

    };

    vm.formatTime = function formatTime(label) {
      if (label === 'start_time') {
        vm.session.start_time = vm.timeParser(vm.session.date, vm.session.start_time);
      }

      if (label === 'weigh_time') {
        vm.session.weigh_time = vm.timeParser(vm.session.date, vm.session.weigh_time);
      }
    };

    vm.timeParser = function timeParser(date, time) {
      //date = new Date(date).toISOString();
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
