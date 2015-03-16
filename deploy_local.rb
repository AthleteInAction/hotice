puts "\n\n"
puts 'Switch to local branch'
puts '====='*10
puts '====='*10
system 'git checkout local'
puts '====='*10
puts '====='*10

puts "\n\n"
puts 'Commit to local branch'
puts '====='*10
puts '====='*10
system 'git add -A'
system "git commit -m 'Ruby: #{Time.now.to_i}'"
puts '====='*10
puts '====='*10

puts "\n\n"
puts 'Push to local'
puts '====='*10
puts '====='*10
system 'git push origin local'
puts '====='*10
puts '====='*10

puts "\n\n"
puts '!!!!!'*10
puts '!!!!!'*10
puts 'FINISHED!'
puts '!!!!!'*10
puts '!!!!!'*10
puts "\n\n"