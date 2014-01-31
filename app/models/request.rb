class Request < ActiveRecord::Base
	belongs_to :user
	belongs_to :coach
	has_many :scenes

	has_attached_file :movie,
	  								:storage => :s3,
	                  :s3_credentials => "#{Rails.root}/config/aws.yml",
	                  :path => ":class/:attachment/:id/:style/:filename",
	                  :url => ':s3_domain_url'
end
