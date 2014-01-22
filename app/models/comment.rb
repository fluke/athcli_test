class Comment < ActiveRecord::Base
	belongs_to :coach
	belongs_to :user
	belongs_to :scene
end
