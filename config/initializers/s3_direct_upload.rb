S3DirectUpload.config do |c|
  c.access_key_id     = 'AKIAJESFR4VBZDPKD3MA'
  c.secret_access_key = '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'
  c.bucket            = 'vaton2'
  c.region            = "s3"
  c.url = "https://#{c.bucket}.s3.amazonaws.com/" #"https://vaton2.s3-ap-southeast-1.amazonaws.com"
end