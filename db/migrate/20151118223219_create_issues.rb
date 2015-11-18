class CreateIssues < ActiveRecord::Migration
  def change
    create_table :issues do |t|
      t.string :text
      t.integer :state

      t.timestamps null: false
    end
  end
end
