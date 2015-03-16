module Api
  module V1
  	class EventsController < ApplicationController

  		def index

  			call = db.APICall path: '/classes/Events',where: params[:constraints]

  			render json: call

  		end

  		def show

  			call = db.APICall path: '/classes/Events',where: {objectId: params[:id]}.to_json

  			render json: call

  		end

  		def update

  			call = db.APICall method: 'PUT',path: "/classes/Events/#{params[:id]}",payload: {registered: params[:event][:registered]}

  			render json: call

  		end

  	end
  end
end