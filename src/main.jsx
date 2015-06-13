var React = require('react');
require('../node_modules/firebase/lib/firebase-web.js');
var ReactFireMixin = require('../node_modules/reactfire/dist/reactfire.js');

var Domain = React.createClass({
  mixins: [ReactFireMixin],
  getInitialState: function() {
    return {items: [], text: ''};
  },
  onChange: function(e) {
    this.setState({text: e.target.value});
  },
  validDomain: function(domain) {
    return false;
  },
  handleSubmit: function(e) {
    var domain = this.state.text;

    if (this.validDomain(domain)){
      e.preventDefault();
      this.firebaseRefs.items.push({
        text: domain
      });
      this.setState({text: ""});
    } else {
      e.preventDefault();
      console.log("please enter valid domain");
      this.setState({text: ""});
    }

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
        <h3>Domain</h3>
        <DomainList items={this.state.items} />
        <form onSubmit={this.handleSubmit}>
          <input onChange={this.onChange} value={this.state.text} />
          <button>{'Add Domain #' + (this.state.items.length + 1)}</button>
        </form>
      </div>
    );
  }
});


var DomainList = React.createClass({
  render: function() {
    var createItem = function(itemText, index) {
      return <li key={index + itemText}>{itemText}</li>;
    };
    return <ul>{this.props.items.map(createItem)}</ul>;
  }
});



App = React.render(<Domain />, document.getElementById('home'));


