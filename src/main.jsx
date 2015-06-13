var React = require('react');
require('../node_modules/firebase/lib/firebase-web.js');
var ReactFireMixin = require('../node_modules/reactfire/dist/reactfire.js');

require('./style.less');

var Domain = React.createClass({
  mixins: [ReactFireMixin],
  getInitialState: function() {
    return {items: [], domain: '', text: '', show_help: false, valid_domain: false, date_created: ""};
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
    if (this.validDomain(this.state.domain)){
      e.preventDefault();
      this.updateFirebase();
      this.setState({domain: "", text: "", show_help: false});
    } else {
      e.preventDefault();
      this.updateFirebase();
      this.setState({domain: "", show_help: true});
    }
  },
  getTime: function() {
    var date = new Date();
    return date.toLocaleDateString("en-US");
  },
  updateFirebase: function() {

    this.firebaseRefs.items.push({
      domain: this.state.domain,
      text: this.state.text,
      valid_domain: this.validDomain(this.state.domain),
      date_created: this.getTime()
    });
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
        <form onSubmit={this.handleSubmit}>
          domain:
          <input onChange={this.onDomainChange} value={this.state.domain} />
          description:
          <input type="text" onChange={this.onTextChange} value={this.state.text} />
          <button>{'Add Domain #' + (this.state.items.length + 1)}</button>
        </form>
        <br />
        <br />
        <DomainList items={this.state.items} />
      </div>
    );
  }
});


var DomainList = React.createClass({
  render: function() {
    var createItem = function(item, index) {
      return (
        <tr key={index + item}>
          <td>{index + 1}</td>
          <td>{item.domain}</td>
          <td>{item.text}</td>
          <td className={item.valid_domain? "valid":"not-valid"}></td>
          <td>{item.date_created}</td>
        </tr>
      );
    };
    return (
      <table>
        <tr>
          <td>Domain #</td>
          <td>Domain Name</td>
          <td>Domain Description</td>
          <td>Valid?</td>
          <td>Date Created</td>
        </tr>
        {this.props.items.map(createItem)}
        </table>
    );
  }
});



App = React.render(<Domain />, document.getElementById('home'));


