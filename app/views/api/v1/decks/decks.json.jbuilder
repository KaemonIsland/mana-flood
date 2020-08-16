json.array! @decks do |deck|
  json.(deck, *deck.attributes.keys)
  json.colors deck.colors
end

