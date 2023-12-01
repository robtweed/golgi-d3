export function load() {
  let componentName = 'd3-node-box';
  let count = -1;
  let id_prefix = componentName + '-';
  let id;
  customElements.define(componentName, class d3_node_box extends HTMLElement {
    constructor() {
      super();
      count++;
      id = id_prefix + count;
      const html = `
<div></div>
      `;
      this.html = `${html}`;
      this.name = id;
    }

    setState(state) {
      if (state.name) {
        this.name = state.name;
      }
    }

    set backgroundColor(rgb) {
      let style = 'fill: rgb(' + rgb.red + ',' + rgb.green + ',' + rgb.blue + ');';
      this.rectTag.setAttribute('style', style);
    }

    set colorOf(opt) {
      if (opt === 'documentNode') {
        this.backgroundColor = {
          red: 250,
          green: 70,
          blue: 70
        };
      }
      if (opt === 'intermediateNode') {
        this.backgroundColor ={
          red: 31,
          green: 182,
          blue: 208
        };
      }
      if (opt === 'leafNode') {
        this.backgroundColor ={
          red: 51,
          green: 182,
          blue: 2
        };
      }
      if (opt === 'moreSiblings') {
        this.backgroundColor ={
          red: 255,
          green: 178,
          blue: 102
        };
      }
    }

    resize(params) {
      params = params || {};
      let width = params.width || this.d3_root.width; //342;
      let height = params.width || this.d3_root.height; //146;
      this.rectTag.setAttribute('width', width);
      this.rectTag.setAttribute('height', height);
    }

    get nodeBoxSvg() {
      let width = this.d3_root.width; //342;
      let height = this.d3_root.height; //146;
      return `
<g id="${id}" class="node" transform="translate(0,0)" cursor="pointer" style="font: 12px sans-serif;" opacity="0" golgi-prop="rootElement">
  <rect class="node-rect" width="${width}" height="${height}" x="0" y="0" rx="5" stroke-width="3" cursor="pointer" stroke="rgba(15,14,12,1)" style="fill: rgb(51, 182, 2);" golgi-prop="rectTag" filter="url(#node-drop-shadow)"></rect>
  <foreignObject class="node-foreign-object" width="342" height="146" x="0" y="20" golgi-prop="foTarget"></foreignObject>
</g>
      `;
    }

    render(positions) {
      positions = positions || {};
      console.log('node render using positions:');
      console.log(positions);
      this.x = positions.x || 0;
      this.y = positions.y || 0;
      // set the starting point for the transition as that of the parent node
      let startX;
      let startY;

      if (this.parent_node) {
        startX = this.parent_node.x;
        startY = this.parent_node.y;
      }
      else {
        startX = 0;
        startY = 0;
      }
      let translate = 'translate(' + startX + ',' + startY + ')';
      this.rootElement.setAttribute('transform', translate);
      this.expand();
    }

    expand() {
      let _this = this;
      let translate;
      if (this.parent_node) {
        // bring it back to its parent position
        translate = 'translate(' + this.parent_node.x + ',' + this.parent_node.y + ')';
        this.rootElement.setAttribute('transform', translate);
      }
      // then animate it down to its proper position
      translate = 'translate(' + this.x + ',' + this.y + ')';
      //console.log('expand ' + this.name + ' to translate ' + translate);

      if (this.d3_link) {

        console.log('87654321');
        console.log(this);
        console.log(this.parent_node);
        console.log(987654321);

        this.d3_link.transition()
        .duration(this.duration)
        .attr('opacity', 1)
        .attr('d', this.d3_root.diagonal(this, this.parent_node));
      }

      this.d3_node.transition()
      .attr('opacity', 0)
      .duration(this.duration)
      .attr('transform', translate)
      .attr('opacity', 1)

      this.visible = true;
    }

    collapse() {
      let _this = this;

      if (this.d3_link) {
        this.d3_link.transition()
        .duration(this.duration)
        .attr('d', this.d3_root.diagonal(this.parent_node, this.parent_node))
        .attr('opacity', 0)
      }

      let translate = 'translate(' + this.parent_node.x + ',' + this.parent_node.y + ')';
      let translate2 =  'translate(-1000,-100)';
      this.d3_node.transition()
      .attr('opacity', 1)
      .duration(this.duration)
      .attr('transform', translate)
      .attr('opacity', 0)
      .on('end', function() {
        // move it safely out of the way to ensure the parent's button isn't confused
        translate = 'translate(-1000,-100)';
        _this.rootElement.setAttribute('transform', translate);
      })
      this.visible = false;
    }

    onBeforeState() {
      this.x = 0;
      this.y = 0;
      this.duration = 600;
      this.borderRadius = 5;
      this.borderWidth = 1;
      this.borderColor = {
        red: 15,
        green: 140,
        blue: 121,
        alpha: 1
      };
      this.data = {};
      this.child_nodes = [];
      this.visible = false;
      this.d3_root = this.context.d3_root;
      this.d3_root.injectXml(this.nodeBoxSvg, this.context.nodeBoxTarget, this);
      this.d3_node = this.context.d3.select(this.rootElement);
    }

    disconnectedCallback() {
      //console.log('d3-vertical-hierarchy-node component was removed!');
      // remove from parent's array of child nodes
      let node;
      //console.log('removing node ' + this.name + ' from parent');
      if (this.parent_node && this.parent_node.child_nodes) {
        //console.log('currently ' + this.parent_node.child_nodes.length + ' nodes in parent array');
        for (var i = 0; i < this.parent_node.child_nodes.length; i++) {
          node = this.parent_node.child_nodes[i];
          //console.log('found ' + node.name);
          if (node.name === this.name) {
            //console.log(node.name + ' removed from parent');
            this.parent_node.child_nodes.splice(i, 1);
            break;
          }
        }
      }
      // remove SVG markup for nodes and links
      this.rootElement.parentNode.removeChild(this.rootElement);
      if (this.link && this.link.rootElement) {
        this.link.rootElement.parentNode.removeChild(this.link.rootElement);
      }

    }
 
  });
};