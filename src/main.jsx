var React = require('react');
require('../node_modules/firebase/lib/firebase-web.js');
var ReactFireMixin = require('../node_modules/reactfire/dist/reactfire.js');

require('./style.less');

var Domain = React.createClass({
  mixins: [ReactFireMixin],
  getInitialState: function() {
    return {items: [], text: '', show_help: false};
  },
  onChange: function(e) {
    this.setState({text: e.target.value, show_help: false});
  },
  validDomain: function(value) {
    return /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value);
  },
  handleSubmit: function(e) {
    var domain = this.state.text;

    if (this.validDomain(domain)){
      e.preventDefault();
      this.firebaseRefs.items.push({
        text: domain
      });
      this.setState({text: "", show_help: false});
    } else {
      e.preventDefault();
      this.setState({text: "", show_help: true});
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
        <div id="help" className={this.state.show_help ? "show" : ""}>you need help!!</div>
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


