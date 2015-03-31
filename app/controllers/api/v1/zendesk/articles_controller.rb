# 200630628
module Api
  module V1
  	module Zendesk

  		class ArticlesController < ApplicationController

  			def index

  				if params[:section]

  					call = zd.GetArticles section: params[:section]

  				else

  					call = zd.GetArticles

  				end

  				render json: call,status: call[:code].to_i

  			end

  			def show

  				call = zd.GetArticle params[:id]

  				render json: call

  			end

  		end

  	end
  end
end