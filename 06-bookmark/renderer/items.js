// Modules
const fs = require('fs')
const { shell } = require('electron')

let items = document.getElementById('items')

// Get JavaScript code contents from 'reader.js' file
let readerJS
fs.readFile(`${__dirname}/reader.js`, (err, data) => {
  readerJS = data.toString()
})

// Track items in the local storage of the renderer's BrowserWindow
exports.storage = JSON.parse(localStorage.getItem('readit-items')) || []

// Listen for "Done" message from reader window
window.addEventListener('message', e => {
  console.log(e.data)
  if (e.data.action === 'delete-reader-item') {
    // Delete item at given index
    this.delete(e.data.itemIndex)

    // Close the reader window
    e.source.close()
  }
})

// Delete item
exports.delete = itemIndex => {
  // Remove item from DOM
  items.removeChild(items.childNodes[itemIndex])

  // Remove from storage
  this.storage.splice(itemIndex, 1)

  // Persist data
  this.save()

  // Select previous item or new first item if first was deleted
  if (this.storage.length) {
    // Get new selected item index
    let newSelectedItemIndex = itemIndex === 0 ? 0 : itemIndex - 1

    // Set item at new index as selected
    document.getElementsByClassName('read-item')[newSelectedItemIndex].classList.add('selected')
  }
}

// Get selected item index
exports.getSelectedItem = () => {
  // Get selected node
  let currentItem = document.getElementsByClassName('read-item selected')[0]

  // Get item index
  let itemIndex = 0
  let child = currentItem
  while ((child = child.previousSibling) != null) itemIndex++

  // Return selected item and index
  return { node: currentItem, index: itemIndex }
}

// Persist 'storage' array to the browser's local storage
exports.save = () => {
  localStorage.setItem('readit-items', JSON.stringify(this.storage))
}

// Indicate item as selected
exports.select = e => {
  // Unselect currently selected item
  this.getSelectedItem().node.classList.remove('selected')

  // Indicate newly selected item with different color on its left border
  e.currentTarget.classList.add('selected')
}

// Move to newly selected item with arrow up/down keys
exports.changeSelection = direction => {
  // Get currently selected item
  let currentItem = this.getSelectedItem()

  // Handle up/down key
  if (direction == 'ArrowUp' && currentItem.node.previousSibling) {
    currentItem.node.classList.remove('selected')
    currentItem.node.previousSibling.classList.add('selected')
  } else if (direction == 'ArrowDown' && currentItem.node.nextSibling) {
    currentItem.node.classList.remove('selected')
    currentItem.node.nextSibling.classList.add('selected')
  }
}

// Open selected item in native browser
exports.openNative = () => {
  // Only if we have items
  if (!this.storage.length) return

  // Get item currently being selected
  let selectedItem = this.getSelectedItem()

  // Open in system browser
  shell.openExternal(selectedItem.node.dataset.url)
}

// Open selected item
exports.open = () => {
  // Only proceed to open an item if there exists at lest one
  if (!this.storage.length) return

  // Get item currently being selected
  let selectedItem = this.getSelectedItem()

  // Get item's URL
  let contentURL = selectedItem.node.dataset.url
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
  // NOTE: the following eval() currently causes an error
  // Error occurred in handler for 'ELECTRON_GUEST_WINDOW_MANAGER_WEB_CONTENTS_METHOD': Error: An object could not be cloned.
  readerWin.eval(readerJS.replace('{index}', selectedItem.index))
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
