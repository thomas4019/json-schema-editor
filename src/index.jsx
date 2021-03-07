window.JSONSchemaEditor = function(element,options) {
	if (!(element instanceof Element)) {
		throw new Error('element should be an instance of Element');
	}
	options = options||{};
	this.element = element;
	this.options = options;
	this.init();
};

JSONSchemaEditor.prototype = {
	// necessary since we remove the ctor property by doing a literal assignment. Without this
	// the $isplainobject function will think that this is a plain object.
	constructor: JSONSchemaEditor,
	init: function() {
		var self = this;
		var data = this.options.startval || {};

		this.react = ReactDOM.render(
			<SchemaObject onChange={this.onChange} data={data}/>,
			self.element
		);
		this.callbacks = {};
	},
	on: function(event, callback) {
		this.react.on(event, callback);
	},
	onChange: function() {
	},
	getValue: function() {
		return this.react.export();
	},
	setValue: function(data) {
		var self = this;
		// uncommenting this makes the update work on the test page
		// self.element.children[0].remove();
		this.react = ReactDOM.render(
			<SchemaObject onChange={this.onChange} data={data}/>,
			self.element
		);
	}
}

var shortNumberStyle = {
	width: '50px'
}

var SchemaString = React.createClass({
	getInitialState: function() {
		var state = this.props.data;
		state.hasEnum = !!state.enum;
		return state
	},
	componentWillReceiveProps: function(newProps) {
		if (typeof newProps.data.description !== 'undefined') {
			this.state.description = newProps.data.description;
		}
		this.setState(this.state);
	},
	componentDidUpdate: function() {
		this.props.onChange();
	},
	export: function() {
		return {
			type: 'string',
            default: this.state.default,
			description: this.state.description,
			format: this.state.format,
			pattern: !!this.state.pattern ? this.state.pattern : undefined,
			enum: this.state.enum
		};
	},
	change: function(event) {
		this.state[event.target.name] = event.target.value;
		this.setState(this.state);
	},
	changeBool: function(event) {
		this.state[event.target.name] = event.target.checked;
		this.setState(this.state);
	},
	changeEnum: function(event) {
		var arr = event.target.value.split('\n');
		if (arr.length == 1 && !arr[0]) {
			arr = undefined;
		}
		this.state[event.target.name] = arr
		this.setState(this.state);
	},
	render: function() {
		var settings;
		if (this.state.hasEnum) {
			settings = <div>
						<label style={{display: 'block'}} htmlFor="enum">Enum (one value per line):</label>
						<textarea onChange={this.changeEnum} name="enum" value={(this.state.enum||[]).join('\n')} />
					  </div>
		} else {
			settings = <span>
				<input placeholder="pattern" name="pattern" type="text" value={this.state.pattern} onChange={this.change} />
				</span>
		}
		return (
			<div>
				Format: 
				<select name="format" onChange={this.change} value={this.state.format}>
					<option value=""></option>
					<option value="color">color</option>
					<option value="date">date</option>
					<option value="datetime">datetime</option>
					<option value="datetime-local">datetime-local</option>
					<option value="email">email</option>
					<option value="month">month</option>
					<option value="number">number</option>
					<option value="range">range</option>
					<option value="tel">tel</option>
					<option value="text">text</option>
					<option value="textarea">textarea</option>
					<option value="time">time</option>
					<option value="url">url</option>
					<option value="week">week</option>
				</select>
				Enum: <input name="hasEnum" type="checkbox" checked={this.state.hasEnum} onChange={this.changeBool}  />
				{settings}
			</div>
		);
	}
});

var SchemaAny = React.createClass({
	getInitialState: function() {
		return this.props.data;
	},
	export: function() {
		return {
			type: ["string", "number", "object", "array", "boolean", "null"],
			default: this.state.default,
			description: this.state.description
		}
	},
	componentWillReceiveProps: function(newProps) {
		if (typeof newProps.data.description !== 'undefined') {
			this.state.description = newProps.data.description;
		}
		this.setState(this.state);
	},
	render() {
		return (
			<div></div>
		);
	}
})

var SchemaBoolean = React.createClass({
	getInitialState: function() {
		return this.props.data;
	},
	export: function() {
		return {
			type: 'boolean',
			format: 'checkbox',
			default: this.state.default,
			description: this.state.description
		}
	},
	componentWillReceiveProps: function(newProps) {
		if (typeof newProps.data.description !== 'undefined') {
			this.state.description = newProps.data.description;
		}
		this.setState(this.state);
	},
	render() {
		return (
			<div></div>
		);
	}
})

