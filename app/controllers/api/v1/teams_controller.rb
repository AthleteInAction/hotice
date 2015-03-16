module Api
  module V1
  	class TeamsController < ApplicationController

  		def index

        setup = {
          path: '/classes/Teams'
        }

        setup[:where] = params[:constraints] if params[:constraints]
        setup[:count] = params[:count] if params[:count]
        setup[:limit] = params[:limit] if params[:limit]

  			call = db.APICall setup

  			render json: call

  		end

      def myteams

        c = {
          user: {
            '__type' => 'Pointer',
            'className' => '_User',
            'objectId' => session[:user]['objectId']
          },
          type: 'team'
        }

        call = db.APICall path: '/classes/Relations',where: c.to_json,include: 'team'

        render json: call

      end

  		def create

        params[:team][:name_i] = params[:team][:name].to_s.downcase

  			call_1 = db.APICall path: '/classes/Teams',method: 'POST',payload: params[:team]

        if call_1[:code] == 201

          r = {
            team: {
              '__type' => 'Pointer',
              'className' => 'Teams',
              'objectId' => call_1[:body]['objectId']
            },
            user: params[:team][:creator],
            type: 'team',
            admin: true,
            status: 'accepted'
          }

          call_2 = db.APICall path: '/classes/Relations',method: 'POST',payload: r

          status = call_2[:code]

        else

          status = call_1[:code]

        end

  			render json: {call_1: call_1,call_2: call_2},status: status.to_i

  		end

      def show

        call = db.APICall path: '/classes/Relations',where: {type: 'team',team: {'__type' => 'Pointer','className' => 'Teams','objectId' => params[:id]}}.to_json,include: 'team,user'

        render json: call

      end

  	end
  end
end