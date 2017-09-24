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
    vm.nums = [];
    vm.sortSelected = ['gender_id', 'entry_total'];

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

        for (let i = 1; i <= vm.athletes.length; i++) {
          vm.nums.push(i);
        }

        vm.athletes.forEach((athlete) => {
          athlete.bodyweight_kg = (athlete.bodyweight_grams / 100).toFixed(2);
          EventsService.getAthleteSession(vm.eventID, athlete.id).then((response) => {
            athlete.session_id = response.data;
            vm.selected[athlete.id] = athlete.session_id;
          });
        });
      });

      EventsService.getEvent(vm.eventID).then(() => {
        vm.event = EventsService.event;
      });

      EventsService.getEventSessions(vm.eventID).then((response) => {
        vm.sessions = response.data;
      });
    };

    vm.setSession = function setSession(athleteID) {
      const selectedSession = vm.selected[athleteID];

      vm.athletes.forEach((athlete) => {
        if (athlete.id === athleteID) {
          if (athlete.session_id === -1) {
            AthletesService.addToSession(vm.eventID, selectedSession, athleteID).then(() => {
              athlete.session_id = vm.selected[athleteID];
            });
          } else {
            AthletesService.changeSession(vm.eventID, selectedSession, athleteID).then(() => {
              athlete.session_id = vm.selected[athleteID];
            });
          }
        }
      });
    };

    vm.updateAthlete = function updateAthlete(athlete) {
      athlete.bodyweight_grams = Math.round(athlete.bodyweight_kg * 100);
      AthletesService.updateAthlete(vm.eventID, athlete.id, athlete).then(() => {

      });
    };

    vm.generateLotNums = function generateLotNums() {
      if (vm.nums.length === 0) {
        for (let i = 1; i <= vm.athletes.length; i++) {
          vm.nums.push(i);
        }
      }
      const promises = [];
      vm.athletes.forEach((athlete) => {
        const lotNum = vm.nums[Math.floor(Math.random() * vm.nums.length)];
        athlete.lot_num = lotNum;

        promises.push(AthletesService.updateAthlete(vm.eventID, athlete.id, athlete));
        vm.nums.splice(vm.nums.indexOf(lotNum), 1);
      });

      Promise.all(promises);
    };
  }
}());
