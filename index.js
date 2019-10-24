const express = require('express');

const server = express();

server.use(express.json());

var projects = []
var cont = 0;

//Creating a global middleware
server.use((req, res, next) => {
  cont = cont + 1;

  next();

  console.log(`Number or requisition: ${cont}`);
});

//Crating local middlewares
function checkIfProjectExists(req, res, next) {
  const project = projects.find(element => element.id == req.params.id);
  
  if(!project) {
    return res.status(400).json({error: "User does not exists"})
  }

  return next();
}

//Creating routes
server.post('/projects', (req, res) => {
  const { id } = req.body;
  var { title } = req.body;
  const tasks = [];

  projects.push({id, title, tasks});
  return res.json(projects);  
})

//Show all projects
server.get('/projects', (req, res) => {
  return res.json(projects);  
})

//Show one project
server.get('/projects/:id',checkIfProjectExists , (req, res) => {
  const { id } = req.params;
  const project = projects.find(element => element.id == id);

  return res.json(project);
});

//Editing a project
server.put('/projects/:id',checkIfProjectExists , (req, res) => {
  const { id } = req.params;
  const project = projects.find(element => element.id == id);
  const { title } = req.body;

  project.title = title
  return res.json(project);
});

//Deleting a project
server.delete('/projects/:id',checkIfProjectExists , (req, res) => {
  const { id } = req.params;
  const projectIndex = projects.findIndex(element => element.id == id);

  projects.splice(projectIndex, 1);
  return res.json(projects);
});

//Adding new task to a project
server.put('/projects/:id/tasks',checkIfProjectExists , (req, res) => {
  const { id } = req.params;
  const project = projects.find(element => element.id == id);
  const { title } = req.body;

  project.tasks.push(title);
  return res.json(project);
});

//Localhost 3000
const port = 3000;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
