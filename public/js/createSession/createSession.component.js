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
    //  vm.athlete = {};
    vm.eventID = $stateParams.event_id;
    vm.sessionlessAthletes = [];
    vm.DIVISIONS = {
      1: 'youth13u',
      2: 'youth1415',
      3: 'youth1617',
      4: 'junior',
      5: 'senior',
      6: 'master',
    };
    vm.CATEGORIES = {
      1: '31',
      2: '35',
      3: '39',
      4: '44',
      5: '48',
      6: '50',
      7: '53',
      8: '56',
      9: '58',
      10: '58+',
      11: '62',
      12: '63',
      13: '69',
      14: '69+',
      15: '75',
      16: '75+',
      17: '77',
      18: '85',
      19: '85+',
      20: '90',
      21: '90+',
      22: '94',
      23: '94+',
      24: '105',
      25: '105+',
    };

    vm.$onInit = function onInit() {
      EventsService.getEvent(vm.eventID).then(() => {
        vm.event = EventsService.event;
        vm.form.date = new Date(vm.event.start_date);
      });

      UsersService.getUserInfo(vm.getSession().id).then((response) => {
        vm.timezone = response.data.timezone;
      });

      EventsService.getSessionlessAthletes(vm.eventID).then((response) => {
        vm.sessionlessAthletes = response.data;
      });
    };

    vm.createSession = function createSession() {
      vm.form.event_id = vm.eventID;


      if (!vm.form.date) {
        vm.form.date = vm.event.start_date;
      } else {
        vm.form.date = new Date(vm.form.date).toISOString();
      }

      vm.form.weigh_time = vm.timeParser(vm.form.date, vm.form.weigh_time);
      vm.form.start_time = vm.timeParser(vm.form.date, vm.form.start_time);


      const addAthletes = [];
      if (vm.athlete) {
        Object.keys(vm.athlete).forEach((key) => {
          if (vm.athlete[key] === true) {
            addAthletes.push(key);
          }
        });
      }

      EventsService.postSession($stateParams.event_id, vm.form).then((response) => {
        const sessionID = response.data.id;
        const promises = [];
        addAthletes.forEach((athlete) => {
          promises.push(EventsService.addAthleteToSession(vm.eventID, sessionID, athlete));
        });

        Promise.all(promises).then(() => {
          $state.go('manageEvent', { event_id: vm.eventID });
        });
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
