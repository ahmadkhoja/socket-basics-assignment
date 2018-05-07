import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import io from 'socket.io-client'

class App extends React.Component{
  
    state = { 
      socket:null, 
      globalNumber:0 ,
      username:'',
      messages_list:[]
    }
  
    componentDidMount(){
      const socket = io('http://localhost:8888');
  
      this.setState({socket})
  
      socket.on('number:change', (globalNumber) => {
        this.setState({globalNumber})
      })
      // socket.on('user:new', ()=>{
      //   console.log('a user has connected')
      // })
      socket.on('user:new', (username)=>{
        console.log('a user called '+username+' has connected')
      })
  
      socket.on('user:me', (username)=>{
        this.setState({username})
      })
      socket.on('text:everyone',(message,username)=>{
        const the_message = {message,username}
        const messages_list = this.state.messages_list.slice()
        messages_list.push(the_message)
        this.setState({messages_list})
        console.log('message has been added',this.state.messages_list)
      })
  
    }
  
    onIncrement = () => this.state.socket.emit('increment')
    onDecrement = () => this.state.socket.emit('decrement')
    onFormSubmit = (event) => {
      event.preventDefault()
      const form = event.target
      const message = form.message.value
      console.log(message)
      this.state.socket.emit('text',message,this.state.username)
      // form.message.value=''
    }
    render(){
      return(
        <div className="wrapper">
            <h2>hello {this.state.username}</h2>
          <div className="formArea">
            <form onSubmit={this.onFormSubmit}>
              <input type="text" name="message"/>
              <button>Submit</button>
            </form>
          </div>
          <div className="messages">
            {(this.state.messages_list ?
              <ul>
                {this.state.messages_list.map((message)=> 
                <div className="single-message">
                <h3>{message.username}</h3>
                <p>{message.message}</p>
                </div>)}
              </ul>
             :null
            )}
          </div>
        </div>
        // do something here to show the globalNumber and use increment and decrement
      )
      
    }
  }

export default App;
