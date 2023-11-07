//+++++++++++++++++++++++++++================================ Selectors=================================+++++++++++++++++++++++++++++++++++++++

const toDoInput = document.querySelector('.todo-input');
const toDoBtn = document.querySelector('.todo-btn');
const toDoList = document.querySelector('.todo-list');
const standardTheme = document.querySelector('.standard-theme');
const lightTheme = document.querySelector('.light-theme');
const darkerTheme = document.querySelector('.darker-theme');


//+++++++++++++++++++++++++++================================  Event Listeners   +++++++++++++++++++++++++++================================ 

toDoBtn.addEventListener('click', addToDo);
toDoList.addEventListener('click', deletecheck);
document.addEventListener("DOMContentLoaded", getTodos);
standardTheme.addEventListener('click', () => changeTheme('standard'));
lightTheme.addEventListener('click', () => changeTheme('light'));
darkerTheme.addEventListener('click', () => changeTheme('darker'));

// Check if one theme has been set previously and apply it (or std theme if not found):
let savedTheme = localStorage.getItem('savedTheme');
savedTheme === null ?
    changeTheme('standard')
    : changeTheme(localStorage.getItem('savedTheme'));

// +++++++++++++++++++++++++++================================ Functions; +++++++++++++++++++++++++++================================ 



// Define a global variable to track the serial number
let todoSerialNumber = 0;

function addToDo(event) {
    event.preventDefault();

    const toDoDiv = document.createElement("div");
    toDoDiv.classList.add('todo', `${savedTheme}-todo`);

    const newToDo = document.createElement('li');
    if (toDoInput.value === '') {
        alert("You must write something!");
    } else {
        // Increment the serial number for each new todo item
        todoSerialNumber++;
        newToDo.innerHTML = `<span class="beautiful-font">${todoSerialNumber}</span> ${toDoInput.value}`;
        newToDo.classList.add('todo-item');
        toDoDiv.appendChild(newToDo);

        savelocal(toDoInput.value);

        const checked = document.createElement('button');
        checked.innerHTML = '0';
        checked.classList.add('check-btn', `${savedTheme}-button`);
        toDoDiv.appendChild(checked);

        const deleted = document.createElement('button');
        deleted.innerHTML = '<i class="fas fa-trash"></i>';
        deleted.classList.add('delete-btn', `${savedTheme}-button`);
        toDoDiv.appendChild(deleted);

        toDoList.appendChild(toDoDiv);
        toDoInput.value = '';
    }
}



    // +++++++++++++++++++++++++++================================  delete +++++++++++++++++++++++++++================================ 


function deletecheck(event){
    const item = event.target;

    if(item.classList[0] === 'delete-btn')
    {
        //  +++++++++++++++++++++++++++================================  animation
        item.parentElement.classList.add("fall");

        //removing local todos;
        removeLocalTodos(item.parentElement);

        item.parentElement.addEventListener('transitionend', function(){
            item.parentElement.remove();
        })
    }

     if (item.classList.contains('check-btn')) {
        const toDoDiv = item.parentElement;
        const checkButton = toDoDiv.querySelector('.check-btn');

        // +++++===== Ensure that the initial value is correctly parsed

        let checkValue = parseInt(checkButton.innerText, 10);
        if (isNaN(checkValue)) {
            checkValue = 0; 
        }
        checkValue+= 1;
        checkButton.innerText = checkValue.toString();

        
     }

}


//  +++++++++++++++++++++++++++================================ Saving to local storage: +++++++++++++++++++++++++++================================ 
function savelocal(todo){

    //   ==================Check: if item/s are there;
    let todos;
    if(localStorage.getItem('todos') === null) {
        todos = [];
    }
    else {
        todos = JSON.parse(localStorage.getItem('todos'));
    }

    todos.push(todo);
    localStorage.setItem('todos', JSON.stringify(todos));
}



function getTodos() {


    //                 Check: if item/s are there;
    let todos;
    if(localStorage.getItem('todos') === null) {
        todos = [];
    }
    else {
        todos = JSON.parse(localStorage.getItem('todos'));
    }

    todos.forEach(function(todo) {
        // +++++++++++++++++++++++++++================================  toDo DIV;
        const toDoDiv = document.createElement("div");
        toDoDiv.classList.add("todo", `${savedTheme}-todo`);

        // +++++++++++++++++++++++++++================================  Create LI
        const newToDo = document.createElement('li');
        
        newToDo.innerText = todo;
        newToDo.classList.add('todo-item');
        toDoDiv.appendChild(newToDo);

        // +++++++++++++++++++++++++++================================  check btn;
        const checked = document.createElement('button');
        checked.innerHTML = '<i class="fas fa-check"></i>';
        checked.classList.add("check-btn", `${savedTheme}-button`);
        toDoDiv.appendChild(checked);
        // +++++++++++++++++++++++++++================================  delete btn;
        const deleted = document.createElement('button');
        deleted.innerHTML = '<i class="fas fa-trash"></i>';
        deleted.classList.add("delete-btn", `${savedTheme}-button`);
        toDoDiv.appendChild(deleted);

        // +++++++++++++++++++++++++++================================  Append to list;
        toDoList.appendChild(toDoDiv);
    });
}


function removeLocalTodos(todo){
    // +++++++++++++++++++++++++++================================ Check: if item/s are there;
    let todos;
    if(localStorage.getItem('todos') === null) {
        todos = [];
    }
    else {
        todos = JSON.parse(localStorage.getItem('todos'));
    }

    const todoIndex =  todos.indexOf(todo.children[0].innerText);
    // console.log(todoIndex);
    todos.splice(todoIndex, 1);
    // console.log(todos);
    localStorage.setItem('todos', JSON.stringify(todos));
}

// +++++++++++++++++++++++++++================================  Change theme function:
function changeTheme(color) {
    localStorage.setItem('savedTheme', color);
    savedTheme = localStorage.getItem('savedTheme');

    document.body.className = color;
    // +++++++++++++++++++++++++++================================  Change blinking cursor for darker theme:
    color === 'darker' ? 
        document.getElementById('title').classList.add('darker-title')
        : document.getElementById('title').classList.remove('darker-title');

    document.querySelector('input').className = `${color}-input`;
    // +++++++++++++++++++++++++++================================  Change todo color without changing their status ( or not):
    document.querySelectorAll('.todo').forEach(todo => {
        Array.from(todo.classList).some(item => item === '') ? 
            todo.className = `todo ${color}-todo completed`
            : todo.className = `todo ${color}-todo`;
    });
    // +++++++++++++++++++++++++++================================  Change buttons color according to their type (todo, check or delete):
    document.querySelectorAll('button').forEach(button => {
        Array.from(button.classList).some(item => {
            if (item === 'check-btn') {
              button.className = `check-btn ${color}-button`;  
            } else if (item === 'delete-btn') {
                button.className = `delete-btn ${color}-button`; 
            } else if (item === 'todo-btn') {
                button.className = `todo-btn ${color}-button`;
            }
        });
    });
}
