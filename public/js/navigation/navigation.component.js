(function () {
  angular.module('meetrunner')
    .component('navigation', {
      controller: NavigationController,
      templateUrl: '/js/navigation/navigation.template.html',
    });

  NavigationController.$inject = ['UsersService', '$localStorage', '$state'];

  function NavigationController(UsersService, $localStorage, $state) {
    const vm = this;
    vm.logout = function logout() {
      UsersService.logout().then(() => {
        $state.go('allEvents');
      });
    };

    vm.getSession = function getSession() {
      return $localStorage.session;
    };
  }
}());
