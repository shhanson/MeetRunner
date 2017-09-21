(function () {
  angular.module('meetrunner')
    .service('AthletesService', ['$http', function service($http) {
      const self = this;


      self.registerAthlete = function registerAthlete(eventID, formData) {
        return $http.post(`/api/events/${eventID}/athletes/register`, formData);
      };
    }]);
}());
