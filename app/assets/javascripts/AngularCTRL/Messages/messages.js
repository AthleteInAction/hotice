var MessagesCtrl = ['$scope','$routeParams','API','ApiModel','$interval',
	function($scope,$routeParams,API,ApiModel,$interval){

		$scope.$on('$destroy',function() {
		    // Make sure that the interval is destroyed too
		    JP('STOP CHECKNEW');
		    $interval.cancel(t);
		});

		$scope.params = $routeParams;

		$scope.tabs = {'inbox': 'inbox','sent': 'sent','compose': 'compose'};
		$scope.tab = $scope.tabs[$scope.params.tab] || 'inbox';

		// Channel Count
		$scope.c = angular.copy($scope.$parent.channel.messages.length);

		$scope.$parent.messages.getInbox(function(){

			$scope.c = angular.copy($scope.$parent.channel.messages.length);
			$scope.checkNew();

		});

		$scope.selectedMessage = {
			inbox: null,
			sent: null
		};

		$scope.selectMessage = function(message,type){

			$scope.setRead(message);

			$scope.reply = $scope.$parent.messages.new();
			$scope.reply.user = $scope.$parent.current_user;
			$scope.reply.recipient = message.user;

			$scope.selectedMessage[type] = message;

		};

		$scope.sendMessage = function(message){

			message.save(function(){

				$scope.selectMessage(message,'sent');
				$scope.$parent.composer = $scope.$parent.messages.new({user: $scope.$parent.current_user});

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

				if ($scope.$parent.channel.messages.length > $scope.c){$scope.$parent.messages.getInbox();}
				$scope.c = angular.copy($scope.$parent.channel.messages.length);

			};

		};

		var t = $interval(function(){

			$scope.checkNew();

		},1000);

	}
];