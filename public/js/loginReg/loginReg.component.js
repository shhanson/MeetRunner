(function () {
  angular.module('meetrunner')
    .component('loginReg', {
      controller: LoginRegController,
      templateUrl: '/js/loginReg/loginReg.template.html',
    });

  LoginRegController.$inject = ['UsersService', '$state', '$localStorage', '$location', '$anchorScroll', '$scope'];

  function LoginRegController(UsersService, $state, $localStorage) {
    const vm = this;
    const login = {};
    const reg = {};

    vm.loginUser = function loginUser() {
      UsersService.login(vm.login.email, vm.login.password).then(() => {
        $state.go('myEvents', { user_id: vm.getSession().id });
      });
    };

    vm.registerUser = function registerUser() {
      UsersService.register(vm.reg).then(() => {
        $state.go('myEvents', { user_id: vm.getSession().id });
      });
    };

    vm.getSession = function getSession() {
      return $localStorage.session;
    };
  }
}());
