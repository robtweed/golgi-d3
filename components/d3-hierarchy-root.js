import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm';

export function load() {
  let componentName = 'd3-hierarchy-root';
  let count = -1;
  let id_prefix = componentName + '-';
  let id;
  customElements.define(componentName, class d3_hierarchy_root extends HTMLElement {
    constructor() {
      super();
      count++;
      id = id_prefix + count;
      this.attachShadow({ mode: 'open' });
      const html = `
<style>
  .modal {
    display: none; /* Hidden by default */
    position: fixed; /* Stay in place */
    z-index: 1; /* Sit on top */
    left: 0;
    top: 0;
    width: 100%; /* Full width */
    height: 100% ;/* Full height */
    overflow: auto; /* Enable scroll if needed */
    background-color: rgb(0,0,0); /* Fallback color */
    background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
  }
  .modal-content {
    background-color: #fefefe;
    position: relative;
    left: 300px;
    top:100px;
    height: 2%;
    padding: 0px;
    border: 1px solid #888;
    width: 10%;
  }

  /*the container must be positioned relative:*/
  .custom-select {
    position: relative;
    font-family: Arial;
  }

  .custom-select select {
    display: none; /*hide original SELECT element:*/
  }

  .select-selected {
    background-color: DodgerBlue;
  }

  /*style the arrow inside the select element:*/
  .select-selected:after {
    position: absolute;
    content: "";
    top: 14px;
    right: 10px;
    width: 0;
    height: 0;
    border: 6px solid transparent;
    border-color: #fff transparent transparent transparent;
  }

  /*point the arrow upwards when the select box is open (active):*/
  .select-selected.select-arrow-active:after {
    border-color: transparent transparent #fff transparent;
    top: 7px;
  }

  /*style the items (options), including the selected item:*/
  .select-items div,.select-selected {
    color: #ffffff;
    padding: 8px 16px;
    border: 1px solid transparent;
    border-color: transparent transparent rgba(0, 0, 0, 0.1) transparent;
    cursor: pointer;
    user-select: none;
  }

  /*style items (options):*/
  .select-items {
    position: absolute;
    background-color: DodgerBlue;
    top: 100%;
    left: 0;
    right: 0;
    z-index: 99;
  }

  /*hide the items when the select box is closed:*/
  .select-hide {
    display: none;
  }

  .select-items div:hover, .same-as-selected {
    background-color: rgba(0, 0, 0, 0.1);
  }


.node-action-button-g .tooltip {visibility: hidden}

.node-action-button-g:hover .tooltip {
    visibility: visible;
}
.tooltip text {
    fill: black;
    font-size: 12px;
    font-family: sans-serif;
}
.tooltip rect {
    fill: yellow;
    stroke: blue;
}

.subscript-text-white {
  font-size:20px;
  font-weight:bold; 
  color: white;
}

.subscript-text-black {
  font-size:20px;
  font-weight:bold; 
  color: black;
}

.custom-seed {
  height: 30px;
  width: 200px;
  font-size: 21px;
}

.node-container {
  padding-top:10px; 
  height:1200px
}

</style>
<div id="${id}" class="node-container" golgi:prop="containerDiv">
  <svg class="svg-chart-container" width="100%" height="1200px" font-family="Helvetica" cursor="move" style="background-color: rgb(250, 250, 250);" golgi:prop="svgTag">
    <g class="chart" transform="translate(0,0)" golgi:prop="gChartTag">

      <g class="center-group" transform="translate(0,0) scale(0.6)" golgi:prop="nodeBoxTarget"></g>

    </g>
    <defs class="filter-defs" golgi:prop="filterDefsTag">
      <filter class="shadow-filter-element" id="node-drop-shadow" y="-50%" x="-50%" height="200%" width="200%">
        <feGaussianBlur class="feGaussianBlur-element" in="SourceAlpha" stdDeviation="3.1" result="blur"></feGaussianBlur>
          <feOffset class="feOffset-element" in="blur" result="offsetBlur" dx="4.28" dy="4.48" x="8" y="8"></feOffset>
          <feFlood class="feFlood-element" in="offsetBlur" flood-color="black" flood-opacity="0.3" result="offsetColor"></feFlood>
         <feComposite class="feComposite-element" in="offsetColor" in2="offsetBlur" operator="in" result="offsetBlur"></feComposite>
        <feMerge class="feMerge-element">
          <feMergeNode class="feMergeNode-blur" in="offsetBlur"></feMergeNode>
          <feMergeNode class="feMergeNode-graphic" in="SourceGraphic"></feMergeNode>
        </feMerge>
      </filter>
    </defs>
  </svg>
</div>
<div class="modal" golgi:prop="modalTag">
  <div class="modal-content" golgi:prop="modalContentTag">
    <div class="custom-select" style="width:200px;" golgi:prop="customSelectTag">
      <div class="select-selected" golgi:prop="selectedTag">Select action:</div>
      <div class="select-items select-hide" golgi:prop="selectTag"></div>
    </div>
  </div>
</div>
      `;
      this.shadowRoot.innerHTML = `${html}`;
      this.name = id;
    }

    addClass(cls) {
      this.containerDiv.classList.add(cls);
    }

    removeClass(cls) {
      this.containerDiv.classList.remove(cls);
    }

    setState(state) {
      if (state.name) {
        this.name = state.name;
      }
      if (state.cls) {
        let _this = this;
        state.cls.split(' ').forEach(function(cls) {
          _this.addClass(cls);
        });
      }
      if (state.zoomFactor) {
        changeZoomFactor(state.zoomFactor);
      }
      if (typeof state.maxSubscripts !== 'undefined' && +state.maxSubscripts > 0) {
        this.maxSubscripts = +state.maxSubscripts;
      }
    }

    set position(obj) {
      this.nodeBoxTarget.setAttribute('transform', 'translate(' + obj.x + ',' + obj.y + ') scale(0.6)');
    }

    get position() {
      let attr = this.nodeBoxTarget.getAttribute('transform');
      let vals = attr.split('translate(')[1];
      vals = vals.split(')')[0];
      vals = vals.split(',');
      return {
        x: +vals[0],
        y: +vals[1]
      };
    }

    changeZoomFactor(zoomFactor) {
      this.zoomFactor = zoomFactor;
      if (this.nodeBoxTarget) {
        let translate = 'translate(' + (this.svgWidth / 2) + ',' + (this.height / 2) + ') scale(' + this.zoomFactor + ')';
        this.nodeBoxTarget.setAttribute('transform', translate);
      }
    }

    showModal(x, y, node) {
      if (typeof x !== 'undefined') {
        this.modalContentTag.style.left = x + 'px';
      }
      if (typeof y !== 'undefined') {
        this.modalContentTag.style.top = y + 'px';
      }
      this.modalTag.style.display = 'block';
      this.node_context = node;

      // make all options visible by default
      for (let value in this.selectOptions) {
        this.selectOptions[value].removeAttribute('style');
      }
    }
 
    isModalVisible() {
      let display = this.modalTag.style.display;
      if (display === 'none') return false;
      return true;
    }

    hideModal() {
      this.modalTag.style.display = 'none';
    }

    setSelectedValue(value) {
      this.selectedTag.setAttribute('value', value);
    }

    hideOption(value) {
      let option = this.selectOptions[value];
      if (option) option.style = 'display: none';
    }

    showOption(value) {
      let option = this.selectOptions[value];
      if (option) option.removeAttribute('style');
    }

    addOptions(optionArr) {

      this.selectOptions = {};
      let _this = this;
      optionArr.forEach(function(option) {
        let div = document.createElement('div');
        div.classList.add('select-option');
        div.setAttribute('value', option.value);
        div.textContent = option.text;
        _this.selectTag.appendChild(div);
        _this.selectOptions[option.value] = div;
        let fn = function(e) {
          e.stopPropagation();
          let value = e.target.getAttribute('value');
          _this.setSelectedValue(value);
          _this.hideModal();
          _this.closeSelect();

          // perform action based on value....
          //console.log('Invoking action ' + value);
          //console.log(_this.node_context.data);
          if (option.handler) option.handler.call(_this.node_context);
        };
        _this.addHandler(fn, div);
      });
    }

    onAfterHooks() {

      let readyEvent = new Event('rootReady');
      let _this = this;

      let fn = function(e) {
        /*when the select box is clicked, close any other select boxes,
        and open/close the current select box:*/
        e.stopPropagation();
        _this.selectTag.classList.toggle("select-hide");
        _this.selectedTag.classList.toggle("select-arrow-active");
      };
      this.addHandler(fn, this.selectedTag);

      let closeModalFn = function() {
        if (_this.isModalVisible()) {
          _this.closeSelect();
          _this.hideModal();
        }
      };
      this.addHandler(closeModalFn, document);

      this.centerG = this.container.select('.center-group')

      let zoom = d3.zoom().on("zoom", function(evt) {
        // Reposition and rescale chart accordingly in response to mouse movements
        _this.gChartTag.setAttribute('transform', evt.transform);
      });

      d3.select(this.svgTag).call(zoom);

      this.calc = {
        chartLeftMargin: this.marginLeft,
        chartTopMargin: this.marginTop,
        chartWidth: this.svgWidth - this.marginRight - this.marginLeft,
        chartHeight: this.svgHeight - this.marginBottom - this.marginTop,
      };

      this.depth = this.height + 100;  
      this.treemap = d3.tree()
        .size([this.calc.chartWidth, this.calc.chartHeight])
        .nodeSize([this.width + 50, this.height + this.depth])
        .separation(function(a, b) {return a.parent == b.parent ? 1 : 1.1;})

      document.dispatchEvent(readyEvent);
      this.isReady = true;
    }

    resetView() {
      this.gChartTag.setAttribute('transform', 'translate(0,0)');
    }

    clearDown(from_node, leaveParent) {
      // remove all existing nodes

      if (!this.topNode) return;

      let _this = this;
      let clearAll = false;
      if (!from_node) {
        from_node = this.topNode;
        clearAll = true;
      }

      function deleteChildNodes(node) {
        if (node.child_nodes) {
          let childNodes = node.child_nodes.slice(0);
          childNodes.forEach(function(childNode) {
            deleteChildNodes(childNode);
            childNode.remove();
            _this.removeFromNodeArray(childNode)
          });
        }
      }
      deleteChildNodes(from_node);
      if (!leaveParent) {
        from_node.remove();
        this.removeFromNodeArray(from_node)
      }
      if (clearAll) {
        delete this.topNode;
        this.nodeArray = [];
      }
      this.resetView();
    }

    render() {
      console.log('root render');
      let _this = this;

      let positions = this.calculateNodePositions(this.nodeArray);

      this.nodeArray.forEach(function(record) {
        let node = record.node;
        if (node.visible && node.x === positions[record.id].x && node.y === positions[record.id].y) {
          // node already visible and at same position, so don't re-render
          return;
        }
        record.node.render(positions[record.id]);
      });
    }

    onReady(fn) {
      if (this.isReady) {
        fn();
      }
      else {
        document.addEventListener('rootReady', fn);
        this.removeOnReady = function() {
          document.removeEventListener('rootReady', fn);
        }
      }
    }

    appendNodeData(dataArray) {
      // data element objects should contain:
      //  {id: n, parent: parentId or '' for top node}

      let _this = this;
      dataArray.forEach(function(record) {
        _this.nodeArray.push(record);
      });
    }

    removeFromNodeArray(node) {
      for (var i = 0; i < this.nodeArray.length; i++) {
        if (+this.nodeArray[i].id === +node.id) {
          this.nodeArray.splice(i, 1);
          return;
        }
      }
    }

    calculateNodePositions(nodeArray) {

      let root = d3.stratify()
        .id(function(d) { return d.id; })
        .parentId(function(d) { return d.parent; })
      (nodeArray);

      let results = this.treemap(root);
      let positions = {};
      let _this = this;

      function getPositions(obj) {
        obj.children.forEach(function(child) {
          positions[child.id] = {
            x: child.x,
            y: child.depth * (_this.height + 100)
          };
          if (child.children) {
            getPositions(child);
          }
        });
      };
      positions[results.id] = {
        x: results.x,
        y: results.y
      };
      if (results.children) {
        getPositions(results);
      }
      return positions;
    }

    diagonal(fromNode, toNode) {

      // Calculate some variables based on source and target (s,t) coordinates
      let xoffset = this.width / 2;
      let yoffset = this.height / 2;
      const x = fromNode.x + xoffset;
      const y = fromNode.y + yoffset;
      const ex = toNode.x + xoffset;
      const ey = toNode.y + yoffset;
      let xrvs = ex - x < 0 ? -1 : 1;
      let yrvs = ey - y < 0 ? -1 : 1;
      let rdef = 35;
      let rInitial = Math.abs(ex - x) / 2 < rdef ? Math.abs(ex - x) / 2 : rdef;
      let r = Math.abs(ey - y) / 2 < rInitial ? Math.abs(ey - y) / 2 : rInitial;
      let h = Math.abs(ey - y) / 2 - r;
      let w = Math.abs(ex - x) - r * 2;

      // Build the path
      const path = `
             M ${x} ${y}
             L ${x} ${y+h*yrvs}
             C  ${x} ${y+h*yrvs+r*yrvs} ${x} ${y+h*yrvs+r*yrvs} ${x+r*xrvs} ${y+h*yrvs+r*yrvs}
             L ${x+w*xrvs+r*xrvs} ${y+h*yrvs+r*yrvs}
             C ${ex}  ${y+h*yrvs+r*yrvs} ${ex}  ${y+h*yrvs+r*yrvs} ${ex} ${ey-h*yrvs}
             L ${ex} ${ey}
      `;
      return path;
  }

    closeSelect() {
      this.selectedTag.classList.remove('select-arrow-active');
      this.selectTag.classList.add('select-hide');
    }

    onBeforeState() {

      this.d3 = d3;
      this.context.d3 = d3;
      this.context.d3_root = this;
      this.container = d3.select(this.containerDiv);
      this.parser = new DOMParser();

      this.svgWidth = '100%'; //window.innerWidth;
      this.marginLeft = 0;
      this.marginRight = 0;
      this.svgHeight = "auto" //window.innerWidth;
      this.marginTop = 0;
      this.marginBottom = 0;
      this.depth = 180;
      this.height = 146;
      this.width = 342;
      this.nodeArray = [];
      this.positions = {};
      this.zoomFactor = 0.6;

    }

    injectXml(xmlString, targetNode, comp) {
      let xml = '<xml>' + xmlString + '</xml>';
      let dom = this.parser.parseFromString(xml, 'text/xml');

      function addChildren(element, targetElement) {
        let children = [...element.childNodes];
        children.forEach(function(child) {
          if (child.nodeType === 1) {
            let svgTag = document.createElementNS("http://www.w3.org/2000/svg", child.tagName);
            if (child.hasAttributes()) {
              let attrs = [...child.attributes];
              attrs.forEach(function(attr) {
                if (attr.name === 'golgi-prop') {               
                  comp[attr.value] = svgTag;
                }
                else {
                  svgTag.setAttribute(attr.name, attr.value);
                }
              });
            }
            targetElement.appendChild(svgTag);
            if (child.hasChildNodes()) {
              addChildren(child, svgTag);
            }
          }
          if (child.nodeType === 3) {
            let text = child.data.trim();
            if (text !== '') {
              targetElement.textContent = text;
            }
          }
        });
      }

      addChildren(dom.documentElement, targetNode);
    }
 
  });
};