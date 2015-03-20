var MessagesCtrl = ['$scope','$routeParams','$location','ApiModel','$timeout',
	function($scope,$routeParams,$location,ApiModel,$timeout){

		$scope.params = $routeParams;

		$scope.tabs = {
			'inbox': true,
			'sent': true,
			'compose': true
		};
		$scope.tab = $scope.params.tab;
		if (!$scope.tabs[$scope.params.tab]){
			$scope.tab = 'inbox';
		}

		$scope.message = {
			recipients: []
		};
		$scope.messages = [];

		$scope.message_add = '';

		$scope.addRecipient = function(user){

			$scope.message.recipients.push(user);

		};
		$scope.removeRecipient = function(user){

			$scope.message.recipients.removeWhere('objectId',user.objectId);

		};

		$scope.createMessage = function(){

			this.options = {
				type: 'inbox'
			};

			var m = {
				message: {
					user: makePointer($scope.$parent.current_user,'_User'),
					recipients: makeRelation($scope.message.recipients,'_User'),
					body: $scope.message.body
				}
			}

			var Message = new ApiModel(m);

			Message.$create(this.options,function(data){

				$scope.message = {recipients: []};

			});

		};

		$scope.getMessages = function(){

			this.options = {
				type: 'inbox'
			};

			ApiModel.query(this.options,function(data){

				$scope.messages = data.body.results;

			});

		};
		$scope.getMessages();

	}
];