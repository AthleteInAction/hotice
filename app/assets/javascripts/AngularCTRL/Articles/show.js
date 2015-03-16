var ArticlesShowCtrl = ['$scope','$routeParams','$location','ApiModel','$timeout',
	function($scope,$routeParams,$location,ApiModel,$timeout){

		$scope.params = $routeParams;

		$scope.getArticle = function(){

			this.options = {
				type: 'zendesk',
				sub: 'articles',
				id: $scope.params.id
			};

			ApiModel.query(this.options,function(data){
				
				$scope.article = data.body.article;

			});

		};
		$scope.getArticle();

	}
];