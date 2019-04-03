

(function () {
  const $newTodo = document.getElementById("new_todo")
  const $todoList = document.getElementById("list")

  let todoList = {}

  if (window.localStorage.getItem("todos")) {
    todoList = JSON.parse(window.localStorage.getItem("todos"))
  }


  const saveToStorage = () => {
    const data = JSON.stringify(todoList)
    window.localStorage.setItem("todos", data)
  }


  $newTodo.addEventListener("keydown", event => {
    if (event.keyCode == 13) {
      addTodo($newTodo.value)
      $newTodo.value = ""
    }

  })
 
  const addTodo = text => {
    createTodo(text)
    renderTodoList()
  }

  function renderTodoList() {
    while ($todoList.firstChild) {
      $todoList.removeChild($todoList.firstChild);
    }

    const sortedArray = Object.values(todoList).sort((first, second) => {
      if (first.done) return 1
      if (second.done) return -1
      if (first.rank_order > second.rank_order) return 1
      return -1
      
    })

    sortedArray.forEach(item => {
      addTodoElement(item.text, item.id, item.done)
    })
    
  }

  
  

  const addTodoElement = (text, dataId, done) => {
    const newLi = document.createElement("li")
    newLi.className = "todo_item"
    newLi.data_id = dataId

    const newInput = document.createElement("input")
    newInput.value = text
    newInput.className = "text_input"
    newInput.type = "text"

    const newCheckBoxLabel = document.createElement("label")
    newCheckBoxLabel.className = "container"

    const newCheckMarkSpan = document.createElement("span")
    newCheckMarkSpan.className = "checkmark"

    const newCheckBox = document.createElement("input")
    newCheckBox.checked = done
    newCheckBox.type = "checkbox"
    newCheckBox.className = "checkbox_input"

    const newIncreaseRankButton = document.createElement("button")
    newIncreaseRankButton.className = "fa increase_rank_button"
    newIncreaseRankButton.innerHTML = ""

    const newDecreaseRankButton = document.createElement("button")
    newDecreaseRankButton.className = "fa decrease_rank_button"
    newDecreaseRankButton.innerHTML = ""
        
    newInput.addEventListener("keyup", event => {
      updateTodoText(newInput.value, dataId)
    })

    newCheckBox.addEventListener("change", event => {
      updateTodoStatus(newCheckBox.checked, dataId)
      renderTodoList()

    })

    newIncreaseRankButton.addEventListener("click", event => {
      increaseTodoRank(dataId)
      renderTodoList()
    })

    newDecreaseRankButton.addEventListener("click", event => {
      decreaseTodoRank(dataId)
      renderTodoList()
    })

    newLi.appendChild(newInput)
    newCheckBoxLabel.appendChild(newCheckBox)
    newCheckBoxLabel.appendChild(newCheckMarkSpan)
    newLi.appendChild(newCheckBoxLabel)
    newLi.appendChild(newIncreaseRankButton)
    newLi.appendChild(newDecreaseRankButton)

    $todoList.appendChild(newLi)
    saveToStorage()

  }

  const updateTodoText = (value, id) => {
    todoList[id].text = value
    console.log(todoList)
    saveToStorage()

  }

  const updateTodoStatus = (checked, id) => {
    todoList[id].done = checked
    console.log(todoList)
    saveToStorage()

  }

  const increaseTodoRank = (id) => {
    oldRankOrder = todoList[id].rank_order
    newRankOrder = oldRankOrder + 1
    let moved = false

    let todoArray = Object.values(todoList)

    todoArray.forEach(todo => {
      if (todo.rank_order == newRankOrder) {
       todoList[todo.id].rank_order -= 1
       moved = true
      }
    })

    if (moved) todoList[id].rank_order = newRankOrder
    console.log(todoList)
    console.log(`Moved: ${moved}, oldRankOrder: ${oldRankOrder}, newRankOrder: ${newRankOrder}`)

    saveToStorage()

  }

  const decreaseTodoRank = (id) => {
    oldRankOrder = todoList[id].rank_order
    newRankOrder = oldRankOrder - 1
    let moved = false

    let todoArray = Object.values(todoList)

    todoArray.forEach(todo => {
      if (todo.rank_order == newRankOrder) {
       todoList[todo.id].rank_order += 1
       moved = true
      }
    })

    if (moved) todoList[id].rank_order = newRankOrder
    console.log(todoList)
    console.log(`Moved: ${moved}, oldRankOrder: ${oldRankOrder}, newRankOrder: ${newRankOrder}`)
    saveToStorage()

  }

  const createTodo = (text) => {
    const id = Date.now()
    const rank_order = Object.values(todoList).reduce((accumulator, currentValue) => {
      return currentValue.rank_order > accumulator ? currentValue.rank_order : accumulator
    }, 0) + 1
    const todo = {
      id,
      text,
      done: false,
      rank_order
    }
    todoList[id] = todo
    console.log(todoList)
    return id
    saveToStorage()

  }

  renderTodoList()


}());   


