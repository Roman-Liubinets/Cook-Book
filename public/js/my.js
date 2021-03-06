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
            $scope.historyPage = false;
            $scope.showSlider = true;

            $scope.menuNavigation = [{
                name: "Home",
                action: function () {
                    $scope.home = true;
                    $scope.recipe = false;
                    $scope.newRecipe = false;
                    $scope.recipePage = false;
                    $scope.modifyRecipe = false;
                    $scope.historyPage = false;
                }
          }, {
                name: "Recipe Book",
                action: function () {
                    $scope.home = false;
                    $scope.recipe = true;
                    $scope.newRecipe = false;
                    $scope.recipePage = false;
                    $scope.modifyRecipe = false;
                    $scope.historyPage = false;
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

//app.directive("footerBlock", function () {
//    return {
//        replace: true,
//        templateUrl: "template/footer.html",
//        controller: function ($scope, $http) {}
//    }
//});

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

            $scope.recipeArr = [];

            //            //Кнопка "Перехід до товару"
            $scope.showRecipe = function (index, nameRec, dateCreat, description, indexArr) {
                $scope.recipePage = true;
                $scope.newRecipe = false;
                $scope.home = false;
                $scope.recipe = false;
                $scope.modifyRecipe = false;
                $scope.historyPage = false;
                $scope.indexOfItem = index;

                //Отримати опис товарів при загрузці сторінки товару
                $http.get('http://localhost:8000/recipe-info')
                    .then(function successCallback(response) {
                        $scope.recipeInfoText = response.data;
                        $scope.choosenItemName = nameRec;
                        $scope.choosenItemDate = dateCreat;
                        $scope.choosenItemDesc = description;
                        $scope.choosenItemText = $scope.recipeInfoText[indexArr];

                    }, function errorCallback(response) {
                        console.log("Error!!!" + response.err);
                    });

                $scope.modifyRcp = function () {
                    $scope.modifyRecipe = true;
                    $scope.recipePage = false;
                    $scope.newRecipe = false;
                    $scope.home = false;
                    $scope.recipe = false;
                    $scope.historyPage = false;

                    $scope.newNameOfItem = $scope.choosenItemName;
                    $scope.newDateOfItem = $scope.choosenItemDate;
                    $scope.newDescOfItem = $scope.choosenItemDesc;
                    $scope.newInfoOfItem = $scope.choosenItemText;
                };

                $scope.changeRecipeEdit = function () {

                    $scope.recipeInfoText[indexArr] = $scope.newInfoOfItem;


                    var objEdit = {
                        name: $scope.newNameOfItem,
                        description: $scope.newDescOfItem,
                        creationDate: $scope.newDateOfItem
                    }


                    $http.post('http://localhost:8000/recipe-edit/' + $scope.indexOfItem, objEdit)
                        .then(function successCallback() {
                            console.log("Edited");
                        }, function errorCallback(response) {
                            console.log("Error!!!" + response.err);
                        });
                    $http.get('http://localhost:8000/recipe')
                        .then(function successCallback(response) {
                            $scope.recipeArr = response.data;
                            $scope.choosenItemName = $scope.newNameOfItem;
                            $scope.choosenItemDate = $scope.newDateOfItem;
                            $scope.choosenItemDesc = $scope.newDescOfItem;
                            $scope.modifyRecipe = false;
                        }, function errorCallback(response) {
                            console.log("Error!!!" + response.err);
                        });

                }
            };

            //Отримання рецептів
            $http.get('http://localhost:8000/recipe')
                .then(function successCallback(response) {
                    $scope.recipeArr = response.data;
                }, function errorCallback(response) {
                    console.log("Error!!!" + response.err);
                });


            $scope.newRecipeFunc = function () {
                $scope.newRecipe = true;
                $scope.home = false;
                $scope.recipe = false;
                $scope.recipePage = false;
                $scope.modifyRecipe = false;
                $scope.historyPage = false;
            }

        }
    }
});

app.directive("newrecipeBlock", function () {
    return {
        replace: true,
        templateUrl: "template/pages/newRecipe.html",
        controller: function ($scope, $http) {
            //Добавити рецепт в БД
            $scope.addRecipe = function () {
                $scope.currentDate = new Date();
                let recipeObj = {
                    name: $scope.newRecipeName,
                    description: $scope.newDescription,
                    creationDate: $scope.currentDate
                };

                $http.post('http://localhost:8000/recipe-add', recipeObj)
                    .then(function successCallback(response) {
                        $http.get('http://localhost:8000/recipe')
                            .then(function successCallback(response) {
                                $scope.recipeArr = response.data;
                            }, function errorCallback(response) {
                                console.log("Error!!!" + response.err);
                            });


                    }, function errorCallback(response) {
                        console.log("Error!!!" + response.err);
                    });

                console.log($scope.recipeArr);
            }

            $scope.ingrdArray = [];

            $scope.addToArray = function (ingr) {
                $scope.ingrdArray.push(ingr);
                $scope.newIngredients = "";
                console.log($scope.ingrdArray);
            }
        }
    }
});

app.directive("recipecontenBlock", function () {
    return {
        replace: true,
        templateUrl: "template/pages/recipePage.html",
        controller: function ($scope, $http) {

            $scope.backRecipe = function () {
                $scope.recipePage = false;
                $scope.newRecipe = false;
                $scope.home = false;
                $scope.recipe = true;
                $scope.modifyRecipe = false;
                $scope.historyPage = false;
            }
        }
    }
});

app.directive("recipemodifyBlock", function () {
    return {
        replace: true,
        templateUrl: "template/pages/modifyRecipe.html",
        controller: function ($scope, $http) {

            //                        $scope.modifyRcp = function () {
            //                            $scope.modifyRecipe = true;
            //                            $scope.recipePage = false;
            //                            $scope.newRecipe = false;
            //                            $scope.home = false;
            //                            $scope.recipe = false;
            //                            $scope.historyPage = false;
            //                        }
        }
    }
});

app.directive("historyBlock", function () {
    return {
        replace: true,
        templateUrl: "template/pages/historyRecipe.html",
        controller: function ($scope, $http) {
            $scope.historyRcp = function () {
                $scope.modifyRecipe = false;
                $scope.recipePage = false;
                $scope.newRecipe = false;
                $scope.home = false;
                $scope.recipe = false;
                $scope.historyPage = true;
            }
        }
    }
});

app.directive("sliderBlock", function () {
    return {
        replace: true,
        templateUrl: "template/slider/sliderBlock.html",
        controller: function ($scope, $http) {}
    }
});
