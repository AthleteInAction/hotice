module Tools

	module_function
	def updateUserKey id,gamertag

        if File.exists?(userPath)

          ulist = JSON.parse File.read(userPath)
          ulist[id.to_s] = gamertag

        else

          ulist = {id.to_s => gamertag}

        end

        write userPath,ulist.to_json

	end

	module_function
	def userKey

		if !File.exist?(userPath)

			write userPath,'{}'

		end

		JSON.parse File.read(userPath)

	end

	module_function
	def updateTeamKey id,name

        if File.exists?(teamPath)

          ulist = JSON.parse File.read(teamPath)
          ulist[id.to_s] = name

        else

          ulist = {id.to_s => name}

        end

        write userPath,ulist.to_json

	end

	module_function
	def teamKey

		if !File.exist?(teamPath)

			write teamPath,'{}'

		end

		JSON.parse File.read(teamPath)

	end

	def userPath

		"#{Rails.root}/log/users.json"

	end
	def teamPath

		"#{Rails.root}/log/teams.json"

	end

	module_function
	def write path,contents

		File.open path,'w+' do |f|

			f.write contents

		end

	end

	module_function
	def delete file

		FileUtils.rm file

	end

	module_function
	def mkdir path

		FileUtils::mkdir_p path

	end

	module_function
	def deleteNotification userId,relationId

		FileUtils.rm "#{CHANNEL_PATH}/#{userId}/info/#{relationId}.chnl"

	end

	module_function
	def createNotification userId,relationId,data

		path = "#{CHANNEL_PATH}/#{userId}/info"

		mkdir path

		path << "/#{relationId}.chnl"

		write path,data.to_json

	end

end