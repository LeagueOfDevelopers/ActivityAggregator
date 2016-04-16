
angular.module('admin.controllers',
[
'ui.router',
'app.controllers.main'
])

.controller('inboxCtrl', 
	[
	 '$scope', 
	 '$state',
	 'API',
	 'avatar',
	 function($scope, $state, API, avatar){
	 	$scope.$emit('changeTitle', {title: 'Кабинет администратора'})
		$scope.$emit('needAuth');
		$scope.avatar = avatar;
		API.query('achivments.requests', null, true).then(function(res) {
			$scope.studentsList = res.data || null;
		});
    API.query('students.requests', null, true).then(function(res) {
      $scope.registryRequests = res.data;
    })
	
}]).controller('authCtrl',
	 [
	 '$scope',
	 '$state',
	 'API',
	function($scope, $state, API) {
		$scope.$emit('changeTitle', {title: 'Авторизация администратора'});
		$scope.auth = {};

		$scope.submit = function() {
			API.query('admin.login', {data: $scope.auth}).then(function(res) {
        if(res.data != 'not found') {
				$scope.$emit('userUpdate');
				$state.go('inbox');
      } else {
        $scope.$emit('showMessage', {msg: 'Введены неверные данные'})
      }
			})
		}
	}])

.controller('registryAdminCtrl',
  [
  '$scope',
  '$state',
  '$stateParams',
  'API',
 function($scope, $state, $stateParams, API) {
  $scope.code = $stateParams.code;

  $scope.submit = function() {
    if($scope.newAdmin.$valid && $scope.code) {
      $scope.newAdmin.code = $scope.code

      API.query('admin.registry', {data: $scope.newAdmin}, true).then(function(res) {
        switch(res.data) {
          case 
          '0': $scope.$emit('showMessage', {msg: 'код уже использован!'});  
            break;
          case '1':
             $scope.$emit('showMessage', {msg: 'код не подходит'}); 
            break;
          default: 
          $scope.$emit('userUpdate');
          $scope.$emit('showMessage', {msg: 'Администратор успешно зарегестрирован'});
          $scope.go('auth');
            break;
        }
      })
    
  }
 }
}
  ])

.controller('profileCtrl', 
	[
	'$scope',
	'API',
	'$stateParams',
	'avatar',
   function($scope, API, $stateParams, avatar) {
   		$scope.$emit('needAuth');
   		$scope.avatar = avatar;
   		API.query('students.getDetail', {studentId : $stateParams.id}, true).then(function(res) {
   			$scope.student = res.data || null;
   		})

      $scope.confirm = function() {
        API.query('students.confirm', {studentId: $stateParams.id}, true).then(function(res) {
            $scope.$emit('showMessage', {msg: 'Студент верифицирован'});
            API.query('students.getDetail', {studentId : $stateParams.id}, true).then(function(res) {
              $scope.student = res.data || null;
            });
        })
      }
      $scope.reject = function() {
        API.query('students.reject', {studentId: $stateParams.id}, true).then(function(res) {
            $scope.$emit('showMessage', {msg: 'Заявка отклонена'});
            API.query('students.getDetail', {studentId : $stateParams.id}, true).then(function(res) {
              $scope.student = res.data || null;
            });
        })
      }
   }
	])

 .controller('achCtrl', 
    ['$scope', 
      '$state', 
      '$http',
      '$stateParams',
      'ngDialog',
      '$window',
     function($scope, $state, $http, $stateParams, ngDialog, $window){

         $scope.$emit('changeTitle', {title: $stateParams.achToShow.name}); 
         $scope.showEditField = false;
         $scope.showPhotos = false;
         $scope.fullPhoto = null;
         $scope.message = '';
         // var ach = {};
         // $http.get('api/achivments/' + $stateParams.achToShow._id).success(function(res) {
         //   ach = res.data.achivments[0];
         //   console.log(res);
         // })

       var ach = $stateParams.achToShow;
        var type = '';
        switch(ach.type) {
          case 'science' : type = 'Наука';  break;
          case 'social' : type = 'Общественная деятельность'; break;
          case 'cultural' : type = 'Культура'; break;
          case 'sport' : type = 'Спорт'; break;
          case 'study' : type = 'Учеба'; break;
        }

        var cr = new Date();
        cr.setTime(Date.parse(ach.created));

        $scope.achivment = {
          owner: $stateParams.owner,
          type: type,
          title: ach.name,
          organization: ach.organization,
          result: ach.result,
          checked: ach.checked,
          description: ach.description,
          created: cr.getDate() + '.' + (cr.getMonth() + 1) + '.' + cr.getFullYear(),
          message: ach.message,
          files: ach.files,
          level: ach.level
        }

        $scope.confirm = function() {
          $http.post('api/admin/confirm/' + ach._id).success(function(result) {
            $scope.$emit('showMessage',  {msg: 'Достижение подтверждено'})
          })

        }

        $scope.unconfirm = function() {
          if($scope.message != '') {
          $scope.showTextaria = false;
          $http.post('api/admin/unconfirm/' + ach._id, {message: $scope.message}).success(function(result) {
            $scope.$emit('showMessage', {msg: 'Отказ отправлен'})
          })
        }
         }

       $scope.showPhoto = function(photo) {
          if(photo.split('.').indexOf('pdf') == -1) {
            $scope.photoToShow = photo;
            $scope.visiblePhoto = true;
          } else {
            var url = 'http://162.243.78.140' + photo.slice(1, photo.length);
            $window.open(url);
          }
         }
    

    
       }])

       .controller('inviteCtrl', ['$scope', '$http', function($scope, $http) {
                    $scope.inviteCode = 'код';
                    $scope.inviteLink = 'ссылка';
                    $scope.secret = null;
                    $scope.generate = function() {

                    if($scope.secret) {

                    $http.post('api/admin/invite/' + $scope.currentUser._id, {secret: $scope.secret}).success(function(res) {
                      $scope.inviteCode = res.data;
                      $scope.inviteLink = 'http://' + '162.243.78.140' + '/admin/registryAdmin/' + res.data;
                    })
                    
                  }
                  }
                
      
    }])
