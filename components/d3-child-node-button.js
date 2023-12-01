export function load() {
  let componentName = 'd3-child-node-button';
  let count = -1;
  customElements.define(componentName, class d3_child_node_button extends HTMLElement {
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

    position(x,y) {
      this.rootElement.setAttribute('transform', 'translate(' + x + ',' + y + ')');
    }

    atBottom() {
      let x = (this.d3_root.width / 2) + 1;
      let y = this.d3_root.height + 6;
      this.position(x, y);
    }

    atRight() {
      let x = this.d3_root.width;
      let y = this.d3_root.height / 2;
      this.position(x, y);
      this.textTag.textContent = '>';
    }

    atLeft() {
      let x = 0;
      let y = this.d3_root.height / 2;
      this.position(x, y);
      this.textTag.textContent = '<';
    }

    get buttonSvg() {
      return `
<g class="node-button-g" transform="translate(172,152)" opacity="0" golgi-prop="rootElement">
  <circle class="node-button-circle" r="16" stroke-width="1" fill="#fafafa" stroke="rgba(15,140,121,1)" golgi-prop="circleTag"></circle>
  <text class="node-button-text" pointer-events="none" text-anchor="middle" alignment-baseline="middle" fill="#2C3E50" font-size="26" y="2" golgi-prop="textTag">+</text>
</g>
      `;
    }

    hide() {
      this.rootElement.setAttribute('opacity', "0");
    }

    show() {
      this.rootElement.setAttribute('opacity', "1");
    }

    status() {
      let char = this.textTag.textContent;
      if (char === '+' || char === '<' || char === '>') return 'expand';
      return 'collapse';
    }

    setToExpand() {
      this.textTag.textContent = '+';
      this.textTag.setAttribute('y', 2);
    }

    setToCollapse() {
      this.textTag.textContent = '-';
      this.textTag.setAttribute('y', 0);
    }

    set type(type) {
      if (type === 'collapse') this.setToCollapse();
      if (type === 'expand') this.setToExpand();
    }

    onBeforeState() {
      this.nodeBox = this.getParentComponent('d3-node-box');
      this.d3_root = this.context.d3_root;
      this.context.d3_root.injectXml(this.buttonSvg, this.nodeBox.rootElement, this);
    }
 
  });
};