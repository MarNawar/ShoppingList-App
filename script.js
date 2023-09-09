const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clearButton = document.getElementById('clear');
const itemFilter = document.getElementById('filter');
const formBtn =itemForm.querySelector('button');
let isEditMode = false;

function displayItem(){
  const itemsFromStorage = getItemFromStorage();

  itemsFromStorage.forEach((item)=>{
    addItemToDom(item);
    checkUI();
  });
}

function onAddItemSubmmit(e){
  e.preventDefault();

  const newItem = itemInput.value;

  //Validate Input
  if(newItem === ''){
    alert('please fiil the item');
    return;
  }
  //check for edit mode
  if(isEditMode){
    const itemToEdit = itemList.querySelector('.edit-mode');
    removeItemFromStorage(itemToEdit.textContent);
    itemToEdit.remove('edit-mode');
    isEditMode=false;
  }
  else{
    if(checkIfItemExits(newItem)){
      alert('That Item Already Exits');
      return;
    }
  }

  // creat item list to DOM element
  addItemToDom(newItem);

  // add item to local storage
  addItemToStorage(newItem);

  checkUI();

  itemInput.value='';
}

function addItemToDom(item){
  const li = document.createElement('li');
  li.appendChild(document.createTextNode(item));

  const button = creatButton('remove-item btn-link text-red');
  li.appendChild(button);

  //add li to DOM
  itemList.appendChild(li);
}

function addItemToStorage(item){
  let itemsFromStorage = getItemFromStorage();

  //Add new item to array
  itemsFromStorage.push(item);

  localStorage.setItem('items',JSON.stringify(itemsFromStorage));
}

function getItemFromStorage(){
  let itemsFromStorage;

  if(localStorage.getItem('items') === null){
    itemsFromStorage = [];
  }
  else{
    itemsFromStorage = JSON.parse(localStorage.getItem('items'));
  }
  return itemsFromStorage;
}


function creatButton(classes){
  const button = document.createElement('button');
  button.className = classes;
  const icon = creatIcon('fa-solid fa-xmark');
  button.appendChild(icon);
  return button;
}

function creatIcon(classes){
  const icon = document.createElement('i');
  icon.className = classes;
  return icon;
}

function onClickItem(e){
  if(e.target.parentElement.classList.contains('remove-item')){
    removeItem(e.target.parentElement.parentElement); 
  }
  else{
    setItemToEdit(e.target);
  }
}

function checkIfItemExits(item){
  const itemsFromStorage = getItemFromStorage();
  return itemsFromStorage.includes(item);
}

function setItemToEdit(item){
  isEditMode = true;
  itemList.querySelectorAll('li').forEach((itm)=>{
    if(itm.classList.contains('edit-mode')){
      itm.classList.remove('edit-mode')
    }
  });
  item.classList.add('edit-mode');
  formBtn.innerHTML = ` 
    <i class="fa-solid fa-pen"></i> Update Item
  `;
  formBtn.style.backgroundColor = '#228B22';
  itemInput.value = item.textContent;
}

function removeItem(item){
  if(confirm('Are you sure?')){
    //remove item from DOM
    item.remove();

    //remove item from list
    removeItemFromStorage(item.textContent);

    checkUI();
  }
}

function removeItemFromStorage(item){
  let itemsFromStorage = getItemFromStorage();

  //filter out item to be removed
  itemsFromStorage = itemsFromStorage.filter((itm)=>{
    return itm !== item;
  });

  //reset to localStorage
  localStorage.setItem('items',JSON.stringify(itemsFromStorage));
}


function clearItems(){
  while(itemList.firstElementChild){
    itemList.removeChild(itemList.firstElementChild);
  }

  localStorage.removeItem('items');
  checkUI(); 
}

function filterItems(e){
  const text = e.target.value.toLowerCase();

  const items = itemList.querySelectorAll('li');
  items.forEach((itm)=>{
    const itmName = itm.textContent.toLowerCase();

    if(itmName.indexOf(text)!== -1){
      itm.style.display = 'flex';
    }
    else{
      itm.style.display = 'none';
    }
  });
}

function checkUI(){
  const items = itemList.querySelectorAll('li');
  if(items.length===0){
    clearButton.style.display = 'none';
    itemFilter.style.display = 'none';
  }
  else{
    clearButton.style.display = 'block';
    itemFilter.style.display = 'block';
  }
  formBtn.innerHTML = ` 
    <i class="fa-solid fa-plus"></i> Add Item
  `;
  formBtn.style.backgroundColor = '#333';
  isEditMode=false;
  itemInput.value='';
}

// Event Listeners
itemForm.addEventListener('submit',onAddItemSubmmit);
itemList.addEventListener('click',onClickItem);
clearButton.addEventListener('click',clearItems);
itemFilter.addEventListener('input', filterItems);
document.addEventListener('DOMContentLoaded', displayItem);
checkUI();
