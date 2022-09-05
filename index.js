import express from "express"
import fs from "fs"
import path  from "path";

let rawdata = fs.readFileSync('data.json');
let todos = JSON.parse(rawdata);

const app = express();
app.use(express.static("public"))
app.use(express.json())
app.use(express.urlencoded({
    extended : true
}));

app.get("/", (req,res)=>{
    req.redirect("/index.html")
});

app.get("/todos",(req,res)=>{
    fs.promises.readFile(path.resolve("data.json"),"utf-8").then((todos) => {
        res.send(todos)
    })
    
})

app.get("/todos/:id", (req, res) => {
    const event = todos[req.params.id];
    if(event === undefined) {
        res.status(404).send('Event not found');
    } else {
        res.send(event);
    }
   
});
app.post("/todos",(req,res)=>{
    fs.promises
    .writeFile(path.resolve("data.json"),JSON.stringify(req.body,undefined,2))
    .then(()=>{

        res.send("succes")
    })
})

app.put("/todos/:id", (req, res) => {
    if(req.body===undefined){
        res.status(404).send('Todos not found');
    }
    else{
        
      todos.filter((obj)=>{
            if (obj.id===req.body.id){
                obj.image = req.body.image
                obj.name = req.body.name
                obj.phone = req.body.phone
                obj.location = req.body.location
            }   
        })
            fs.writeFileSync('data.json', JSON.stringify(todos));
            res.send("ok");
    }
 
});

app.delete("/todos/:id", (req, res) => {

    if(req.body===undefined){
        res.status(404).send('Todos not found');
    } else {
        todos.filter((obj)=>{
            if (obj.id===req.body.id){
                let myIndex = todos.indexOf(obj)
                todos.splice(myIndex, 1) 
            }  
        })
        fs.writeFileSync('data.json', JSON.stringify(todos));
        res.send("ok");
    }
});
app.listen(3001)