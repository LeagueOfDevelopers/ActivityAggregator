angular.module('app.services', [])

  .service('ApiService', ['$rootScope', function($rootScope){
    return {
      apiUrl: {
      students: {

        add: '/api' + '/students/', //post

        getDetail: function(id) {    // get
          return '/api'  + '/students/' + id;
        },

        updateDetail: function(id) {    // post
          return '/api'  + '/students/' + id;
        },

        search: function(searchParams) {   //get
          return '/api'  + '/students/' + ((searchParams.name == '') ? 
                                          'search_by_category/' + searchParams.category : 
                                          'search_by_name/' + searchParams.name);
        },

        achivments: {
          add: function(id) { //post
            return rootApi + '/students/' + id + '/achivments';
          },

          getDetail: function(id, achId) {
            return rootApi + '/students/' + id + '/achivments/' + achId;
          }
        }

      }
    }
  }
  }])

  .service('UserManager',
   ['$rootScope',
    '$q',
    '$http',
     function ($rootScope, $q, $http) {
        
        var apiUrl = '/api';
        var curUser = null;

        var userDetail = null;
        function getCurrentUser(params) {
            params = params || { cache: true };
            return $q.when(curUser && params.cache ? curUser : getUser()).then(function (result) {
                return result.status ? result.data.user : result;
            });

            function getUser() {
              var reqUrl = apiUrl + '/auth/isAuth';
                return $http.post(reqUrl).success(function (data) {
                        console.log(data)
                        curUser = data.user;
                    
                    return curUser;
                });
            }
        }

        function getUserDetail() {
        return $q.when(getDetail()).then(function (result) {
          return result.data;
        })

          function getDetail() {
            var reqUrl = apiUrl + '/students/' + curUser.id;
            return $http.get(reqUrl).success(function(data) {
              if (!data.result) {
                        return false;
                    } else {
                        userDetail = data;
                    }
                    return userDetail;
            })
          };
        }

      

      function updateUserDetail(data) {
        return $q.when(updateData(data)).then(function () {
          return getUserDetail();
        })
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
            getUserDetail: getUserDetail,
        }
    }])

