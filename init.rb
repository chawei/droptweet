require 'yaml'
require 'twitter'

begin
  config = YAML.load_file('twitter.yml')
rescue
  config = {'consumer_key'       => ENV['TWITTER_CONSUMER_KEY'],
            'consumer_secret'    => ENV['TWITTER_CONSUMER_SECRET'],
            'oauth_token'        => ENV['TWITTER_OAUTH_TOKEN'],
            'oauth_token_secret' => ENV['TWITTER_OAUTH_TOKEN_SECRET']
            }
end

Twitter.configure do |c|
  c.consumer_key = config['consumer_key']
  c.consumer_secret = config['consumer_secret']
  c.oauth_token = config['oauth_token']
  c.oauth_token_secret = config['oauth_token_secret']
end
