var React = require('react');
var ReactDOM = require('react-dom');

var ReefyX = require('./components/Reefy.jsx');
var Reefy = require('./components/Reefy');

// Import CSS module.
require('./stylesheet.css');

// Default input.
var config = {
  fontSize: 12,
  fontFamily: 'monospace',
  lineHeight: 14
};
var file = 'hello\nworld\n';

// Renders reefy editor.
ReactDOM.render(
    <div>
      <ReefyX.Reefy config={config} file={file}/>
      <Reefy />
    </div>,
    document.getElementById('reefy'));
