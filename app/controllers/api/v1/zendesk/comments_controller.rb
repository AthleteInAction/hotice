# 200630628
module Api
  module V1
  	module Zendesk

  		class CommentsController < ApplicationController

        respond_to :json

  			def index

          c = {
            articleId: params[:article_id],
            type: 'article_comment'
          }

  				call = db.APICall path: "/classes/Relations",where: c.to_json,include: 'user',order: 'createdAt',headers: [{'X-Parse-Session-Token' => session[:user]['sessionToken']}]

          respond_with call,status: call[:code].to_i

  			end

        def create

          comment = {
            articleId: params[:article_id],
            user: {
              '__type' => 'Pointer',
              'className' => '_User',
              'objectId' => params[:comment][:user]['objectId']
            },
            body: params[:comment][:body],
            body_html: params[:comment][:body].to_s.gsub(/\n/,'<br>'),
            type: 'article_comment'
          }

          call = db.APICall path: '/classes/Relations',method: 'POST',payload: comment,headers: [{'X-Parse-Session-Token' => session[:user]['sessionToken']}]

          if call[:code].to_i == 201

            comment[:objectId] = call[:body]['objectId']
            comment[:user] = params[:comment][:user]
            comment[:createdAt] = Time.now

            final = {comment: comment}

          else

            final = call

          end

          render json: final,status: call[:code].to_i

        end

  		end

  	end
  end
end