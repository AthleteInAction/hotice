var MyAccountCtrl = ['$scope','$routeParams','$location','ApiModel','$timeout',
	function($scope,$routeParams,$location,ApiModel,$timeout){

		$scope.params = $routeParams;

		$scope.new_gamertag = current_user.gamertag;
		$scope.new_email = angular.copy(current_user.email);
		$scope.new_password = null

		$scope.l = {
			gamertag: {
				saving: false,
				error: null
			},
			email: {
				saving: false,
				error: null
			},
			password: {
				saving: false,
				error: null
			}
		}

		$scope.checkEmail = function(){

			if (emailValidate.test($scope.new_email)){
				$scope.l.email.error = null;
			} else {
				$scope.l.email.error = 'Please enter a valid email.';
			}

		};

		$scope.checkPassword = function(){

			if (/.{4,}/.test($scope.new_password)){
				$scope.l.password.error = null;
			} else {
				$scope.l.password.error = 'Password must be 3 or more characters.';
			}

		};

		$scope.saveUser = function(type){

			var message;

			if (type == 'gamertag' && $scope.new_gamertag.toLowerCase() != current_user.gamertag.toLowerCase() && $scope.new_gamertag.length > 0){

				message = 'You will need to re-confirm your gamertag.';

				if (confirm(message)){

					$scope.l.gamertag.saving = true;

					this.options = {
						type: 'users',
						id: current_user.objectId
					};

					var User = new ApiModel({user: {gamertag: $scope.new_gamertag,gamertagVerified: false}});
	
					User.$save(this.options,function(data){

						current_user.gamertag = $scope.new_gamertag;
						current_user.gamertagVerified = false;
						$scope.$parent.current_user = current_user;
						$scope.l.gamertag.saving = false;

					},function(){

						$scope.new_gamertag = current_user.gamertag;
						$scope.l.gamertag.saving = false;

					});

				} else {
					$scope.new_gamertag = current_user.gamertag;
				}

				return false;

			};

			if (type == 'email' && $scope.new_email.toLowerCase() != current_user.email.toLowerCase()){

				if (emailValidate.test($scope.new_email)){

				} else {
					return false;
				}

				message = 'Please confirm you wish to change your email to '+$scope.new_email+'. This will be your new login email.';

				if (confirm(message)){

					$scope.l.email.saving = true;

					this.options = {
						type: 'users',
						id: current_user.objectId
					};

					var User = new ApiModel({user: {email: $scope.new_email,username: $scope.new_email}});
	
					User.$save(this.options,function(data){

						current_user.email = $scope.new_email;
						$scope.$parent.current_user = current_user;
						$scope.l.email.saving = false;

					},function(){

						$scope.new_email = current_user.email;
						$scope.l.email.saving = false;

					});

				} else {
					$scope.new_email = current_user.email;
					$scope.l.email.error = null;
				}

				return false;

			};

			if (type == 'password'){

				if (!/.{4,}/.test($scope.new_password)){
					return false;
				}

				message = 'Are your sure you wish to change your password to:\n\n'+$scope.new_password;

				if (confirm(message)){

					$scope.l.password.saving = true;

					this.options = {
						type: 'users',
						id: current_user.objectId
					};

					var User = new ApiModel({user: {password: $scope.new_password}});
	
					User.$save(this.options,function(data){

						$scope.l.password.saving = false;
						$scope.new_password = null;

					},function(){

						$scope.new_password = null;
						$scope.l.password.saving = false;

					});

				} else {
					$scope.new_password = null;
				}

				return false;

			};

		};

	}
];