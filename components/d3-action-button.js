export function load() {
  let componentName = 'd3-action-button';
  let count = -1;
  customElements.define(componentName, class d3_action_button extends HTMLElement {
    constructor() {
      super();
      count++;
      const html = `
<div></div>
      `;
      this.html = `${html}`;
    }

    setState(state) {
      if (state.name) {
        this.name = state.name;
      }
    }

    get buttonSvg() {
      return `
<g class="node-action-button-g" transform="translate(324,129)" opacity="1" golgi-prop="rootElement">
  <circle class="node-action-button-circle" r="16" stroke-width="1" fill="yellow" stroke="rgba(15,140,121,1)" golgi-prop="circleTag"></circle>
  <text class="node-action-button-text" pointer-events="none" text-anchor="middle" alignment-baseline="middle" fill="#2C3E50" font-size="30" y="0" golgi-prop="textTag">?</text>
</g>
      `;
    }

    hide() {
      this.rootElement.setAttribute('opacity', "0");
      this.btnType = 'hidden';
    }

    show() {
      this.rootElement.setAttribute('opacity', "1");
    }

    set text(value) {
      this.textTag.textContent = value;
    }

    set type(type) {
      if (type === 'add') {
        this.textTag.textContent = '+';
      }
      if (type === 'remove') {
        this.textTag.textContent = 'X';
      }
      this.btnType = type;
      this.show();
    }

    get type() {
      return this.btnType;
    }

    onBeforeState() {
      this.nodeBox = this.getParentComponent('d3-node-box');
      this.d3_root = this.context.d3_root;
      this.context.d3_root.injectXml(this.buttonSvg, this.nodeBox.rootElement, this);
    }
 
  });
};