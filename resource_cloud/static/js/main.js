'use strict';

window.ResourceCloud = angular.module('resourceCloudApp', ['ngRoute', 'restangular', 'LocalStorageModule'])

.run(function($location, Restangular, authService) {
    Restangular.setFullRequestInterceptor(function(element, operation, route, url, headers, params, httpConfig) {
        headers['Authorization'] = 'Basic ' + authService.getToken();
        return {
            headers: headers
        };
    });

    Restangular.setErrorInterceptor(function(response, deferred, responseHandler) {
        if (response.config.bypassErrorInterceptor) {
            return true;
        } else {
            switch(response.status) {
                case 401:
                    authService.logout()
                    $location.path('/session/create');
                    break;
                default:
                    throw new Error('No handler for status code ' + response.status);
            }
            return false;
        }
    });
})

.config(function($routeProvider, RestangularProvider) {
    RestangularProvider.setBaseUrl('/api/v1');
    var partialsDir = '../partials';

    var redirectIfAuthenticated = function(route) {
        return function($location, $q, authService) {
            var deferred = $q.defer();
            if (authService.isAuthenticated()) {
                deferred.reject()
                $location.path(route);
            } else {
                deferred.resolve()
            }
            return deferred.promise;
        }
    }

    var redirectIfNotAuthenticated = function(route) {
        return function($location, $q, authService) {
            var deferred = $q.defer();
            if (! authService.isAuthenticated()) {
                deferred.reject()
                $location.path(route);
            } else {
                deferred.resolve()
            }
            return deferred.promise;
        }
    }

    $routeProvider
        .when('/', {
            templateUrl: partialsDir + '/welcome.html'
        })
        .when('/dashboard', {
            controller: 'DashboardController',
            templateUrl: partialsDir + '/dashboard.html',
            resolve: {
                redirectIfNotAuthenticated: redirectIfNotAuthenticated('/')
            }
        })
        .when('/app', {
            controller: 'ApplicationController',
            templateUrl: partialsDir + '/app.html'
        })
        .when('/services', {
            controller: 'ServiceController',
            templateUrl: partialsDir + '/services.html',
            resolve: {
                redirectIfAuthenticated: redirectIfAuthenticated('/')
            }
        });
})
.factory('authService', ['$q', 'localStorageService', 'Session', function($q, localStorageService, Session) {
    return {
        login : function(email, password) {
            var me = this;
            var deferred = $q.defer();
            var credentials = {'email': email, 'password': password};
            Session.create(credentials, true).then(function(response) {
                me.setToken(response.token);
                return deferred.resolve(response);
            }, function(response) {
                if (response.status == 401) {
                    return deferred.reject(false);
                }
                throw new Error("No handler for status code " + response.status);
            });
            return deferred.promise;
        },

        logout : function() {
            localStorageService.clearAll();
        },

        isAuthenticated : function() {
            var token = this.getToken();
            if (token) {
                return true;
            }
            return false;
        },

        setToken : function(token) {
            localStorageService.set('token', btoa(token + ":"));
        },

        getToken : function() {
            return localStorageService.get('token');
        }
    }
}])
.factory('Session', function(Restangular) {
    var Session;
    Session = {
        create: function(data, bypassErrorInterceptor) {
            return Restangular
                .one('sessions')
                .withHttpConfig({bypassErrorInterceptor: bypassErrorInterceptor})
                .customPOST(data);
        }
    };
    return Session;
})
.controller('ApplicationController', ['$scope', '$routeParams', '$http', function($scope, $routeParams, $http) {
    
}])
.controller('DashboardController', ['$scope', '$routeParams', 'authService', 'Restangular',
                            function($scope, $routeParams, authService, Restangular) {
    
    Restangular.setDefaultHeaders({token: authService.getToken()});
    var baseAccounts = Restangular.all('services');
    baseAccounts.getList().then(function(users) {
          $scope.users = users;
    });
}])
.controller('AuthController', ['$scope', 'authService', function($scope, authService) {
    $scope.isLoggedIn = function() {
        return authService.isAuthenticated();
    };

    $scope.login = function() {
        authService.login($scope.email, $scope.password).then(function() {
        })
    };

    $scope.logout = function() {
        authService.logout();
        $scope.email = "";
        $scope.password = "";
    };
}]);
