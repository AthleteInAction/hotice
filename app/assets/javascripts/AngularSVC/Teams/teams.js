HotIce.service('TeamsSVC',['ApiModel',function(ApiModel){

	this.teams = {

		teams: [],

		get: function(complete){

			var t = this;

			t.loading = true;

			var options = {
				type: 'teams'
			};

			ApiModel.query(options,function(data){

				t.teams = data.body.results;

				delete t.loading;

				if (complete){complete(t.teams);}

			},function(data){

				delete t.loading;

				if (complete){complete();}

			});

		}

	};

}]);