module Api
  module V1
  	class InboxController < ApplicationController

      def index

        r = {
          type: 'message',
          '$or' => [
            {
              recipient: {
                '__type' => 'Pointer',
                'className' => '_User',
                'objectId' => session[:user]['objectId']
              }
            }
          ]
        }

        call = db.APICall path: '/classes/Relations',where: r.to_json,order: '-createdAt',include: 'user,recipient',headers: [{'X-Parse-Session-Token' => session[:user]['sessionToken']}]

        render json: call

      end

      def create

        params[:message][:body_html] = params[:message][:body].to_s.gsub(/\n/,'<br>')
        short = params[:message][:body].to_s.gsub(/\n/,' ')
        if short.length > 30

          short = short[0..30].strip
          short << '...'

        end
        params[:message][:body_short] = short

        call = db.APICall path: '/classes/Relations',method: 'POST',payload: params[:message],headers: [{'X-Parse-Session-Token' => session[:user]['sessionToken']}]

        if call[:code].to_i == 201

          params[:message][:objectId] = call[:body]['objectId']
          params[:message][:recipient] = params[:recipient]
          params[:message][:user] = params[:user]
          params[:message][:createdAt] = call[:body]['createdAt']

          final = {
            message: params[:message]
          }

        else

          final = {e: 'An error occured'}

        end

        render json: final,status: call[:code].to_i

      end

  	end
  end
end