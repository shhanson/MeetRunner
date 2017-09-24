(function () {
  angular.module('meetrunner')
    .service('AthletesService', ['$http', function service($http) {
      const self = this;
      const athletes = [];


      self.registerAthlete = function registerAthlete(eventID, formData) {
        return $http.post(`/api/events/${eventID}/athletes/register`, formData);
      };

      self.getAthletes = function getAthletes(eventID) {
        return $http.get(`/api/events/${eventID}/athletes`).then((response) => {
          self.athletes = response.data;
        });
      };
    }]);
}());
