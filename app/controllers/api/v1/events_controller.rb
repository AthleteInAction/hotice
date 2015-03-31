module Api
  module V1
  	class EventsController < ApplicationController

  		def index
        
  			call = db.APICall path: '/classes/Events',where: params[:constraints],order: 'createdAt',headers: [{'X-Parse-Session-Token' => session[:user]['sessionToken']}]

  			render json: call

  		end

  		def show

  			call = db.APICall path: '/classes/Events',where: {objectId: params[:id]}.to_json,headers: [{'X-Parse-Session-Token' => session[:user]['sessionToken']}]

  			render json: call

  		end

  		def update

  			call = db.APICall method: 'PUT',path: "/classes/Events/#{params[:id]}",payload: {registered: params[:event][:registered]},headers: [{'X-Parse-Session-Token' => session[:user]['sessionToken']}]

  			render json: call

  		end

  	end
  end
end