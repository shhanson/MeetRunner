(function () {
  angular.module('meetrunner')
    .component('loginReg', {
      controller: LoginRegController,
      templateUrl: '/js/loginReg/loginReg.template.html',
    });

  LoginRegController.$inject = ['UsersService', '$state'];

  function LoginRegController(UsersService, $state) {
    const vm = this;
    const login = {};
    const reg = {};

    vm.loginUser = function loginUser() {
      UsersService.login(vm.login.email, vm.login.password).then(() => {
        $state.go('myEvents', { user_id: UsersService.session.id });
      });
    };

    vm.registerUser = function registerUser() {

    };
  }
}());
