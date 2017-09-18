(function () {
  angular.module('meetrunner')
    .service('CategoriesService', ['$http', function service($http) {
      const self = this;
      self.categories = [];

      self.getCategories = function getCategories(yearOfBirth, gender) {
        console.log('GENDER');
        console.log(gender);
        let divisionID;
        const age = new Date().getFullYear() - yearOfBirth;
        console.log('AGE');
        console.log(age);
        if (age >= 35) {
          divisionID = 4; // Masters
        } else if (age >= 20) {
          divisionID = 3; // Senior
        } else if (age >= 15) {
          divisionID = 2; // Junior
        } else {
          divisionID = 1; // Youth
        }

        return $http.get(`/api/divisions/${divisionID}/categories/${gender}`)
          .then((response) => {
            self.categories = response.data;
          });
      };
    }]);
}());
