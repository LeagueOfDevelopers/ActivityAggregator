angular.module('app.services', [])

  .service('UserManager', ['$rootScope', '$q', '$http', function ($rootScope, $q, $http) {
        var curUser = {name: 'Жамбыл Ермагамбет', id: '1'};

        function getCurrentUser(params) {
            params = params || { cache: true };
            return $q.when(curUser && params.cache ? curUser : getUser()).then(function (result) {
                return result.status ? result.data.user : result;
            });
            function getUser() {
                return $http.get('/api/auth/isAuth').success(function (data) {
                    if (!data.result) {
                        return false;
                    } else if (data.user) {
                        curUser = data.user;
                    }
                    return curUser;
                });
            }
        }

        function logout() {
            return $http.post('/api/auth/logout').success(function (data) {
                curUser = null;
                var defaultAction = true;
                return data && data.result
                    ? data.result : defaultAction;
            });
        }

        return {
            getCurrentUser: getCurrentUser,
            logout: logout
        }
    }])
