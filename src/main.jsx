var React = require('react');
require('../node_modules/firebase/lib/firebase-web.js');
var ReactFireMixin = require('../node_modules/reactfire/dist/reactfire.js');

var Todo = React.createClass({
  mixins: [ReactFireMixin],
  getInitialState: function() {
    return {items: [], text: ''};
  },
  onChange: function(e) {
    this.setState({text: e.target.value});
  },
  handleSubmit: function(e) {
    e.preventDefault();
    // debugger;
    this.firebaseRefs.items.push({
      text: this.state.text
    });
    this.setState({text: ""});
  },
  componentWillMount: function() {
    var ref = new Firebase("https://burning-heat-3182.firebaseio.com/items/");
      this.bindAsArray(ref, "items");
    // this.bindAsObject(new Firebase("https://burning-heat-3182.firebaseio.com/items/"), "items");
    // this.firebaseRef = new Firebase("https://burning-heat-3182.firebaseio.com/items/");
    //  this.firebaseRef.on("child_added", function(dataSnapshot) {
    //    this.items.push(dataSnapshot.val());
    //    this.setState({
    //      items: this.items
    //    });
     // }.bind(this));
  },
  componentWillUnmount: function() {
    this.firebaseRef.off();
  },
  render: function() {
    return (
      <div>
        <h3>TODO</h3>
        <TodoList items={this.state.items} />
        <form onSubmit={this.handleSubmit}>
          <input onChange={this.onChange} value={this.state.text} />
          <button>{'Add #' + (this.state.items.length + 1)}</button>
        </form>
      </div>
    );
  }
});


var TodoList = React.createClass({
  render: function() {
    var createItem = function(itemText, index) {
      return <li key={index + itemText}>{itemText}</li>;
    };
    return <ul>{this.props.items.map(createItem)}</ul>;
  }
});



App = React.render(<Todo />, document.getElementById('home'));


