var EASHLCtrl = ['$scope','$routeParams','ApiModel','$timeout','$interval',
	function($scope,$routeParams,ApiModel,$timeout,$interval){

		$scope.params = $routeParams;

		var tabs = {
			'top-100': 'top-100',
			'season-rank': 'season-rank'
		}
		$scope.tab = tabs[$scope.params.tab] || 'top-100';

		$scope.loading1 = false;

		$scope.getTop100 = function(){

			$scope.loading1 = true;

			this.options = {
				type: 'eashl',
				sub: 'top-100'
			};

			ApiModel.query(this.options,function(data){

				var tmp = [];

				angular.forEach(data.teams,function(val,key){

					val.rank = parseInt(val.rank);
					tmp.push(val);

				});
				$scope.teams = tmp;

				$scope.loading1 = false;

			});

		};
		$scope.getSeasonRankings = function(){

			$scope.loading2 = true;

			this.options = {
				type: 'eashl',
				sub: 'season-rank'
			};

			ApiModel.query(this.options,function(data){

				var tmp = [];

				angular.forEach(data.teams,function(val,key){

					val.rankingPoints = parseInt(val.rankingPoints);
					tmp.push(val);

				});
				$scope.teams2 = tmp;

				$scope.loading2 = false;

			});

		};
		$scope.getTop100();
		$scope.getSeasonRankings();

	}
];