# Mana Flood

A passion project with a goal of tracking my MTG collection

## What does it do?

This app allows you to add cards from specific sets, or by search directly to your collection.

You can also build decks along with viewing stats.

Note: Deckbuilding still has a lot of work to be done...

# Installation

This package requires Node v12, Ruby v2.6.3 and Rails v6 to run.

After forking the project: 

* Run `bundle` to install all the ruby packages.
* Then use `yarn install` or `npm install` to get all the JS packages
* You'll then need to run `rails db:setup` to build the db with migrations
* Run `rake cards:update` to add all current cards to the database, this'll take awhile since there are a TON of cards!
* Afterwards you should be able to run the app with `rails s`
* If this all works you just need to create an account and your good to go!

## Warning

Unfortunately this site isn't online for everyone, I don't have the funds to keep it online,
plus there is still a lot of work to do to get it out to the public.

In order to use this app you must install it locally. You can export/import a JSON file of UUIDs and quantity of cards,
this way you can add your collection once the site is live. Also it allows you to sleep nicely knowing that all the cards
you added to the site won't magically dissapear when I break something.
