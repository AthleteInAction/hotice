module Api
  module V1
  	class CommentsController < ApplicationController

  		respond_to :json

  		def index

        c = {
          match: params[:match],
          type: 'comment'
        }

        call = db.APICall path: "/classes/Relations",where: c.to_json,include: 'user',order: 'createdAt',headers: [{'X-Parse-Session-Token' => session[:user]['sessionToken']}]

        respond_with call,status: call[:code].to_i

      end

      def create

        comment = {
          match: params[:match],
          user: {
            '__type' => 'Pointer',
            'className' => '_User',
            'objectId' => params[:comment][:user]['objectId']
          },
          body: params[:comment][:body],
          body_html: params[:comment][:body].to_s.gsub(/\n/,'<br>'),
          type: 'comment'
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