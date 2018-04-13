//Під`єднюємо ангуляр
var app = angular.module('app', ['ngRoute']);

//Забираєм %2F та # з url сайту
app.config(['$locationProvider', function ($locationProvider) {
    $locationProvider.hashPrefix('');
    $locationProvider.html5Mode(true);
}]);

//Створюєм адреси
app.config(function ($routeProvider) {
    $routeProvider
        .otherwise({
            redirectTo: '/'
        });

});

//Створюємо контроллер
app.controller('myCtrl', function ($scope, $http) {});

//Директиви 
app.directive("headerBlock", function () {
    return {
        replace: true,
        templateUrl: "template/header.html",
        controller: function ($scope, $http) {

            $scope.home = true;
            $scope.recipe = false;
            $scope.newRecipe = false;
            $scope.recipePage = false;
            $scope.modifyRecipe = false;

            $scope.menuNavigation = [{
                name: "Home",
                action: function () {
                    $scope.home = true;
                    $scope.recipe = false;
                    $scope.newRecipe = false;
                    $scope.recipePage = false;
                    $scope.modifyRecipe = false;
                }
          }, {
                name: "Recipe Book",
                action: function () {
                    $scope.home = false;
                    $scope.recipe = true;
                    $scope.newRecipe = false;
                    $scope.recipePage = false;
                    $scope.modifyRecipe = false;
                }
          }]
        }
    }
});

app.directive("bodyBlock", function () {
    return {
        replace: true,
        templateUrl: "template/body.html",
        controller: function ($scope, $http) {}
    }
});

app.directive("footerBlock", function () {
    return {
        replace: true,
        templateUrl: "template/footer.html",
        controller: function ($scope, $http) {}
    }
});

//Директиви для сторінок з контентом

app.directive("homeBlock", function () {
    return {
        replace: true,
        templateUrl: "template/pages/home.html",
        controller: function ($scope, $http) {}
    }
});

app.directive("recipeBlock", function () {
    return {
        replace: true,
        templateUrl: "template/pages/recipe.html",
        controller: function ($scope, $http) {
            $scope.showRecipe = function() {
                $scope.recipePage = true;
                $scope.newRecipe = false;
                $scope.home = false;
                $scope.recipe = false;
                $scope.modifyRecipe = false;
            }
        }
    }
});

app.directive("newrecipeBlock", function () {
    return {
        replace: true,
        templateUrl: "template/pages/newRecipe.html",
        controller: function ($scope, $http) {

            $scope.newRecipeFunc = function () {
                $scope.newRecipe = true;
                $scope.home = false;
                $scope.recipe = false;
                $scope.recipePage = false;
                $scope.modifyRecipe = false;
            }

            $scope.ingrdArray = [];

            $scope.addToArray = function (ingr) {
                $scope.ingrdArray.push(ingr);
                $scope.ingredients = "";
                console.log($scope.ingrdArray);
//                $scope.currentDate = new Date();
            }
        }
    }
});

app.directive("recipecontenBlock", function () {
    return {
        replace: true,
        templateUrl: "template/pages/recipePage.html",
        controller: function ($scope, $http) {
            $scope.backRecipe = function() {
                $scope.recipePage = false;
                $scope.newRecipe = false;
                $scope.home = false;
                $scope.recipe = true;
                $scope.modifyRecipe = false;
            } 
        }
    }
});

app.directive("recipemodifyBlock", function () {
    return {
        replace: true,
        templateUrl: "template/pages/modifyRecipe.html",
        controller: function ($scope, $http) {
            
            $scope.modifyRcp = function() {
                $scope.modifyRecipe = true;
                $scope.recipePage = false;
                $scope.newRecipe = false;
                $scope.home = false;
                $scope.recipe = false;
            } 
        }
    }
});
