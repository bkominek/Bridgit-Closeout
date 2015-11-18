class Issue < ActiveRecord::Base
    validates :text, :presence => true
end
