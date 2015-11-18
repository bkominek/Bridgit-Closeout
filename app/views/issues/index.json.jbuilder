json.array!(@issues) do |issue|
  json.extract! issue, :id, :text, :state
  json.url issue_url(issue, format: :json)
end
