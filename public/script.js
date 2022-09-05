const root = document.getElementById("root");
const backdrop=document.getElementById('backdrop');

class Contact{
    constructor(id,image,name,phone,location){
        this.id = id,
        this.image = image,
        this.name = name,
        this.phone = phone,
        this.location = location
    }
}


function TodoForm(add) {
    const container = document.createElement("form");
    const addNewContact = document.getElementById("addNewContact")
    addNewContact.addEventListener("click",showAddForm)

    container.className = "addCard"

    container.innerHTML = `
        <input id="imgUrl" type="text"  placeholder="image Url"/>
        <input id="name" type="text"  placeholder="name"/>
        <input id="phone" type="number"  placeholder="phone"/>
        <input id="loc" type="text"  placeholder="location"/>
        <button>Add</button>
    `;

    container.addEventListener("submit", (e) => {
        e.preventDefault();
        const id = parseInt(`${Date.now()}${Math.random()}`)

        const inputs =container.querySelectorAll("input")

        const imgSrc = inputs[0].value;
        const name = inputs[1].value;
        const phone = inputs[2].value;
        const location = inputs[3].value;

        const contact = new Contact(id,imgSrc,name,phone,location)

        add(contact);
    });

    return container;
}
function showAddForm(){
    const form = document.querySelector(".addCard")
    form.classList.toggle('visible')

}
function ListItem(todo) {
    const container = document.createElement("div");
    container.className = "card"

    container.innerHTML = `
        <div id="label">
            <img src="${todo.image}">
            <p>${todo.name}</p>
            <p>${todo.phone}</p>
            <p>${todo.location}</p>
            <button onclick="togglBtn(${todo.id})" id="edit_btn" style = "margin-top:10px;"> edit </button>
            <button onclick="deleteCard(${todo.id})" id="delete_btn" style = "margin-top:10px;"> delete </button>
        </div>
    `;
    return container;
}
function List(todos, onChange) {
    const container = document.createElement("div");
    container.className="cardsList"
    todos.map(todo => {
        return ListItem(todo, () => {
            onChange();
        });
    }).forEach(el => {
        container.appendChild(el);
    });

    return container;
}
function deleteCard(id){
    fetch(`/todos/${id}`, {
        method  : "DELETE",
        headers : {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify({
            id
            })
    })
        .then((resp) => location.reload())
        .catch((err) => console.log(err));
        
}


function togglBtn(id){
    const form = document.getElementById("form")
    form.classList.toggle('visible')
    const save_btn = document.getElementById("save")

    
    save_btn.addEventListener("click",()=>{
        const image = document.querySelector("#image").value;
        const name = document.querySelector("#f_name").value;
        const phoneNum = document.querySelector("#ph_num").value;
        const loc = document.querySelector("#location").value;

        const contact = new Contact(id,image,name,phoneNum,loc)

        fetch(`/todos/${id}`, {
            method  : "PUT",
            headers : {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify(contact,undefined,2)  
        })
            .then((resp) => console.log("ok"))
            .catch((err) => console.log(err));

    })

}

function App() {
    let todos = []
    
    fetch(`/todos`).then((resp)  => resp.json()).then((resp)=>{
        todos = resp;
        render();
    })
    function sendTodos(){
        fetch("/todos",{
            method:"post",
            headers:{
                "content-type":"application/json"
            },
            body: JSON.stringify(todos)
        })
    }
    const container = document.createElement("div");
    container.className = "container"
    
    function render() {
        container.innerHTML = "";
        container.appendChild(TodoForm(function(cont) {
            todos.push(cont);
            sendTodos()
            render();
        }));
        container.appendChild(List(todos,() => {
            sendTodos()
            render();
        }));
    }
    render();

    return container;
}

root.appendChild(App());