angular.module('app.services', [])

  .service('UserManager', ['$rootScope', '$q', '$http', function ($rootScope, $q, $http) {
        var curUser = {};
        var userInfo = {
          firstName: 'Жамбыл',
          lastName: 'Ермагамбет',
          department: 'ИТАСУ',
          course: '2',
          about: 'Задача организации, в особенности же рамки и место обучения кадров позволяет выполнять важные задания по разработке соответствующий условий активизации. Мы хотим, чтобы наш вейп-шоп был удобен и полезен для всех категорий покупателей. вас все замечания и предложения о товаре, ценах, а главное — о сайте отправлять.',
          photoUri: '../img/jambul.jpg',
          achivments: [{name:'Победа в квн', id: '12', type: 'sport'}, {name:'Победаdwd в квн', id: '12', type: 'sport'}, {name:'Победаqwdq в квн', id: '12', type: 'sport'}, {name:'Побеdwdда в квн', id: '12', type: 'sport'}]
        }
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

        function getUserDetail(params) {
          var result = {};
          if(!params) {
            result = userInfo;
          } else {
          params.forEach(function (item) {
            result[item] = userInfo[item];
          })
        }
        return $q.when(result).then(function (result) {
          return result;

        })

      }

      function updateUserDetail(data) {
        return $q.when(updateData(data)).then(function () {
          return getUserDetail();
        })

        function updateData(data) {
          userInfo[about] = data;

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
            logout: logout,
            getUserDetail: getUserDetail
        }
    }])
