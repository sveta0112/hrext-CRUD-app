$(document).ready(function() {
  var input = document.getElementById('item');

  // loading all to activities in the itemsArray
  var itemsArray;
  if (localStorage.getItem('items')) {
    itemsArray = JSON.parse(localStorage.getItem('items'));
    createGrid(itemsArray);
  } else {
    itemsArray = [];
  }


function isEquivalent(a, b) { 
  // Create arrays of property names 
  var aProps = Object.getOwnPropertyNames(a); 
  var bProps = Object.getOwnPropertyNames(b); 
  // If number of properties is different, // objects are not equivalent 
  if (aProps.length != bProps.length) { 
     return false; 
  } 
  for (var i = 0; i < aProps.length; i++) { 
     var propName = aProps[i]; 
     // If values of same property are not equal, // objects are not equivalent 
     if (a[propName] !== b[propName]) { 
       return false; 
     } 
  } 
  // If we made it this far, objects // are considered equivalent return true; }  
  return true;
}

// creating Todo Object
function Todo(task) {
    var obj = {};
    var taskDate = new Date();
    var myId = getHighestId();
    obj.taskId = myId.toString();
    obj.task = task;
    obj.created_at = taskDate.toLocaleString();
    return obj;
}
//getting id of the object, the highest one to avoid conflict with duplicate id number
function getHighestId(){
  var highestId = itemsArray.length + 1;
  for(var i = 0; i < itemsArray.length; i++){
      highestId = Number(itemsArray[i].taskId) + 1;
  }
  return highestId;
}

// Adding object-collection to localStorage
 //at first populate object from hmtl form input
 //and push the object to object-collection
$('#local_storage_form').submit(function(e) {
  e.preventDefault();

  itemsArray.push(Todo(input.value));

  localStorage.setItem('items', JSON.stringify(itemsArray));
  createGrid(JSON.parse(localStorage.getItem('items')));
  input.value = "";
});

//just option if delete all data from local storage 
$(".confirm").on("click", function() {
  if (confirm('Are you sure?')) {
    localStorage.clear();
    location.reload();
  }
});

//this function takes object-collection
//and based on object values, manually generate table tag and buttons
//after that dynamically generated string is attached as inner html property of '.tbl_user_data'
function createGrid(obj) {
  var tbl = '';
  tbl += '<table class="table table-hover">';

  //create table header 
  tbl += '<thead>';
  tbl += '<tr>';
  tbl += '<th>ID</th>';
  tbl += '<th>Task</th>';
  tbl += '<th>Creation Time</th>';
  tbl += '<th>Save</th>';
  tbl += '<th>Delete</th>';
  tbl += '</tr>';
  tbl += '</thead>';

  //create table body with object collection
  tbl += '<tbody>';
 
    for(var i = 0; i < obj.length; i++){
    var row_id = obj[i].taskId;

    //loop through existing local storage
    tbl += '<tr row_id="' + row_id + '">';
    tbl += '<td><div>' + obj[i].taskId + '</div></td>';
    tbl += '<td><div class="row_data"  col_name="taskcol">' + obj[i].task + '</div></td>';
    tbl += '<td><div>' + obj[i].created_at + '</div></td>';
    tbl += '<td>';
    tbl += '<span class="btn_edit" > <a href="#"  row_id="' + obj[i].taskId + '" > Save change</a> </span></td>';
    tbl += '<td><span class="btn_delete" > <a href="#"  row_id="' + obj[i].taskId + '" > Delete</a> </span></td>';
    tbl += '</tr>';

  }
  tbl += '</tbody>';
  tbl += '</table>';
 
 $('.tbl_user_data').html(tbl);
}

//when is click event happens on the table row
//div w/class row_data becomes editable
$(document).on('click', '.row_data', function(e) {
  e.preventDefault();
  //make div editable
  $(this).closest('div').attr('contenteditable', 'true');
  $(this).focus();
});

//when click event happens on individual delete button
//we delete the row
$(document).on('click', '.btn_delete', function(event) {
  event.preventDefault();
  if (confirm('Are you sure?')) {
  var tbl_row = $(this).closest('tr');
  //id of the row
  var row_id = tbl_row.attr('row_id');

  
  //making sure that object-collection same with row_id is not added to newArray
  //newArray is without object that is deleted
  //then clear localStorage and push newArray to localstorage
  var newArray = [];
  for (var i = 0; i < itemsArray.length; i++) {
     if(isEquivalent(itemsArray[i].taskId, row_id) === false){
         newArray.push (itemsArray[i]);
     }
  }
    localStorage.clear();
    localStorage.setItem('items', JSON.stringify(newArray));
    location.reload();
  }

});


$(document).on('click', '.btn_edit', function(e) {
  e.preventDefault();

  var tbl_row = $(this).closest('tr');
  //getting id of table row
  var row_id = tbl_row.attr('row_id');
  
  //getting the editted value
  var col_val;
  tbl_row.find('.row_data').each(function(index, val) {
    col_val = $(this).html();
    
  });
  //finding selected object matching the row_id 
    //row_id = taskId
  //update the task property of the object to user input value   
  for (var i = 0; i < itemsArray.length; i++) {
      if(isEquivalent(itemsArray[i].taskId, row_id) === true){
         itemsArray[i].task = col_val;
      }
    }
    //clear localStorage
    localStorage.clear();
    //push updated object-collection to localStorage
    localStorage.setItem('items', JSON.stringify(itemsArray));
});

});
