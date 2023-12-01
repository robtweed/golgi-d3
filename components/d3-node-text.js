export function load() {
  let componentName = 'd3-node-text';
  let count = -1;
  customElements.define(componentName, class d3_node_text extends HTMLElement {
    constructor() {
      super();
      count++;
      const html = `
<div>
  <br />
  <br />
  <br golgi:prop="extraBr" />
  <center>
    <div>
      <div class="node-text-key subscript-text-white" golgi:prop="subscriptDiv"></div>
    </div>
    <span golgi:prop="valueSpan">
      <br />
      <hr />
      <br />
      <div>
        <div class="node-text-value" style="font-size:16px;font-weight:bold;color: yellow" golgi:prop="valueDiv"></div>
      </div>
    </span>
    <span golgi:prop="moreSiblingSpan">
      <hr />
      <div style="font-size:20px;font-weight:bold; color: black">or: 
        <input class="custom-seed" type="text" placeholder="from subscript..." golgi:prop="seedInput" />
      </div>
    </span>
  </center>
</div>
      `;
      this.html = `${html}`;
    }

    setState(state) {
      if (state.name) {
        this.name = state.name;
      }
    }

    set text(value) {
      this.extraBr.style.display = '';
      this.valueSpan.style.display = 'none';
      this.subscriptDiv.textContent = value;
    }

    set value(text) {
      this.extraBr.style.display = 'none';
      this.valueSpan.style.display = '';
      this.valueDiv.textContent = text;
    }

    showAsMoreSiblings() {
      this.valueSpan.style.display = 'none';
      this.moreSiblingSpan.style.display = '';
    }

    onBeforeState() {
      this.valueSpan.style.display = 'none';
      this.moreSiblingSpan.style.display = 'none';
    }
 
  });
};