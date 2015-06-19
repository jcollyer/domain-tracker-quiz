var React = require('react');

var Template = React.createClass({
  render:function(){
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
});

module.exports = Template;
