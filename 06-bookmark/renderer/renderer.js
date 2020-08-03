/**
 * Contains logic for the renderer process (the process that runs BrowserWindow)
 */
const { ipcRenderer } = require('electron')

const items = require('./items')

// DOM Nodes
let showModal = document.getElementById('show-modal'),
  closeModal = document.getElementById('close-modal'),
  modal = document.getElementById('modal'),
  addItem = document.getElementById('add-item'),
  itemUrl = document.getElementById('url')

// Disable & Enable modal buttons
const toggleModalButtons = () => {
  // Check state of buttons
  if (addItem.disabled) {
    addItem.disabled = false
    addItem.style.opacity = 1
    addItem.innerText = 'Adding'
    closeModal.style.display = 'inline'
  } else {
    addItem.disabled = true
    addItem.style.opacity = 0.5
    addItem.innerText = 'Adding...'
    closeModal.style.display = 'none'
  }
}

// Show modal
showModal.addEventListener('click', e => {
  modal.style.display = 'flex'
  itemUrl.focus()
})

// Hide modal
closeModal.addEventListener('click', e => {
  modal.style.display = 'none'
})

// Handle new item
addItem.addEventListener('click', e => {
  // Check if a URL was entered
  if (itemUrl.value) {
    // Send new item URL to main process
    ipcRenderer.send('new-item', itemUrl.value)

    // Disable buttons
    toggleModalButtons()
  }
})

// Listen for new item from main process
ipcRenderer.on('new-item-success', (e, newItem) => {
  // Add new item to "items" DOM node
  items.addItem(newItem, true)

  // Enable buttons
  toggleModalButtons()

  // Hide modal and clear value
  modal.style.display = 'none'
  itemUrl.value = ''
})

// Listen for keyboard event
itemUrl.addEventListener('keyup', e => {
  if (e.key === 'Enter') addItem.click()
})
