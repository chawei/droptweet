require 'yaml'
require 'twitter'

config = YAML.load_file('twitter.yml')
Twitter.configure do |c|
  c.consumer_key = config['consumer_key']
  c.consumer_secret = config['consumer_secret']
  c.oauth_token = config['oauth_token']
  c.oauth_token_secret = config['oauth_token_secret']
end
