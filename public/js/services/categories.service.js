(function () {
  angular.module('meetrunner')
    .service('CategoriesService', ['$http', function service($http) {
      const self = this;
      self.categories = [];

      self.getCategories = function getCategories(yearOfBirth, gender) {
        let divisionID;
        const age = new Date().getFullYear() - yearOfBirth;

        if (age >= 35) {
          divisionID = 6; // Masters
        } else if (age >= 21 && age <= 34) {
          divisionID = 5; // Senior
        } else if (age >= 18 && age <= 20) {
          divisionID = 4; // Junior
        } else if (age >= 16 && age <= 17) {
          divisionID = 3; // youth1617
        } else if (age >= 14 && age <= 15) {
          divisionID = 2; // youth1415
        } else {
          divisionID = 1; // youth13u
        }

        return $http.get(`/api/divisions/${divisionID}/categories/${gender}`)
          .then((response) => {
            self.categories = response.data;
          });
      };
    }]);
}());
