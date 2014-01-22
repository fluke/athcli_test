json.array!(@requests) do |request|
  json.extract! request, :id, :title, :movie_url, :user_id, :coach_id
  json.url request_url(request, format: :json)
end
