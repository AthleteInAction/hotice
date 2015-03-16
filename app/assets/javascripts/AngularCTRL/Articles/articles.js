var ArticlesCtrl = ['$scope','$routeParams','$location','ApiModel','$timeout',
	function($scope,$routeParams,$location,ApiModel,$timeout){

		$scope.params = $routeParams;

		$scope.getArticles = function(){

			this.options = {
				type: 'zendesk',
				second: 'articles'
			};

			ApiModel.query(this.options,function(data){

				$scope.articles = data.body.articles;

			});

		};
		$scope.getArticles();

	}
];