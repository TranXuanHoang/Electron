let items = document.getElementById('items')

// Track items in the local storage of the renderer's BrowserWindow
exports.storage = JSON.parse(localStorage.getItem('readit-items')) || []

// Persist 'storage' array to the browser's local storage
exports.save = () => {
  localStorage.setItem('readit-items', JSON.stringify(this.storage))
}

// Add new item
exports.addItem = (item, isNew = false) => {
  // Create a new DOM node
  let itemNode = document.createElement('div')

  // Assign "read-item" class
  itemNode.setAttribute('class', 'read-item')

  // Add inner HTML
  itemNode.innerHTML = `<img src="${item.screenshot}"><h3>${item.title}</h3>`

  // Append new DOM node to the list of "items"
  items.appendChild(itemNode)

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
