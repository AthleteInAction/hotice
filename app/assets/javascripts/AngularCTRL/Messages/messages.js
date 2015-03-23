var MessagesCtrl = ['$scope','$routeParams','API','ApiModel','$timeout',
	function($scope,$routeParams,API,ApiModel,$timeout){

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

		// $scope.inboxI = 0;
		$scope.sentI = 0;
		// Channel Count
		$scope.c = angular.copy($scope.$parent.channel.messages.length);
		// Selected Message
		$scope.s = null;

		$scope.messages = API.messages;
		$scope.messages.getInbox(function(data){

			$scope.c = angular.copy($scope.$parent.channel.messages.length);
			if (data.length > 0){
				$scope.s = data[0];
				$scope.setRead($scope.s);
			}
			$scope.checkNew();

		});

		$scope.reply = API.messages.new();
		$scope.composer = API.messages.new({user: $scope.$parent.current_user});

		$scope.setReply = function(message){

			$scope.reply = API.messages.new({
				user: $scope.$parent.current_user,
				recipient: message.user
			});

		};

		$scope.sendMessage = function(message){

			message.save(function(){

				$scope.reply = API.messages.new({
					user: $scope.$parent.current_user,
					recipient: $scope.s.user
				});
				$scope.tab = 'sent';

			});

		};

		$scope.setRead = function(message){

			if ($scope.$parent.channel.messages.contains('objectId',message.objectId)){

				this.options = {
					type: 'channel',
					id: message.objectId
				};

				ApiModel.destroy(this.options,function(data){

					$scope.$parent.channel.messages.removeWhere('objectId',message.objectId);

				});

			}

		};

		$scope.selectBody = function(){

			setTimeout(function(){

				$('.message-input').focus();

			},10);

		};

		$scope.checkNew = function(){

			if ($scope.$parent.channel.messages.length != $scope.c){

				if ($scope.$parent.channel.messages.length > $scope.c){$scope.messages.getInbox();}
				$scope.c = angular.copy($scope.$parent.channel.messages.length);

			};

			$timeout(function(){

				$scope.checkNew();

			},1000);

		};

	}
];