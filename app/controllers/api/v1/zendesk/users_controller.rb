# 200630628
module Api
  module V1
  	module Zendesk

  		class UsersController < ApplicationController

        respond_to :json

  			def index

  				respond_with params

  			end

        def many

          call = zd.GetManyUsers ids: params[:ids]

          respond_with call,status: call[:code].to_i

        end

  		end

  	end
  end
end