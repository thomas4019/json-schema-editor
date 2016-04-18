# JSON Schema Editor

Generates an HTML for creating and modifying [json schemas](http://json-schema.org). I created this because [json-editor](https://github.com/jdorn/json-editor) is not good at modifying schemas (using the [meta schema](http://json-schema.org/schema))

## Getting started

1. Make sure React is loaded on your page. If you're not using React yet you can use the following scripts to load it from a CDN.

    <script src="https://fb.me/react-15.0.1.js"></script>
    <script src="https://fb.me/react-dom-15.0.1.js"></script>

2. Include the JSON Schema Editor javascript file.

    <script src="node_modules/dist/jsonschemaeditor.js"></script>

3. Add an element to your page to contain the editor.

    <div id="container"></div>

4. Initialize the component

    var element = document.getElementById('container');

    var editor = new JSONSchemaEditor(element, {});
    editor.setValue(product);

Todo

* Add support for the description field.
* exclusiveMinimum and exclusiveMaximum, are these even necessary?
* enums
* refs
* definitions
* patternProperties
* allOf, anyOf, oneOf