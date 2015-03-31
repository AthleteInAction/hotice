var ArticlesShowCtrl = ['$scope','$routeParams','$location','ApiModel','$timeout',
	function($scope,$routeParams,$location,ApiModel,$timeout){

		var scope = $scope;
		scope.params = $routeParams;

		var parent = scope.$parent;

		scope.zd_list = [];
		scope.zd_key = {};

		scope.comments = [];
		scope.comment = {user: current_user};

		scope.getArticle = function(){

			this.options = {
				type: 'zendesk',
				sub: 'articles',
				id: scope.params.id
			};

			ApiModel.query(this.options,function(data){
				
				scope.article = data.body.article;

			});

		};
		scope.getArticle();

	}
];