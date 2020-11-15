require 'open-uri'
require 'zip'

namespace :cards do
  desc "TODO"
  task upload: :environment do
    content = open('https://www.mtgjson.com/files/AllPrintingsCSVFiles.zip')

    Zip::File.open_buffer(content) do |zip|
      zip.each do |entry|
        # TODO - Find required files by name
        # Read through content
        # Update database of cards
      end
    end
    
    # output_file = File.new(
    #   'allCards.txt', 'w'
    # )

    # output_file.puts(download.read)

    # output_file.close
  end

end
