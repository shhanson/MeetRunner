(function () {
  angular.module('meetrunner')
    .component('loginReg', {
      controller: LoginRegController,
      templateUrl: '/js/loginReg/loginReg.template.html',
    });

  LoginRegController.$inject = ['UsersService', '$state', '$localStorage'];

  function LoginRegController(UsersService, $state, $localStorage) {
    const vm = this;
    const login = {};
    const reg = {};

    vm.loginUser = function loginUser() {
      UsersService.login(vm.login.email, vm.login.password).then(() => {
        $state.go('myEvents', { user_id: 1 });
      });
    };

    vm.registerUser = function registerUser() {

    };

    vm.getSession = function getSession() {
      return $localStorage.session;
    };
  }
}());
