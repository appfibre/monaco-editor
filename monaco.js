import * as monaco from './out/monaco-editor/esm/vs/editor/editor.main.js';

self.MonacoEnvironment = {
	getWorkerUrl: function (moduleId, label) {
		let baseurl = document.head.baseURI;
		if (!baseurl.endsWith('/') && baseurl.lastIndexOf('/') > 0)
			baseurl = baseurl.substring(0, baseurl.lastIndexOf('/') + 1);

		if (label === 'json') {
			return baseurl + '$/lib/monaco/vs/language/json/json.worker.js';
		}
		if (label === 'jst') {
			return baseurl + '$/lib/monaco/vs/language/jst/jst.worker.js';
		}
		if (label === 'css' || label === 'scss' || label === 'less') {
			return baseurl + '$/lib/monaco/vs/language/css/css.worker.js';
		}
		if (label === 'html' || label === 'handlebars' || label === 'razor') {
			return baseurl + '$/lib/monaco/vs/language/html/html.worker.js';
		}
		if (label === 'typescript' || label === 'javascript') {
			return baseurl + '$/lib/monaco/vs/language/typescript/ts.worker.js';
		}
		return baseurl + '$/lib/monaco/vs/editor/editor.worker.js';
	},
	languages: monaco.languages
};

/*monaco.editor.create(document.getElementById('container'), {
	value: ['function x() {', '\tconsole.log("Hello world!");', '}'].join('\n'),
	language: 'javascript'
});*/

customElements.define(
	'monaco-editor',
	class MonacoEditor extends HTMLElement {
		_monacoEditor;
		/** @type HTMLElement */
		_editor;

		constructor() {
			super();
			if (this.childNodes.length == 1 && !(this.childNodes.item(0) instanceof HTMLElement))
				this.value = this.innerText;
			else if (this.innerHTML > '') this.value = this.innerHTML;
			this.innerHTML = '';
			//const shadow = this.attachShadow({mode:'open'});
		}

		connectedCallback() {
			if (this.parentElement.tagName.toUpperCase() == 'DIV') {
				this._monacoEditor = monaco.editor.create(this.parentElement, {
					automaticLayout: true,
					language: this.language,
					value: this.value
				});
				window.monaco = monaco;
				window.monacoEditor = this._monacoEditor;
			} else this.innerText = 'Monaco editor must be inside a div element';
			//this.addEventListener("click", this.onclick);
		}
		adoptedCallback() {
			//console.log('moved to a new document');
		}
		disconnectedCallback() {
			this._monacoEditor = null;
			//this.removeEventListener("click", this.onclick);
		}

		static get observedAttributes() {
			return ['language', 'value', 'schema'];
		}
		set language(value) {
			this.setAttribute('language', value);
			if (this._monacoEditor) {
				let model = this._monacoEditor.getModel();
				monaco.editor.setModelLanguage(model, value);
			}
		}
		get language() {
			return this.getAttribute('language');
		}

		set value(value) {
			this.setAttribute('value', value);
			if (this._monacoEditor) this._monacoEditor.setValue(value);
		}
		get value() {
			return this._monacoEditor ? this._monacoEditor.getValue() : this.getAttribute('value');
		}

		set schema(value) {
			this.setAttribute('schema', value);
			if (this._monacoEditor) this._monacoEditor.setValue(value);
		}
		get schema() {
			return this._monacoEditor ? this._monacoEditor.getValue() : this.getAttribute('schema');
		}

		attributeChangedCallback(attrName, oldVal, newVal) {
			switch (attrName) {
				case 'disabled': {
					//this.shadowRoot.getElementById("button").disabled = newVal === "true";
					break;
				}
				default: {
					//console.log("unhandled attribute change", attrName, oldVal, newVal);
					break;
				}
			}
		}
		/*onclick() {
			const button = this.shadowRoot.getElementById("button");
			if (event.composedPath().includes(button)) {
			  console.log("button clicked");
			}
		  }*/
	}
);
