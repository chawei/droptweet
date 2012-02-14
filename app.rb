require 'sinatra/base'
require 'json'
require './init'

class App < Sinatra::Base
  set :root, File.dirname(__FILE__)

  get '/' do
    erb :index
  end

  put '/' do
    temp_file = params["tweet_file"][:tempfile]
    temp_file = File.open(temp_file.path)
    data = temp_file.read

    timestamp = Time.now.to_i
    filename  = "#{timestamp}-#{params["tweet_file"][:filename]}"
    p "root: #{settings.root}"
    File.open("/app/tmp/#{filename}", "w") do |f|
      f.write(data)
    end

    p params["tweet_caption"]
   
    content_type :json
    { :temp_filename => temp_file.path }.to_json
  end

  post '/droptweet' do
    filename = params["image_filename"]
    caption  = params["caption"]

    p filename
    p caption
    f = File.open("#{filename}")
    data = f.read
    p Twitter.update_with_media(caption, data)
  end
end
