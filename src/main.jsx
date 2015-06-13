var React = require('react');
require('../node_modules/firebase/lib/firebase-web.js');
var ReactFireMixin = require('../node_modules/reactfire/dist/reactfire.js');

require('./style.less');

var Domain = React.createClass({
  mixins: [ReactFireMixin],
  getInitialState: function() {
    return {items: [], domain: '', text: '', show_help: false};
  },
  onDomainChange: function(e) {
    this.setState({domain: e.target.value, show_help: false});
  },
  onTextChange: function(e) {
    this.setState({text: e.target.value});
  },
  validDomain: function(value) {
    return /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value);
  },
  handleSubmit: function(e) {
    var domain = this.state.domain;

    if (this.validDomain(domain)){
      e.preventDefault();
      this.firebaseRefs.items.push({
        domain: domain,
        text: this.state.text
      });
      this.setState({domain: "", text: "", show_help: false});
    } else {
      e.preventDefault();
      this.setState({domain: "", show_help: true});
    }
  },
  componentWillMount: function() {
    var ref = new Firebase("https://burning-heat-3182.firebaseio.com/items/");
    this.bindAsArray(ref, "items");
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
          domain:
          <input onChange={this.onDomainChange} value={this.state.domain} />
          <br />
          description:
          <input type="text" onChange={this.onTextChange} value={this.state.text} />
          <br />
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


