/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

	'use strict';

	window.JSONSchemaEditor = function (element, options) {
		if (!(element instanceof Element)) {
			throw new Error('element should be an instance of Element');
		}
		options = options || {};
		this.element = element;
		this.options = options;
		this.init();
	};

	JSONSchemaEditor.prototype = {
		// necessary since we remove the ctor property by doing a literal assignment. Without this
		// the $isplainobject function will think that this is a plain object.
		constructor: JSONSchemaEditor,
		init: function init() {
			var self = this;
			var data = this.options.startval || {};

			this.react = ReactDOM.render(React.createElement(SchemaObject, { onChange: this.onChange, data: data }), self.element);
			this.callbacks = {};
		},
		on: function on(event, callback) {
			this.react.on(event, callback);
		},
		onChange: function onChange() {},
		getValue: function getValue() {
			return this.react.export();
		},
		setValue: function setValue(data) {
			var self = this;
			this.react = ReactDOM.render(React.createElement(SchemaObject, { onChange: this.onChange, data: data }), self.element);
		}
	};

	var shortNumberStyle = {
		width: '50px'
	};

	var SchemaString = React.createClass({
		displayName: 'SchemaString',

		getInitialState: function getInitialState() {
			var state = this.props.data;
			state.hasEnum = !!state.enum;
			return state;
		},
		componentWillReceiveProps: function componentWillReceiveProps(newProps) {
			if (typeof newProps.data.description !== 'undefined') {
				this.state.description = newProps.data.description;
			}
			this.setState(this.state);
		},
		componentDidUpdate: function componentDidUpdate() {
			this.props.onChange();
		},
		export: function _export() {
			return {
				type: 'string',
				description: this.state.description,
				format: this.state.format,
				pattern: !!this.state.pattern ? this.state.pattern : undefined,
				enum: this.state.enum
			};
		},
		change: function change(event) {
			this.state[event.target.name] = event.target.value;
			this.setState(this.state);
		},
		changeBool: function changeBool(event) {
			this.state[event.target.name] = event.target.checked;
			this.setState(this.state);
		},
		changeEnum: function changeEnum(event) {
			var arr = event.target.value.split('\n');
			if (arr.length == 1 && !arr[0]) {
				arr = undefined;
			}
			this.state[event.target.name] = arr;
			this.setState(this.state);
		},
		render: function render() {
			var settings;
			if (this.state.hasEnum) {
				settings = React.createElement(
					'div',
					null,
					React.createElement(
						'label',
						{ style: { display: 'block' }, htmlFor: 'enum' },
						'Enum (one value per line):'
					),
					React.createElement('textarea', { onChange: this.changeEnum, name: 'enum', value: (this.state.enum || []).join('\n') })
				);
			} else {
				settings = React.createElement(
					'span',
					null,
					React.createElement('input', { placeholder: 'pattern', name: 'pattern', type: 'text', value: this.state.pattern, onChange: this.change })
				);
			}
			return React.createElement(
				'div',
				null,
				'Format:',
				React.createElement(
					'select',
					{ name: 'format', onChange: this.change, value: this.state.format },
					React.createElement('option', { value: '' }),
					React.createElement(
						'option',
						{ value: 'color' },
						'color'
					),
					React.createElement(
						'option',
						{ value: 'date' },
						'date'
					),
					React.createElement(
						'option',
						{ value: 'datetime' },
						'datetime'
					),
					React.createElement(
						'option',
						{ value: 'datetime-local' },
						'datetime-local'
					),
					React.createElement(
						'option',
						{ value: 'email' },
						'email'
					),
					React.createElement(
						'option',
						{ value: 'month' },
						'month'
					),
					React.createElement(
						'option',
						{ value: 'number' },
						'number'
					),
					React.createElement(
						'option',
						{ value: 'range' },
						'range'
					),
					React.createElement(
						'option',
						{ value: 'tel' },
						'tel'
					),
					React.createElement(
						'option',
						{ value: 'text' },
						'text'
					),
					React.createElement(
						'option',
						{ value: 'textarea' },
						'textarea'
					),
					React.createElement(
						'option',
						{ value: 'time' },
						'time'
					),
					React.createElement(
						'option',
						{ value: 'url' },
						'url'
					),
					React.createElement(
						'option',
						{ value: 'week' },
						'week'
					)
				),
				'Enum: ',
				React.createElement('input', { name: 'hasEnum', type: 'checkbox', checked: this.state.hasEnum, onChange: this.changeBool }),
				settings
			);
		}
	});

	var SchemaBoolean = React.createClass({
		displayName: 'SchemaBoolean',

		getInitialState: function getInitialState() {
			return this.props.data;
		},
		export: function _export() {
			return {
				type: 'boolean',
				format: 'checkbox',
				description: this.state.description
			};
		},
		componentWillReceiveProps: function componentWillReceiveProps(newProps) {
			if (typeof newProps.data.description !== 'undefined') {
				this.state.description = newProps.data.description;
			}
			this.setState(this.state);
		},
		render: function render() {
			return React.createElement('div', null);
		}
	});

	var SchemaNumber = React.createClass({
		displayName: 'SchemaNumber',

		getInitialState: function getInitialState() {
			return this.props.data;
		},
		componentDidUpdate: function componentDidUpdate() {
			this.props.onChange();
		},
		change: function change(event) {
			this.state[event.target.name] = parseInt(event.target.value);
			this.setState(this.state);
		},
		componentWillReceiveProps: function componentWillReceiveProps(newProps) {
			if (typeof newProps.data.description !== 'undefined') {
				this.state.description = newProps.data.description;
			}
			this.setState(this.state);
		},
		export: function _export() {
			var o = JSON.parse(JSON.stringify(this.state));
			o.type = 'number';
			delete o.name;
			return o;
		},
		render: function render() {
			return React.createElement(
				'div',
				null,
				'Min: ',
				React.createElement('input', { name: 'minimum', style: shortNumberStyle, type: 'number', value: this.state.minimum, onChange: this.change }),
				'Max: ',
				React.createElement('input', { name: 'maximum', style: shortNumberStyle, type: 'number', value: this.state.maximum, onChange: this.change })
			);
		}
	});

	var mapping = function mapping(name, data, changeHandler) {
		return {
			string: React.createElement(SchemaString, { onChange: changeHandler, ref: name, data: data }),
			number: React.createElement(SchemaNumber, { onChange: changeHandler, ref: name, data: data }),
			array: React.createElement(SchemaArray, { onChange: changeHandler, ref: name, data: data }),
			object: React.createElement(SchemaObject, { onChange: changeHandler, ref: name, data: data }),
			boolean: React.createElement(SchemaBoolean, { onChange: changeHandler, ref: name, data: data })
		}[data.type];
	};

	var SchemaArray = React.createClass({
		displayName: 'SchemaArray',

		getInitialState: function getInitialState() {
			return this.props.data;
		},
		change: function change(event) {
			if (event.target.type == 'checkbox') {
				this.state[event.target.name] = event.target.checked;
			} else if (event.target.name == 'itemtype') {
				this.state.items.type = event.target.value;
			} else {
				this.state[event.target.name] = event.target.value;
			}
			this.setState(this.state);
		},
		export: function _export() {
			//console.log(this.refs.items.state)
			return {
				items: this.refs['items'].export(),
				minItems: this.state.minItems,
				maxItems: this.state.maxItems,
				uniqueItems: this.state.uniqueItems ? true : undefined,
				format: this.state.format,
				description: this.state.description,
				type: 'array'
			};
		},
		componentDidUpdate: function componentDidUpdate() {
			this.onChange();
		},
		componentWillReceiveProps: function componentWillReceiveProps(newProps) {
			if (typeof newProps.data.description !== 'undefined') {
				this.state.description = newProps.data.description;
			}
			this.setState(this.state);
		},
		onChange: function onChange() {
			this.props.onChange();
		},
		render: function render() {
			var self = this;
			var optionFormStyle = {
				paddingLeft: '25px',
				paddingTop: '4px'
			};
			this.state.items = this.state.items || { type: 'string' };
			var optionForm = mapping('items', this.state.items, this.onChange);
			return React.createElement(
				'div',
				null,
				'Items Type:',
				React.createElement(
					'select',
					{ name: 'itemtype', onChange: this.change, value: this.state.items.type },
					React.createElement(
						'option',
						{ value: 'string' },
						'string'
					),
					React.createElement(
						'option',
						{ value: 'number' },
						'number'
					),
					React.createElement(
						'option',
						{ value: 'array' },
						'array'
					),
					React.createElement(
						'option',
						{ value: 'object' },
						'object'
					),
					React.createElement(
						'option',
						{ value: 'boolean' },
						'boolean'
					)
				),
				'minItems:  ',
				React.createElement('input', { name: 'minItems', style: shortNumberStyle, type: 'number', onChange: self.change, value: self.state.minItems }),
				'maxItems:  ',
				React.createElement('input', { name: 'maxItems', style: shortNumberStyle, type: 'number', onChange: self.change, value: self.state.maxItems }),
				'uniqueItems:  ',
				React.createElement('input', { name: 'uniqueItems', type: 'checkbox', onChange: self.change, checked: self.state.uniqueItems }),
				'Format:',
				React.createElement(
					'select',
					{ name: 'format', onChange: this.change, value: this.state.format },
					React.createElement('option', { value: '' }),
					React.createElement(
						'option',
						{ value: 'table' },
						'table'
					),
					React.createElement(
						'option',
						{ value: 'checkbox' },
						'checkbox'
					),
					React.createElement(
						'option',
						{ value: 'select' },
						'select'
					),
					React.createElement(
						'option',
						{ value: 'tabs' },
						'tabs'
					)
				),
				React.createElement(
					'div',
					{ style: optionFormStyle },
					optionForm
				)
			);
		}
	});

	var SchemaObject = React.createClass({
		displayName: 'SchemaObject',

		getInitialState: function getInitialState() {
			return this.propsToState(this.props);
		},
		propsToState: function propsToState(props) {
			var data = props.data;
			data.properties = data.properties || {};
			data.required = data.required || [];
			data.additionalProperties = data.additionalProperties || false;
			data.propertyNames = [];
			// convert from object to array
			data.properties = Object.keys(data.properties).map(function (name) {
				data.propertyNames.push(name);
				var item = data.properties[name];
				return item;
			});
			return data;
		},
		componentWillReceiveProps: function componentWillReceiveProps(newProps) {
			if (!this.state || this.state.properties.length === 0) {
				this.setState(this.propsToState(newProps));
			}
			if (typeof newProps.data.description !== 'undefined') {
				this.state.description = newProps.data.description;
				this.setState(this.state);
			}
		},
		deleteItem: function deleteItem(event) {
			var i = event.target.parentElement.dataset.index;
			var requiredIndex = this.state.required.indexOf(this.state.propertyNames[i]);
			if (requiredIndex !== -1) {
				this.state.required.splice(requiredIndex, 1);
			}
			this.state.properties.splice(i, 1);
			this.state.propertyNames.splice(i, 1);
			this.setState(this.state);
		},
		changeItem: function changeItem(event) {
			var i = event.target.parentElement.dataset.index;
			if (event.target.name == 'type') {
				this.state.properties[i].type = event.target.value;
			} else if (event.target.name == 'field') {
				this.state.propertyNames[i] = event.target.value;
			} else if (event.target.name == 'description') {
				this.state.properties[i].description = event.target.value;
			}
			this.setState(this.state);
		},
		changeRequired: function changeRequired(event) {
			if (event.target.checked) this.state.required.push(event.target.name);else {
				var i = this.state.required.indexOf(event.target.name);
				this.state.required.splice(i, 1);
			}
			this.setState(this.state);
		},
		change: function change(event) {
			this.state[event.target.name] = event.target.checked;
			this.setState(this.state);
		},
		changeText: function changeText(event) {
			this.state[event.target.name] = event.target.value;
			this.setState(this.state);
		},
		onChange: function onChange() {
			this.props.onChange();
			this.trigger('change');
		},
		componentDidUpdate: function componentDidUpdate() {
			this.onChange();
		},
		add: function add() {
			this.state.properties.push({ name: '', type: 'string' });
			this.setState(this.state);
		},
		export: function _export() {
			var self = this;
			var properties = {};
			Object.keys(self.state.properties).forEach(function (index) {
				//var name = self.state.properties[index].name;
				var name = self.state.propertyNames[index];
				if (typeof self.refs['item' + index] != 'undefined' && name && name.length > 0) properties[name] = self.refs['item' + index].export();
			});
			return {
				type: 'object',
				description: this.state.description,
				additionalProperties: this.state.additionalProperties,
				format: this.state.format,
				properties: properties,
				required: this.state.required.length ? this.state.required : undefined
			};
		},
		on: function on(event, callback) {
			this.callbacks = this.callbacks || {};
			this.callbacks[event] = this.callbacks[event] || [];
			this.callbacks[event].push(callback);

			return this;
		},
		trigger: function trigger(event) {
			if (this.callbacks && this.callbacks[event] && this.callbacks[event].length) {
				for (var i = 0; i < this.callbacks[event].length; i++) {
					this.callbacks[event][i]();
				}
			}

			return this;
		},
		render: function render() {
			var self = this;

			var optionFormStyle = {
				paddingLeft: '25px',
				paddingTop: '4px'
			};
			var requiredIcon = {
				fontSize: '1em',
				color: 'red',
				fontWeight: 'bold',
				paddingLeft: '5px'
			};
			var fieldStyle = {
				paddingBottom: '10px'
			};
			var objectStyle = {
				borderLeft: '2px dotted gray',
				paddingLeft: '8px',
				paddingTop: '10px'
			};
			var typeSelectStyle = {
				marginLeft: '5px'
			};
			var descriptionStyle = {
				marginLeft: '6px',
				width: '350px'
			};
			var deletePropStyle = {
				border: '1px solid black',
				padding: '0px 4px 0px 4px',
				pointer: 'cursor'
			};
			return React.createElement(
				'div',
				{ style: objectStyle },
				this.state.properties.map(function (value, index) {
					var name = self.state.propertyNames[index];
					var copiedState = JSON.parse(JSON.stringify(self.state.properties[index]));
					var optionForm = mapping('item' + index, copiedState, self.onChange);
					return React.createElement(
						'div',
						{ 'data-index': index, style: fieldStyle, key: index },
						React.createElement('input', { name: 'field', type: 'string', onChange: self.changeItem, value: name }),
						React.createElement(
							'select',
							{ style: typeSelectStyle, name: 'type', onChange: self.changeItem, value: value.type },
							React.createElement(
								'option',
								{ value: 'string' },
								'string'
							),
							React.createElement(
								'option',
								{ value: 'number' },
								'number'
							),
							React.createElement(
								'option',
								{ value: 'array' },
								'array'
							),
							React.createElement(
								'option',
								{ value: 'object' },
								'object'
							),
							React.createElement(
								'option',
								{ value: 'boolean' },
								'boolean'
							)
						),
						React.createElement('input', { style: descriptionStyle, placeholder: 'description', name: 'description', type: 'text', value: value.description, onChange: self.changeItem }),
						React.createElement(
							'span',
							{ style: requiredIcon },
							'*'
						),
						React.createElement('input', { name: name, type: 'checkbox', onChange: self.changeRequired, checked: self.state.required.indexOf(name) != -1 }),
						React.createElement(
							'span',
							{ onClick: self.deleteItem, style: deletePropStyle },
							'x'
						),
						React.createElement(
							'div',
							{ style: optionFormStyle },
							optionForm
						)
					);
				}),
				React.createElement(
					'div',
					null,
					'Allow additional properties: ',
					React.createElement('input', { name: 'additionalProperties', type: 'checkbox', onChange: self.change, checked: self.state.additionalProperties }),
					'Format:',
					React.createElement(
						'select',
						{ name: 'format', onChange: this.changeText, value: this.state.format },
						React.createElement('option', { value: '' }),
						React.createElement(
							'option',
							{ value: 'grid' },
							'grid'
						),
						React.createElement(
							'option',
							{ value: 'schema' },
							'schema'
						)
					)
				),
				React.createElement(
					'button',
					{ onClick: self.add },
					'Add another field'
				)
			);
		}
	});

	if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') module.exports = window.JSONSchemaEditor;

/***/ })
/******/ ]);