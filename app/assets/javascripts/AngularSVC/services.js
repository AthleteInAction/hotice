// API
// ======================================================================
// ======================================================================
HotIce.service('API',['TeamsSVC','MessagesSVC',function(TeamsSVC,MessagesSVC){

	this.messages = MessagesSVC.messages;
	this.teams = TeamsSVC.teams;

}]);
// ======================================================================
// ======================================================================