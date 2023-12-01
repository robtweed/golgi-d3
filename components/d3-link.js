export function load() {
  let componentName = 'd3-link';
  let count = -1;
  customElements.define(componentName, class d3_link extends HTMLElement {
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

    get linkSvg() {
      return `
<path class="link" fill="none" stroke-width="5" stroke="rgba(220,189,207,1)" opacity="0" golgi-prop="rootElement"></path>
      `;
    }

    hide() {
      this.rootElement.setAttribute('opacity', "0");
      this.btnType = 'hidden';
    }

    show() {
      this.rootElement.setAttribute('opacity', "1");
    }

    onBeforeState() {
      this.nodeBox = this.getParentComponent('d3-node-box');
      this.d3_root = this.context.d3_root;
      let parent = this.d3_root.nodeBoxTarget;
      this.context.d3_root.injectXml(this.linkSvg, parent, this);
      let link = parent.removeChild(parent.lastChild);
      parent.insertBefore(link, parent.firstChild);
    }
 
  });
};