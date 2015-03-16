module Api
  module V1
  	class NhlController < ApplicationController

  		def scores

        live = false

        path = "#{Rails.root}/log/scores.jsonp"
        if !File.exists?(path) || params[:reset] == 'true'

          File.open path,'w+' do |f|

            f.write '{}'

          end

        end

        lastGetPath = "#{Rails.root}/log/scoreTime.txt"
        if !File.exists?(lastGetPath) || params[:reset] == 'true'

          File.open lastGetPath,'w+' do |f|

            f.write '0'

          end

        end
        lastGet = File.read(lastGetPath).to_i 

        now = Time.now.to_i

        diff = now - lastGet

        if diff > 600# || true # 10 minutes

          live = true

          jsonp = Request.get 'http://live.nhle.com/GameData/RegularSeasonScoreboardv3.jsonp'

          File.open lastGetPath,'w+' do |f|

            f.write Time.now.to_i.to_s

          end

          if jsonp[:code] == 200

            new_json = jsonp[:body].force_encoding("UTF-8")

            File.open path,'w+' do |f|

              f.write new_json

            end

          end

        end

        json = File.read path
        json = JSON.parse json.to_s.gsub('loadScoreboard(','').gsub(')','')

        final = []

        json['games'].each_with_index do |game,i|

          final << game if i >= json['startIndex'].to_i && (game['ts'].to_s.downcase == 'today' || game['ts'].to_s.downcase == 'pre game' || game['tsc'].to_s.downcase == 'progress' || game['tsc'].to_s.downcase == 'critical' || game['tsc'].to_s.downcase == 'final')

        end

        render json: {scores: final,live: live,diff: diff}

  		end

  		def headlines

        live = false

  			# http://www.nhl.com/rss/news.xml
        path = "#{Rails.root}/log/news.xml"

        req = Request.get 'http://www.nhl.com/rss/news.xml'

        if req[:code] == 200 || !File.exists?(path)

          live = true

          pre = req[:body].force_encoding 'UTF-8'

          File.open path,'w+' do |f|

            f.write req[:body]

          end

        else



        end

        pre = File.read path

        json = Crack::XML.parse pre
        json[:live] = live

        render json: json

  		end

  	end
  end
end