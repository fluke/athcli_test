class Request < ActiveRecord::Base
	belongs_to :user
	belongs_to :coach
	has_many :scenes
end
