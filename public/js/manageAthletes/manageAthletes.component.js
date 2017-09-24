(function () {
  angular.module('meetrunner')
    .component('manageAthletes', {
      controller: ManageAthletes,
      templateUrl: '/js/manageAthletes/manageAthletes.template.html',
    });

  ManageAthletes.$inject = ['AthletesService', 'EventsService', '$stateParams'];
  function ManageAthletes(AthletesService, EventsService, $stateParams) {
    const vm = this;
    vm.eventID = $stateParams.event_id;
    vm.athletes = [];
    vm.event = {};
    vm.sessions = [];
    vm.selected = {};

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
      AthletesService.getAthletes(vm.eventID).then(() => {
        vm.athletes = AthletesService.athletes;

        vm.athletes.forEach((athlete) => {
          EventsService.getAthleteSession(vm.eventID, athlete.id).then((response) => {
            athlete.session_id = response.data;
            vm.selected[athlete.id] = athlete.session_id;
          });
        });
      });

      EventsService.getEvent(vm.eventID).then((response) => {
        vm.event = response.data;
      });

      EventsService.getEventSessions(vm.eventID).then((response) => {
        vm.sessions = response.data;
      });
    };

    vm.setSession = function setSession(athleteID) {
      console.log(vm.selected[athleteID]);
    };
  }
}());