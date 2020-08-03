// Modules
const fs = require('fs')

let items = document.getElementById('items')

// Get JavaScript code contents from 'reader.js' file
let readerJS
fs.readFile(`${__dirname}/reader.js`, (err, data) => {
  readerJS = data.toString()
})

// Track items in the local storage of the renderer's BrowserWindow
exports.storage = JSON.parse(localStorage.getItem('readit-items')) || []

// Persist 'storage' array to the browser's local storage
exports.save = () => {
  localStorage.setItem('readit-items', JSON.stringify(this.storage))
}

// Indicate item as selected
exports.select = e => {
  // Unselect currently selected item
  document.getElementsByClassName('read-item selected')[0].classList.remove('selected')

  // Indicate newly selected item with different color on its left border
  e.currentTarget.classList.add('selected')
}

// Move to newly selected item with arrow up/down keys
exports.changeSelection = direction => {
  // Get currently selected item
  let currentItem = document.getElementsByClassName('read-item selected')[0]

  // Handle up/down key
  if (direction == 'ArrowUp' && currentItem.previousSibling) {
    currentItem.classList.remove('selected')
    currentItem.previousSibling.classList.add('selected')
  } else if (direction == 'ArrowDown' && currentItem.nextSibling) {
    currentItem.classList.remove('selected')
    currentItem.nextSibling.classList.add('selected')
  }
}

// Open selected item
exports.open = () => {
  // Only proceed to open an item if there exists at lest one
  if (!this.storage.length) return

  // Get item currently being selected
  let selectedItem = document.getElementsByClassName('read-item selected')[0]

  // Get item's URL
  let contentURL = selectedItem.dataset.url
  let readerWin = window.open(contentURL, '', `
    maxWidth=2000,
    maxHeight=2000,
    width=1200,
    height=800,
    backgroundColor=#DEDEDE,
    nodeIntegration=0,
    contextIsolation=1
  `)

  // Inject JavaScript code
  readerWin.eval(readerJS)
}

// Add new item
exports.addItem = (item, isNew = false) => {
  // Create a new DOM node
  let itemNode = document.createElement('div')

  // Assign "read-item" class
  itemNode.setAttribute('class', 'read-item')

  // Set item url as data attribute
  itemNode.setAttribute('data-url', item.url)

  // Add inner HTML
  itemNode.innerHTML = `<img src="${item.screenshot}"><h3>${item.title}</h3>`

  // Append new DOM node to the list of "items"
  items.appendChild(itemNode)

  // Attach click handler to each item
  itemNode.addEventListener('click', this.select)

  // Attach double click handler to each item
  itemNode.addEventListener('dblclick', this.open)

  // If this is the first item, select it
  if (document.getElementsByClassName('read-item').length === 1) {
    itemNode.classList.add('selected')
  }

  // Also append the item to the "storage" array and persist it
  if (isNew) {
    this.storage.push(item)
    this.save()
  }
}

// Load items from local storage when app reloads
this.storage.forEach(item => {
  this.addItem(item)
})
