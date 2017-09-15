(function () {
  angular.module('meetrunner')
    .service('EventsService', ['$http', function service($http) {
      const self = this;
      self.events = [];

      self.getEvents = function getEvents() {
        return $http.get('/api/events')
          .then((response) => {
            self.events = response.data;
          });
      };

      self.getEvent = function getEvent(eventID) {
        return $http.get(`/api/events/${eventID}`);
      };
    }]);
}());
