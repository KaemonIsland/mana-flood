// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.

require('@rails/ujs').start()
require('turbolinks').start()
require('@rails/activestorage').start()
require('channels')
import ReactRailsUJS from 'react_ujs'
import fetch from 'cross-fetch'

global.fetch = fetch

// Creates a context for all of the mana symbols
export const manaSvgs = require.context('./media/manaSymbols', true, /\.svg$/)

// Uncomment to copy all static images under ../images to the output folder and reference
// them with the image_pack_tag helper in views (e.g <%= image_pack_tag 'rails.png' %>)
// or the `imagePath` JavaScript helper below.
//
// const images = require.context('../images', true)
// const imagePath = (name) => images(name, true)
// Support component names relative to this directory:
const componentRequireContext = require.context('app', true)
ReactRailsUJS.useContext(componentRequireContext)
