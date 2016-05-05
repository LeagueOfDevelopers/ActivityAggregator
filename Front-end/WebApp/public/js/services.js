angular.module('app.services', [])

  .service('API', 
  ['$rootScope',
  '$q',
  '$http',
  function($rootScope, $q, $http){

  var  = apiUrls : {

          user: {

            get: {
              method: 'POST',
              url: function(params) {
                return '/api' + '/isAuth';
              }
            },

            logout: {
              method: 'POST',
              url: function(params) {
                return '/api' + '/logout';
              }
            }
          },

        students: {

            add: {
             method: 'POST',
             url: function() {
              return '/api' + '/students/';
             }
            }, 

            get: {
             method: 'GET',
             url: function() {
              return '/api' + '/students/';
             }
            }, 

            getDetail: {
              method: 'GET',
              url: function(params) {    // get
              return '/api'  + '/students/' + params.studentId;
            }
          },

            updateDetail: {
              method: 'POST',
              url: function(params) {    // post
              return '/api'  + '/students/' + params.studentId;
            }
          },

            search: { 
              method: 'GET',
              url: function(params) {   //get
              return '/api'  + '/students/' + ((params.searchParams.name == '') ? 
                                              'search_by_category/' + params.searchParams.category : 
                                              'search_by_name/' + params.searchParams.name);
            }
          },
            getLast: {
              method: 'GET',
              url: function() {    // post
              return '/api'  + '/studentsL/last';
            }
            
          }

      },

      achivments: {

            add: {
            method: 'POST',
            url: function(params) { //post
              return '/api' + '/students/' + params.studentId + '/achivments';
            }
          },

            getDetail: {
            method: 'GET',
            url: function(params) { //get
              return '/api' + '/students/' + params.studentId + '/achivments/' + params.achId;
            }
          }
      }

    
  };

  function parsePath(pathString, obj) {
    var path = pathString.split('.');
    if(Array.isArray(path)) {
      for (var i = 0, l = path.length; i < l; i++) {
        var item = path[i];
        if(obj[item]) {
          obj = obj[item]
        } else {
          console.log('apiUrl error ' + item);
          return 
        }
      } 
      return obj;
    } else {
      return obj[path];
    }
  };

  function query(path, params, log) {

    var apiMethod = parsePath(path, this.apiUrls);
    return $q.when(send(apiMethod, params)).then(function(result) {
      if(log) {
        console.log(result);
        }
     return result;
  });

  function send(apiMethod, params) {
      if(log) {
        console.log(apiMethod.url(params));
      };
      return $http({
                      method: apiMethod.method,
                      url   : apiMethod.url(params),
                      data  : params && params.data ? params.data : null
                  })
                    .success(function(res) {
                        return {
                                data: res,
                                method: apiMethod
                               };
                    });
    };
  };

  function getConfig() {

    var getConfigQuery = function() {

      $http.get('/api/front_config').success(function(res) {
        return res;
      })
    };

    return $q.when(getConfigQuery()).then(function(res) {
            return res;
           });
  }

    return {
      query: query.bind(config),
      apiUrls: apiUrls,
      getConfig: getConfig
    }

  }])

.service('avatar',
[ 
function() {
return  function(student) {
   return student.photoUri ? 'background-image: url(' + student.photoUri + ')' : ''; 
  }
}])

.service('UserManager',
['$rootScope',
'$q',
'$http',
'API',
function ($rootScope, $q, $http, API) {
    

    function Current() {
      return API.query('user.get', null, false).then(function(res) {
        return res;
      })
    };

   function update() {
      return $q.when(updateUser()).then(function(res) {
        return res;
      })
    };
  
    function updateUser() {
      return $http.get('/api/auth/update').success(function(result) {
        console.log('ok');
        return result.data;
     })
    };

    function logout() {
        return API.query('user.logout').then(function(res) {
          return res
        })
    }

    return {
        Current: Current,
        logout: logout,
        update: update
    }
}])

