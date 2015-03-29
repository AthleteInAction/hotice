module Api
  module V1
    module Messages
      class MessagesController < ApplicationController

        def inbox

          c = {
            type: 'message',
            recipient: {
              '__type' => 'Pointer',
              'className' => '_User',
              'objectId' => session[:user]['objectId']
            },
            blacklist: {
              '$nin' => [
                {
                  '__type' => 'Pointer',
                  'className' => '_User',
                  'objectId' => session[:user]['objectId']
                }
              ]
            }
          }

          call = db.APICall path: '/classes/Relations',where: c.to_json,order: '-createdAt',include: 'user,recipient',headers: [{'X-Parse-Session-Token' => session[:user]['sessionToken']}]

          render json: call,status: call[:code].to_i

        end

        def sent

          c = {
            type: 'message',
            user: {
              '__type' => 'Pointer',
              'className' => '_User',
              'objectId' => session[:user]['objectId']
            },
            blacklist: {
              '$nin' => [
                {
                  '__type' => 'Pointer',
                  'className' => '_User',
                  'objectId' => session[:user]['objectId']
                }
              ]
            }
          }

          call = db.APICall path: '/classes/Relations',where: c.to_json,order: '-createdAt',include: 'user,recipient',headers: [{'X-Parse-Session-Token' => session[:user]['sessionToken']}]

          render json: call,status: call[:code].to_i

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

            path = "#{Rails.root}/channel/#{params[:recipient]['objectId']}/messages"

            FileUtils::mkdir_p path

            channel = {
              objectId: call[:body]['objectId'],
              from: params[:user]['gamertag'],
              body_short: short,
              createdAt: call[:body]['createdAt']
            }
            
            path << "/#{channel[:objectId]}.chnl"

            File.open path,'w+' do |f|

              f.write channel.to_json

            end

          else

            final = {e: 'An error occured'}

          end

          render json: final,status: call[:code].to_i

        end

        def destroy

          p = {
            blacklist: {
              '__op' => 'AddRelation',
              objects: [
                {
                  '__type' => 'Pointer',
                  'className' => '_User',
                  'objectId' => session[:user]['objectId']
                }
              ]
            }
          }

          call = db.APICall path: "/classes/Relations/#{params[:id]}",method: 'PUT',payload: p

          render json: call,status: call[:code].to_i

        end

      end
    end
  end
end