import React, { Component } from 'react';
import axios from 'axios';
import moment from 'moment';

const url= 'https://todo-3b8ed.firebaseio.com/';

class App extends Component {
  constructor() {
    super();
    this.state = { todos: {} };

    this.handleNewTodoInput = this.handleNewTodoInput.bind(this);
    this.deleteTodo = this.deleteTodo.bind(this);
  }

  createTodo(todoText) {
    axios
    .post(`${url}.json`, {title: todoText,
                createdAt: new Date()})
    .then((response)=>{
      console.log(response)
      let todos={...this.state.todos}
      let todoID=(response.data.name)
      let data =JSON.parse(response.config.data)
      todos[todoID]=data
      if (data){this.setState({todos})}
    })
  }
  handleNewTodoInput(event) {
    if (event.charCode === 13) {
      this.createTodo(event.target.value);
      event.target.value = "";
    }
  }
  componentDidMount(){
    this.getTodos()
  }
  getTodos(){
  axios.get(`${url}.json`).then((response) => {
      this.setState({ todos: response.data });
    }).catch((error) => {
      console.log(error);
    });
  }
  deleteTodo(todoId){
    axios.delete(`${url}${todoId}.json`)
    .then((response)=>{
      let todos=this.state.todos
      delete todos[todoId];
      this.setState({todos})
    })
  }
renderTodoList() {
    let todoElements = [];

    for(let todoId in this.state.todos) {
      let todo = this.state.todos[todoId]

      todoElements.push(
        <div className="todo d-flex justify-content-between pb-4" key={todoId}>
          <div className="mt-2">
            <h4>{todo.title}</h4>
            <div>{moment(todo.createdAt).calendar()}</div>
          </div>
          <button
            className="ml-4 btn btn-link"
            onClick={ () => { this.deleteTodo(todoId) } }
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      );
    }

    return (
      <div className="todo-list">
        {todoElements}
      </div>
    );
  }
  renderNewTodoBox() {
    return (
      <div className="new-todo-box pb-2">
        <input className="w-100" placeholder="What do you have to do?" onKeyPress={ this.handleNewTodoInput } />
      </div>
    );
  }

  render() {
    return (
      <div className="App container-fluid">
        <div className="row pt-3">
          <div className="col-6 px-4">
            {this.renderNewTodoBox()}
            {this.renderTodoList()}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
