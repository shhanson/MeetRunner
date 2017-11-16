(function () {
  angular.module('meetrunner')
    .service('UsersService', ['$http', '$localStorage', function service($http, $localStorage) {
      const self = this;
      self.session = {};

      self.login = function login(email, password) {
        return $http.post('/api/users/login', {
          email,
          password,
        }).then((response) => {
          self.session.id = response.data.id;
          self.session.is_admin = response.data.is_admin;
          $localStorage.session = self.session;
        });
      };

      self.logout = function logout() {
        return $http.put('/api/users/logout')
          .then(() => {
            $localStorage.session = null;
          });
      };

      self.register = function register(obj) {
        return $http.post('/api/users/new', obj)
          .then((response) => {
            self.session.id = response.data.id;
            self.session.is_admin = response.data.is_admin;
            $localStorage.session = self.session;
          });
      };

      self.getEvents = function getEvents(userID) {
        return $http.get(`/api/users/${userID}/events`);
      };

      self.getUserInfo = function getUserInfo(userID) {
        return $http.get(`/api/users/${userID}`);
      };

      self.editUserInfo = function editUserInfo(userID, data) {
        return $http.put(`/api/users/${userID}/edit`, data);
      };
    }]);
}());
