module Api
  module V1
  	class NotificationsController < ApplicationController

  		def index

  			call = db.APICall path: '/classes/Notifications',where: {userId: {__type: 'Pointer',className: '_User',objectId: session[:user]['objectId']}}.to_json,order: 'createdAt'

  			render json: call

  		end

  		def team_accept

  			render json: params

  		end

  	end
  end
end