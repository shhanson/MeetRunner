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

      self.addToSession = function addToSession(eventID, sessionID, athleteID) {
        return $http.post(`/api/events/${eventID}/sessions/${sessionID}/athletes/${athleteID}/add`, {
          event_id: eventID,
          session_id: sessionID,
          athlete_id: athleteID,
        });
      };

      self.changeSession = function changeSession(eventID, sessionID, athleteID) {
        return $http.put(`/api/events/${eventID}/sessions/${sessionID}/athletes/${athleteID}/edit`, {
          event_id: eventID,
          session_id: sessionID,
          athlete_id: athleteID,
        });
      };

      self.updateAthlete = function updateAthlete(eventID, athleteID, athlete) {
        return $http.put(`/api/events/${eventID}/athletes/${athleteID}/edit`, athlete);
      };
    }]);
}());
