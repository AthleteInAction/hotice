module Api
  module V1
  	class EashlController < ApplicationController

  		respond_to :json

  		def top_100

  			live = false

  			path_1 = "#{Rails.root}/log/eashl_top-100_time.txt"

  			if !File.exists?(path_1)

  				File.open path_1,'w+' do |f|

  					f.write '0'

  				end

  			end

  			path = "#{Rails.root}/log/eashl_top-100.json"

  			if !File.exists?(path)

  				File.open path,'w+' do |f|

  					f.write '{}'

  				end

  			end

  			last_get = File.read(path_1).to_i

  			now = Time.now.to_i

  			diff = now - last_get

  			if diff > 600# || true # 10 minutes

  				live = true

  				new_json = Request.get 'https://www.easports.com/iframe/nhl14proclubs/api/platforms/xbox/clubRankLeaderboard'

  				File.open path_1,'w+' do |f|

  					f.write Time.now.to_i.to_s

  				end

  				if new_json[:code] == 200

  					File.open path,'w+' do |f|

  						f.write new_json[:body].to_s

  					end

  				end

  			end

  			json = File.read path
        	json = JSON.parse json.to_s

        	final = {
        		live: live,
        		time: diff,
        		teams: json['raw']
        	}

  			respond_with final

  		end

  		def season_rank

  			live = false

  			path_1 = "#{Rails.root}/log/eashl_season-rank_time.txt"

  			if !File.exists?(path_1)

  				File.open path_1,'w+' do |f|

  					f.write '0'

  				end

  			end

  			path = "#{Rails.root}/log/eashl_season-rank.json"

  			if !File.exists?(path)

  				File.open path,'w+' do |f|

  					f.write '{}'

  				end

  			end

  			last_get = File.read(path_1).to_i

  			now = Time.now.to_i

  			diff = now - last_get

  			if diff > 600# || true # 10 minutes

  				live = true

  				new_json = Request.get 'https://www.easports.com/iframe/nhl14proclubs/api/platforms/xbox/seasonRankLeaderboard'

  				File.open path_1,'w+' do |f|

  					f.write Time.now.to_i.to_s

  				end

  				if new_json[:code] == 200

  					File.open path,'w+' do |f|

  						f.write new_json[:body].to_s

  					end

  				end

  			end

  			json = File.read path
        	json = JSON.parse json.to_s

        	final = {
        		live: live,
        		time: diff,
        		teams: json['raw']
        	}

  			respond_with final

  		end

  	end
  end
end