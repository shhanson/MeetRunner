(function () {
  angular.module('meetrunner')
    .component('loginReg', {
      controller: LoginRegController,
      templateUrl: '/js/loginReg/loginReg.template.html',
    });

  LoginRegController.$inject = ['UsersService', '$state', '$localStorage'];

  function LoginRegController(UsersService, $state, $localStorage) {
    const vm = this;


    vm.loginUser = function loginUser() {
      UsersService.login(vm.login.email, vm.login.password).then(() => {
        vm.emailPassError = false;
        $state.go('myEvents', { user_id: vm.getSession().id });
      }).catch(() => {
        vm.emailPassError = true;
      });
    };

    vm.registerUser = function registerUser() {
      UsersService.register(vm.reg).then(() => {
        vm.regError = false;
        $state.go('myEvents', { user_id: vm.getSession().id });
      }).catch(() => {
        vm.regError = true;
      });
    };

    vm.getSession = function getSession() {
      return $localStorage.session;
    };
  }
}());