var SchemaNumber = React.createClass({
	getInitialState: function() {
		return this.props.data;
	},
	componentDidUpdate: function() {
		this.props.onChange();
	},
	change: function(event) {
		this.state[event.target.name] = parseInt(event.target.value);
		this.setState(this.state);
	},
	componentWillReceiveProps: function(newProps) {
		if (typeof newProps.data.description !== 'undefined') {
			this.state.description = newProps.data.description;
		}
		this.setState(this.state);
	},
	export: function() {
		var o = JSON.parse(JSON.stringify(this.state));
		o.type = 'number';
		delete o.name;
		return o;
	},
	render: function() {
		return (
			<div>
				Min: <input name="minimum" style={shortNumberStyle} type="number" value={this.state.minimum} onChange={this.change} />
				Max: <input name="maximum" style={shortNumberStyle} type="number" value={this.state.maximum} onChange={this.change} />
			</div>
		);
	}
});

function mapType(type) {
	return Array.isArray(type) ? 'any' : type;
}

var mapping = function(name, data, changeHandler) {
	return {
		any: <SchemaAny onChange={changeHandler} ref={name} data={data}/>,
		string: <SchemaString onChange={changeHandler} ref={name} data={data} />,
		number: <SchemaNumber onChange={changeHandler} ref={name} data={data} />,
		array: <SchemaArray onChange={changeHandler} ref={name} data={data}/>,
		object: <SchemaObject onChange={changeHandler} ref={name} data={data}/>,
		boolean: <SchemaBoolean onChange={changeHandler} ref={name} data={data}/>,
	}[mapType(data.type)];
};

var SchemaArray = React.createClass({
	getInitialState: function() {
		return this.props.data;
	},
	change: function(event) {
		if (event.target.type == 'checkbox') {
			this.state[event.target.name] = event.target.checked;
		}
		else if (event.target.name == 'itemtype') {
			this.state.items.type = event.target.value;
		}
		else {
			this.state[event.target.name] = event.target.value;
		}
		this.setState(this.state);
	},
	export: function() {
		//console.log(this.refs.items.state)
		return {
			items: this.refs['items'].export(),
			minItems: this.state.minItems,
			maxItems: this.state.maxItems,
			uniqueItems: (this.state.uniqueItems ? true : undefined),
			format: this.state.format,
			default: this.state.default,
			description: this.state.description,
			type: 'array'
		};
	},
	componentDidUpdate: function() {
		this.onChange();
	},
	componentWillReceiveProps: function(newProps) {
		if (typeof newProps.data.description !== 'undefined') {
			this.state.description = newProps.data.description;
		}
		this.setState(this.state);
	},
	onChange: function() {
		this.props.onChange();
	},
 	render: function() {
		var self = this;
		var optionFormStyle = {
			paddingLeft: '25px',
			paddingTop: '4px',
		};
		this.state.items = this.state.items || {type: 'string'};
		var optionForm = mapping('items', this.state.items, this.onChange);
		return (
			<div>
				Items Type:
				<select name="itemtype" onChange={this.change} value={mapType(this.state.items.type)}>
						<option value="string">string</option>
						<option value="number">number</option>
						<option value="array">array</option>
						<option value="object">object</option>
						<option value="boolean">boolean</option>
						<option value="any">any</option>
					</select>
				minItems:  <input name="minItems" style={shortNumberStyle} type="number" onChange={self.change} value={self.state.minItems}  />
				maxItems:  <input name="maxItems" style={shortNumberStyle} type="number" onChange={self.change} value={self.state.maxItems}  />
				uniqueItems:  <input name="uniqueItems" type="checkbox" onChange={self.change} checked={self.state.uniqueItems}  />
				Format: 
				<select name="format" onChange={this.change} value={this.state.format}>
					<option value=""></option>
					<option value="table">table</option>
					<option value="checkbox">checkbox</option>
					<option value="select">select</option>
					<option value="tabs">tabs</option>
				</select>
				<div style={optionFormStyle}>
					{optionForm}
				</div>
			</div>
		);
	}
});

