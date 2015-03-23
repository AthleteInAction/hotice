var MessagesCtrl = ['$scope','$routeParams','API',
	function($scope,$routeParams,API){

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

		$scope.inboxI = 0;
		$scope.sentI = 0;

		$scope.messages = API.messages;
		$scope.reply = $scope.messages.new();
		$scope.composer = $scope.messages.new({user: $scope.$parent.current_user});

		$scope.sendMessage = function(message){

			message.save(function(){

				$scope.tab = 'sent';

			});

		};

	}
];