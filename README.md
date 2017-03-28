# JSON Schema Editor

![npm badge](https://badge.fury.io/js/json-schema-editor.svg)

Generates HTML for creating and modifying [json schemas](http://json-schema.org). I created this because [json-editor](https://github.com/jdorn/json-editor) is not good at modifying schemas (using the [meta schema](http://json-schema.org/schema)) and couldn't find any other good UI for making json schemas.

## Getting started
--------------------
1. Make sure React is loaded on your page. Read more at [facebook/react](https://github.com/facebook/react#installation).

2. Include JSON Schema Editor

  - Using npm: 
  
  ```sh
  npm install json-schema-editor
  ```
  
  ```javascript
  var JSONSchemaEditor = require('json-schema-editor');
  ```
  
  - Old-fashioned style:
  
  ```html
  <script src="node_modules/dist/jsonschemaeditor.js"></script>
  ```

3. Add an element to your page to contain the editor

```html
<div id="container"></div>
```

4. Initialize the component

```javascript
var element = document.getElementById('container');
var editor = new JSONSchemaEditor(element, {});
editor.setValue(product);
```

5. Get the value (generally after the user presses a button e.g. save)

```javascript
editor.getValue();
```


## Example
-------------
Here is what the [product schema](http://json-schema.org/example1.html) example looks like rendered.

![JSON Schema Editor Example](https://cloud.githubusercontent.com/assets/406149/14623022/a1a3c96e-058b-11e6-9cef-0b61ff242e8d.png)

## Todo
* Add support for the description field.
* exclusiveMinimum and exclusiveMaximum, are these even necessary?
* refs
* definitions
* patternProperties
* allOf, anyOf, oneOf
