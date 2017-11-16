(function () {
  angular.module('meetrunner')
    .component('profile', {
      controller: ProfileController,
      templateUrl: '/js/profile/profile.template.html',
    });


  ProfileController.$inject = ['UsersService', '$localStorage'];
  function ProfileController(UsersService, $localStorage) {
    const vm = this;
    vm.form = {};

    vm.$onInit = function onInit() {
      UsersService.getUserInfo(vm.getSession().id).then((response) => {
        vm.form = response.data;
      });
    };

    vm.editProfile = function editProfile() {
      UsersService.editUserInfo(vm.getSession().id, vm.form).then((response) => {
        vm.form = response.data;
      }).catch((err) => {
        vm.updateError = true;
      });
    };

    vm.getSession = function getSession() {
      return $localStorage.session;
    };
  }
}());
