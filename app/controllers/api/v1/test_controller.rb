module Api
  module V1
  	class TestController < ApplicationController

  		def index

        test = {
          '$or' => [

            {
              user: {
                '__type' => 'Pointer',
                'className' => '_User',
                'objectId' => 'sajlUe2o1I'
              },
              type: 'team'
            },

            {
              event: {
                '__type' => 'Pointer',
                'className' => 'Events',
                'objectId' => 'QbpXiJZ7c4'
              },
              type: 'event'
            }

          ]
        }

  			test1 = {
          event: {
            '$in' => [
              {
                '__type' => 'Pointer',
                'className' => 'Events',
                'objectId' => 'QbpXiJZ7c4'
              }
            ]
          },
          type: {
            '$in' => ['event','team']
          }
        }

  			call = db.APICall path: '/classes/Relations',where: test.to_json,include: 'team,user'

        render json: call

      end

  	end
  end
end