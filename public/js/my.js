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
            $scope.recipeOfItem = "";
            $scope.countChanges = 1;
            $scope.statusImgUpload = false;

            //Отримання рецептів
            $http.get('http://localhost:8000/recipe')
                .then(function successCallback(response) {
                    $scope.recipeArr = response.data;
                }, function errorCallback(response) {
                    console.log("Error!!!" + response.err);
                });

            $scope.recipeArr = [];

            //Кнопка "Перехід до товару"
            $scope.showRecipe = function (index, nameRec, dateCreat, srcRC, indexArr) {
                let beforeCountChanges = srcRC.split("-");
                $scope.recipePage = true;
                $scope.newRecipe = false;
                $scope.home = false;
                $scope.recipe = false;
                $scope.modifyRecipe = false;
                $scope.historyPage = false;
                $scope.indexOfItem = index;

                //Отримати опис товарів при загрузці сторінки товару
                $http.get('http://localhost:8000/items-info')
                    .then(function successCallback(response) {
                        $scope.itemsInfoText = response.data;
                        $scope.choosenItemName = nameRec;
                        $scope.choosenItemDate = dateCreat;
                        $scope.choosenItemSrc = srcRC;
                        $scope.choosenItemText = $scope.itemsInfoText[indexArr];
                    }, function errorCallback(response) {
                        console.log("Error!!!" + response.err);
                    });
                $scope.changeSatusImgUpload = function () {
                    $scope.statusImgUpload = true;
                }
                $scope.modifyRcp = function () {
                    $scope.newRecipe = false;
                    $scope.home = false;
                    $scope.recipe = false;
                    $scope.recipePage = false;
                    $scope.modifyRecipe = true;
                    $scope.historyPage = false;
                    $scope.newNameOfItem = $scope.choosenItemName;
                    $scope.newDateOfItem = $scope.choosenItemDate;
                    $scope.newInfoOfItem = $scope.choosenItemText;
                    $scope.newItemSrc = $scope.choosenItemSrc;
                };
                $scope.deleteRcp = function () {
                    $http.delete('http://localhost:8000/item/' + index)
                        .then(function successCallback() {
                            console.log("Deleted!");
                            $scope.itemsInfoText.splice(indexArr, 1);
                            //Завантаження опису в текстовий файл
                            let obj = {
                                text: $scope.itemsInfoText.join('/item/')
                            };
                            $http.put('http://localhost:8000/items-info', obj)
                                .then(function successCallback() {
                                    console.log("Updated text in txt file");
                                    //Отримати список товарів при загрузці сайту
                                    $http.get('http://localhost:8000/recipe')
                                        .then(function successCallback(response) {
                                            $scope.recipeArr = response.data;
                                            $scope.recipe = true;
                                            $scope.recipePage = false;
                                            $scope.choosenItemName = "";
                                            $scope.choosenItemDate = "";
                                        }, function errorCallback(response) {
                                            console.log("Error!!!" + response.err);
                                        });
                                }, function errorCallback(response) {
                                    console.log("Error!!!" + response.err);
                                });
                        }, function errorCallback(response) {
                            console.log("Error!!!" + response.err);
                        })
                }

                var newAdrrImg = "";
                $scope.changeItemEdit = function () {
                    //Завантаження зображення
                    if ($scope.statusImgUpload) {
                        var fd = new FormData();
                        if (beforeCountChanges[1] == undefined) {
                            newAdrrImg = srcRC + "-" + $scope.countChanges
                        } else {
                            $scope.countChanges += Number(beforeCountChanges[1]);
                            newAdrrImg = beforeCountChanges[0] + "-" + $scope.countChanges;
                        }
                        fd.append(newAdrrImg, $scope.myFile);
                        $http.post('http://localhost:8000/images', fd, {
                                transformRequest: angular.identity,
                                headers: {
                                    'Content-Type': undefined
                                }
                            })
                            .then(function successCallback() {
                                console.log("Uploaded!");
                            }, function errorCallback(response) {
                                console.log("Error!!!" + response.err);
                            })
                    }

                    $scope.itemsInfoText[indexArr] = $scope.newInfoOfItem;
                    //Завантаження опису в текстовий файл
                    let obj = {
                        text: $scope.itemsInfoText.join('/item/')
                    };
                    $http.put('http://localhost:8000/items-info', obj)
                        .then(function successCallback() {
                            console.log("Updated text in txt file");
                        }, function errorCallback(response) {
                            console.log("Error!!!" + response.err);
                        });


                    $scope.countChanges += Number(beforeCountChanges[1]);
                    if ($scope.statusImgUpload) {
                        var objEdit = {
                            name: $scope.newNameOfItem,
                            creationDate: $scope.newDateOfItem,
                            src: newAdrrImg
                        }
                    } else {
                        var objEdit = {
                            name: $scope.newNameOfItem,
                            creationDate: $scope.newDateOfItem,
                            src: srcRC
                        }
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
                            $scope.choosenItemText = $scope.newInfoOfItem;
                            if ($scope.statusImgUpload) {
                                $scope.choosenItemSrc = newAdrrImg;
                            } else {
                                $scope.choosenItemSrc = srcRC;
                            };
                            $scope.statusImgUpload = false;
                            $scope.newRecipe = false;
                            $scope.home = false;
                            $scope.recipe = false;
                            $scope.recipePage = true;
                            $scope.modifyRecipe = false;
                            $scope.historyPage = false;
                        }, function errorCallback(response) {
                            console.log("Error!!!" + response.err);
                        });

                }
            };

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
            $scope.newRecipeName = "";
            $scope.newDescription = "";


            //Добавити рецепт в БД
            $scope.addRecipe = function () {
                //генерація нової назви зображення після завантаження
                var imgNumberName = 0;
                if ($scope.recipeArr[0] == undefined) {
                    imgNumberName = 1;
                } else {
                    imgNumberName = $scope.recipeArr[$scope.recipeArr.length - 1].id + 1;
                };
                //Завантаження зображення
                var fd = new FormData();
                fd.append(imgNumberName, $scope.myFile);
                $http.post('http://localhost:8000/images', fd, {
                        transformRequest: angular.identity,
                        headers: {
                            'Content-Type': undefined
                        }
                    })
                    .then(function successCallback() {
                        console.log("Uploaded!");
                    }, function errorCallback(response) {
                        console.log("Error!!!" + response.err);
                    });

                //Завантаження опису в текстовий файл
                //                let obj = {
                //                    text: $scope.newDescription
                //                };
                //                $http.post('http://localhost:8000/items-info', obj)
                //                    .then(function successCallback() {
                //                        console.log("Text in txt file");
                //                    }, function errorCallback(response) {
                //                        console.log("Error!!!" + response.err);
                //                    });
                //                //Завантаження опису ІНГРЕДІЄНТІВ в текстовий файл
                //                let ingrdObj = {
                //                    text: $scope.newIngredients
                //                };
                //                $http.post('http://localhost:8000/ingrd-info', ingrdObj)
                //                    .then(function successCallback() {
                //                        console.log("Ingrediens Text in txt file");
                //                    }, function errorCallback(response) {
                //                        console.log("Error!!!" + response.err);
                //                    });

                //Запис рецепту в recipe_ingredients базу даних
                $scope.currentDate = new Date();
                let recipeObj = {
                    name: $scope.newRecipeName,
                    creationDate: $scope.currentDate,
                    src: imgNumberName,
                    recipe_description: $scope.newDescription,
                    ingredients: $scope.newIngredients
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




                //Запис оновлення опису товару в ткст файл
                //Оновлення списку товарів
                $http.get('http://localhost:8000/recipe')
                    .then(function successCallback(response) {
                        $scope.recipeArr = response.data;
                        $scope.newRecipe = false;
                        $scope.home = false;
                        $scope.recipe = true;
                        $scope.recipePage = false;
                        $scope.modifyRecipe = false;
                        $scope.historyPage = false;
                        $scope.newRecipeName = "";
                        $scope.newDescription = "";
                        $scope.newIngredients = "";
                    }, function errorCallback(response) {
                        console.log("Error!!!" + response.err);
                    });
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

            //            $scope.modifyRcp = function () {
            //                $scope.modifyRecipe = true;
            //                $scope.recipePage = false;
            //                $scope.newRecipe = false;
            //                $scope.home = false;
            //                $scope.recipe = false;
            //                $scope.historyPage = false;
            //            }
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

//Директива з унікальним атрибутом - для передачі файла
app.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            element.bind('change', function () {
                scope.$apply(function () {
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);
