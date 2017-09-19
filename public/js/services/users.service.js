(function () {
  angular.module('meetrunner')
    .service('UsersService', ['$http', function service($http) {
      const self = this;
      self.session = {};

      self.login = function login(email, password) {
        return $http.post('/users/login', {
          email,
          password,
        }).then((response) => {
          self.session.id = response.data.id;
          self.is_admin = response.data.is_admin;
        });
      };

      self.logout = function logout() {
        return $http.put('/users/logout')
          .then(() => {
            self.session = null;
          });
      };

      self.register = function register(first_name, last_name, email, password, timezone) {
        return $http.post('/users/new', {
          first_name,
          last_name,
          email,
          password,
          timezone,
        }).then(() => {

        });
      };
    }]);
}());
