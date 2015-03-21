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

		$scope.message = {};
		$scope.messages = {
			inbox: [],
			sent: []
		};
		$scope.sentI = 0;
		$scope.inboxI = 0;

		$scope.message_add = '';

		$scope.addRecipient = function(user){

			$scope.message.recipient = user;
			$('#message-input').focus();


		};
		$scope.removeRecipient = function(){

			delete $scope.message.recipient;
			$('#message-add').focus();

		};

		$scope.createMessage = function(){

			$scope.$parent.x.message = true;

			this.options = {
				type: 'inbox'
			};

			var m = {
				message: {
					user: makePointer($scope.$parent.current_user,'_User'),
					recipient: makePointer($scope.message.recipient,'_User'),
					body: $scope.message.body
				},
				user: $scope.$parent.current_user
			}

			var Message = new ApiModel(m);

			Message.$create(this.options,function(data){
				JP(data);
				delete $scope.message.recipient;
				$scope.messages.sent.unshift(data.message);
				$scope.$parent.x.message = false;
				$scope.tab = 'sent';

			});

		};

		$scope.getMessages = function(){

			this.options = {
				type: 'inbox'
			};

			ApiModel.query(this.options,function(data){

				$.each(data.body.results,function(key,val){

					if (val.user.objectId == $scope.$parent.current_user.objectId){
						$scope.messages.sent.push(val);
					} else {
						$scope.messages.inbox.push(val);
					}

				});

				JP($scope.messages);

			});

		};
		$scope.getMessages();

	}
];