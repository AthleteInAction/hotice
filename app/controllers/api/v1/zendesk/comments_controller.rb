# 200630628
module Api
  module V1
  	module Zendesk

  		class CommentsController < ApplicationController

        respond_to :json

  			def index

  				call = zd.GetArticleComments params[:article_id]

          respond_with call,status: call[:code].to_i

  			end

        def create

          call = zd.CreateArticleComment params[:article_id],params[:comment]

          render json: call,status: call[:code].to_i

        end

  		end

  	end
  end
end