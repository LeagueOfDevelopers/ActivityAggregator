angular.module('app.services', [])

  .service('API', 
    ['$rootScope',
    '$q',
    '$http',
   function($rootScope, $q, $http){

        
      var config = { 

         baseUrl: 'http://achievements.lod-misis.ru',
        
        apiUrls : {

      user: {

        get: {
          method: 'POST',
          url: function(params) {
            return '/api/auth' + '/isAuth';
          }
        },

        logout: {
          method: 'POST',
          url: function(params) {
            return '/api' + '/logout';
          }
        }
      },

      admin: {
        login: {
          method: 'POST',
          url: function() {
            return '/api/admin' + '/login';
          }
        },
        registry: {
          method: 'POST',
          url: function() {
            return '/api/admin/registry';
          }
        }
      },

      students: {
        getDetail: {
          method: 'GET',
          url: function(params) {    
          return '/api'  + '/students/' + params.studentId;
        }
      },
      requests: {
        method: 'GET',
        url: function() { 
          return '/api/admin/registryRequests'
          }
        },
        confirm: {
          method: 'POST',
          url: function(params) {
            return 'api/admin/confirmStudent/' + params.studentId;
            }
          },
          reject: {
          method: 'POST',
          url: function(params) {
            return 'api/admin/rejectStudent/' + params.studentId;
          }
        }
      
    },

      achivments: {
        requests: {
          method: 'GET',
          url: function() {
            return '/api/adm/requests';
          }
        }
        
      }

      }
    }

  

    function parsePath(pathString, obj) {
      var path = pathString.split('.');
      if(Array.isArray(path)) {
        for (var i = 0, l = path.length; i < l; i++) {
          var item = path[i];
          if(obj[item]) {
            obj = obj[item]
          } else {
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
      return $q.when(send(apiMethod, params || null)).then(function(result) {
        if(log) {
          console.log(result);
          }
          return result;

      });

      function send(apiMethod, params) {
        if(log) {
          console.log(apiMethod.url(params || null));
        }
        return $http({
          method: apiMethod.method,
          url   : apiMethod.url(params),
          data  : params && params.data ? params.data : undefined
        }).success(function(res) {
          return {
            data: res,
            method: apiMethod
          };
        });
      };

    };

    return {
      query: query.bind(config),
      baseUrl: config.baseUrl,
      apiUrls: config.apiUrls,
    }


  }])


  .service('avatar',
    [ 
    function() {
    return  function(item) {
       return item.photoUri ? 'background-image: url(' + item.photoUri + ')' : ''; 
      }
  }])


  .service('UserManager',
   ['$rootScope',
    '$q',
    '$http',
    'API',
   function ($rootScope, $q, $http, API) {
        
        var apiUrl = '/api';
        var curUser = null;

        var userDetail = null;

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
        return $http.get('/api/admin/update').success(function(result) {
          console.log('ok');
          return result.data;
       })
      };

       

        function logout() {
            return $http.post('/api/auth/logout').success(function (data) {
                curUser = null;
                var defaultAction = true;
                return data && data.result
                    ? data.result : defaultAction;
            });
        }

        return {
            Current: Current,
            logout: logout,
            update: update
        }
    }])