var SchemaObject = React.createClass({
	getInitialState: function() {
		return this.propsToState(this.props)
	},
	propsToState: function(props) {
		var data = props.data;
		data.properties = data.properties || {}
		data.required = data.required || [];
		data.additionalProperties = data.additionalProperties || false;
		data.propertyNames = [];
		// convert from object to array
		data.properties = Object.keys(data.properties).map(function(name) {
			data.propertyNames.push(name);
			var item = data.properties[name];
			return item;
		})
		return data
	},
	componentWillReceiveProps: function(newProps) {
		if (!this.state || this.state.properties.length === 0) {
			this.setState(this.propsToState(newProps))
		}
		if (typeof newProps.data.description !== 'undefined') {
			this.state.description = newProps.data.description;
			this.setState(this.state);
		}
	},
	deleteItem: function(event) {
		var i = event.target.parentElement.dataset.index;
		var requiredIndex = this.state.required.indexOf(this.state.propertyNames[i])
		if (requiredIndex !== -1) {
			this.state.required.splice(requiredIndex, 1)
		}
		this.state.properties.splice(i, 1);
		this.state.propertyNames.splice(i, 1);
		this.setState(this.state);
	},
	changeItem: function(event) {
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
	changeRequired: function(event) {
		if (event.target.checked)
			this.state.required.push(event.target.name);
		else {
			var i = this.state.required.indexOf(event.target.name)
			this.state.required.splice(i, 1);
		}
		this.setState(this.state);
	},
	change: function(event) {
		this.state[event.target.name] = event.target.checked;
		this.setState(this.state);
	},
	changeText: function(event) {
		this.state[event.target.name] = event.target.value;
		this.setState(this.state);
	},
	onChange: function() {
		this.props.onChange()
		this.trigger('change');
	},
	componentDidUpdate: function() {
		this.onChange();
	},
	add: function() {
		this.state.properties.push({name: '', type: 'string'});
		this.setState(this.state);
	},
	export: function() {
		var self = this;
		var properties = {};
		Object.keys(self.state.properties).forEach(function(index) {
			//var name = self.state.properties[index].name;
			var name = self.state.propertyNames[index];
			if (typeof self.refs['item'+index] != 'undefined' && name && name.length > 0)
				properties[name] = self.refs['item'+index].export();
		});
		return {
			type: 'object',
			default: this.state.default,
			description: this.state.description,
			additionalProperties: this.state.additionalProperties,
			format: this.state.format,
			properties: properties,
			required: this.state.required.length ? this.state.required : undefined
		};
	},
	on: function(event, callback) {
		this.callbacks = this.callbacks || {};
		this.callbacks[event] = this.callbacks[event] || [];
		this.callbacks[event].push(callback);

		return this;
	},
	trigger: function(event) {
		if (this.callbacks && this.callbacks[event] && this.callbacks[event].length) {
			for (var i=0; i<this.callbacks[event].length; i++) {
				this.callbacks[event][i]();
			}
		}

		return this;
	},
	render: function() {
		var self = this;

		var optionFormStyle = {
			paddingLeft: '25px',
			paddingTop: '4px',
		};
		var requiredIcon = {
			fontSize: '1em',
			color: 'red',
			fontWeight: 'bold',
			paddingLeft: '5px'
		};
		var fieldStyle = {
			paddingBottom: '10px',
		}
		var objectStyle = {
			borderLeft: '2px dotted gray',
			paddingLeft: '8px',
			paddingTop: '10px',
		}
		var typeSelectStyle = {
			marginLeft: '5px'
		}
		var descriptionStyle = {
			marginLeft: '6px',
			width: '350px'
		}
		var deletePropStyle = {
			border: '1px solid black',
			padding: '0px 4px 0px 4px',
			pointer: 'cursor',
		}
		return (
		<div style={objectStyle}>

			{this.state.properties.map(function(value, index) {
			var name = self.state.propertyNames[index]
			var copiedState = JSON.parse(JSON.stringify(self.state.properties[index]));
 			var optionForm = mapping('item' + index, copiedState, self.onChange);
			return <div data-index={index} style={fieldStyle} key={index}>
				<input name="field" type="string" onChange={self.changeItem} value={name} />
				<select style={typeSelectStyle} name="type" onChange={self.changeItem} value={mapType(value.type)}>
					<option value="string">string</option>
					<option value="number">number</option>
					<option value="array">array</option>
					<option value="object">object</option>
					<option value="boolean">boolean</option>
					<option value="any">any</option>
				</select>
				<input style={descriptionStyle} placeholder="description" name="description" type="text" value={value.description} onChange={self.changeItem} />
				<span style={requiredIcon}>*</span><input name={name} type="checkbox" onChange={self.changeRequired} checked={self.state.required.indexOf(name) != -1} />
				<span onClick={self.deleteItem} style={deletePropStyle}>x</span>
				<div style={optionFormStyle}>
					{optionForm}
				</div>
			</div>
			})}
			<div>
			Allow additional properties: <input name="additionalProperties" type="checkbox" onChange={self.change} checked={self.state.additionalProperties} />
			Format: 
				<select name="format" onChange={this.changeText} value={this.state.format}>
					<option value=""></option>
					<option value="grid">grid</option>
					<option value="schema">schema</option>
				</select>
			</div>

			<button onClick={self.add}>Add another field</button>
		</div>
	);
  }
});

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
	module.exports = window.JSONSchemaEditor;
