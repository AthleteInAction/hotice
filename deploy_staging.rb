puts "\n\n"
puts 'Switch to staging branch'
puts '====='*10
puts '====='*10
system 'git checkout staging'
puts '====='*10
puts '====='*10

puts "\n\n"
puts 'Merge local branch to staging branch'
puts '====='*10
puts '====='*10
system 'git merge local'
puts '====='*10
puts '====='*10

puts "\n\n"
puts 'Push to staging'
puts '====='*10
puts '====='*10
system 'git push origin staging'
puts '====='*10
puts '====='*10

puts "\n\n"
puts 'Switch back to local branch'
puts '====='*10
puts '====='*10
system 'git checkout local'
puts '====='*10
puts '====='*10

puts "\n\n"
puts '!!!!!'*10
puts '!!!!!'*10
puts 'FINISHED!'
puts '!!!!!'*10
puts '!!!!!'*10
puts "\n\n"