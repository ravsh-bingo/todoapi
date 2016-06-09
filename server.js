var bodyParser = require('body-parser');
var express = require("express");
var _ = require('underscore');
var app = express();
var PORT = process.env.PORT || 3000;

var todos = [];
var todoNextId = 1;
app.use(bodyParser.json());

app.get("/todos", function (req, res) {
    var queryParams=req.query;
    var filteredTodos=todos;
   if  (queryParams.hasOwnProperty('completed')&& queryParams.completed==='true'){
       filteredTodos=_.where(filteredTodos,{completed:true});
   }else if(queryParams.hasOwnProperty('completed') && queryParams.completed==='false'){
       filteredTodos=_.where(filteredTodos,{completed:false});
   }
   if(queryParams.hasOwnProperty('q') && queryParams.q.length>0){
       filteredTodos=_.filter(filteredTodos,function(tod){
           return tod.description.indexOf(queryParams.q)>-1;
       });
   }
    res.json(filteredTodos);
});

app.get("/todos/:id", function (req, res) {
    var todoid = parseInt(req.params.id, 10);
    var matched = _.findWhere(todos, { id: todoid });
    /*  todos.forEach(function (todo) {
          if (todoid === todo.id) {
              matched = todo;
          }
  
      });*/
    if (matched) {
        res.json(matched);
    }
    else {
        res.status(404).send();
    }

});



app.get("/", function (req, res) {

    res.send("todo api root");
});

app.post("/todos", function (req, res) {
    var body = req.body;
    body.id = todoNextId++;
    var body1 = _.pick(body, 'description', 'id', 'completed');
    if (!_.isBoolean(body1.completed) || !_.isString(body1.description) || body1.description.trim().length === 0) {
        return res.status(400).send();
    }
    body1.description = body1.description.trim();
    todos.push(body1);
    console.log("description: " + body1.description);
    res.json(todos);
});
app.delete("/todos/:id", function (req, res) {
    var todoid = parseInt(req.params.id, 10);
    var matched = _.findWhere(todos, { id: todoid });
    if (matched) {
        todos = _.without(todos, matched);
        res.json(matched);
    }
    else {
        res.status(404).send();
    }



});
app.put("/todos/:id", function (req, res) {
    var todoid = parseInt(req.params.id, 10);
    var matched = _.findWhere(todos, { id: todoid });
    var body = _.pick(req.body, 'description', 'completed');
    var validate = {};
    if (!matched) {
        res.status(404).send();
    }
    if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
        validate.completed = body.completed;
    } else if(body.hasOwnProperty('completed')) {
      res.status(400).send();
    }
    if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
        validate.description = body.description;

    } else if(body.hasOwnProperty('description')) {
      res.status(400).send();
    }
    _.extend(matched, validate);
    res.json(matched);
});

app.listen(PORT, function () {
    

});