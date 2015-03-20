module Api
  module V1
  	class InboxController < ApplicationController

      def index

        r = {
          recipients: {
            '__type' => 'Pointer',
            'className' => '_User',
            'objectId' => session[:user]['objectId']
          }
        }

        call = db.APICall path: '/classes/Relations',where: r.to_json,include: 'user',headers: [{'X-Parse-Session-Token' => session[:user]['sessionToken']}]

        render json: call

      end

      def create

        params[:message][:body_html] = params[:message][:body].to_s.gsub(/\n/,'<br>')

        call = db.APICall path: '/classes/Relations',method: 'POST',payload: params[:message],headers: [{'X-Parse-Session-Token' => session[:user]['sessionToken']}]

        render json: call

      end

  	end
  end
end