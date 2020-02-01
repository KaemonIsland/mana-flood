module ApplicationHelper
  def full_title(page_title = '')
    title = "Mana Flood"
    page_title.empty? ? title : "#{page_title} | #{title}"
  end
end
