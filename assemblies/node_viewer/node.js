export function load() {
  let gx=`
<d3-node-box>
  <d3-node-text golgi:ref="nodeText" golgi:appendTo="foTarget" />
  <d3-child-node-button golgi:ref="childNodeBtn" golgi:hook="configure" />
  <d3-action-button golgi:ref="actionBtn" golgi:hook="configure" />
  <d3-link golgi:ref="link" />
</d3-node-box>
  `;

  let hooks = {
    'd3-child-node-button': {
      configure: function() {
        let _this = this;
        this.activate = function(data) {

          let handler = async function() {
            console.log('**** this.status = ' + _this.status());
            if (_this.status() === 'expand') {
              if (_this.nodeBox.child_nodes.length === 0) {

                // children haven't yet been fetched from database

                let parentId = data.id;
                let seed = data.seed;
                //let moreSiblings;
                //if (data.moreSiblings) moreSiblings = true;
                let moreSiblings = data.moreSiblings || false;
                let morePreviousSiblings = data.morePreviousSiblings || false;
                if (data.moreSiblings || data.morePreviousSiblings) {
                  parentId = data.parent;
                  let seedInput = _this.nodeBox.nodeText.seedInput;
                  if (seedInput && seedInput.value && seedInput.value !== '') {
                    seed = seedInput.value;
                    moreSiblings = true;
                    morePreviousSiblings = false;
                  }
                }

                let url = '/viewer/getChildNodes';
                let options = {
                  method: 'POST',
                  headers: {
                    'Content-type': 'application/json'
                  },
                  body: JSON.stringify({
                    documentName: data.documentName,
                    path: data.path,
                    parentId: parentId,
                    idCounter: _this.d3_root.topNode.idCounter,
                    moreSiblings: moreSiblings,
                    morePreviousSiblings: morePreviousSiblings,
                    seed: seed,
                    maxSubscripts: _this.d3_root.maxSubscripts
                  })
                };

                let res = await fetch(url, options);
                let json = await res.json();

                if (json.error) {
                  _this.context.toast.display(json.error);
                }
                else {

                  // render the newly-fetched child records as nodes
  
                  let parent_node = _this.nodeBox;
                  _this.d3_root.topNode.idCounter = json.idCounter;

                 
                  //if (data.moreSiblings || data.morePreviousSiblings) {

                  if (moreSiblings || morePreviousSiblings) {
                    console.log('**** more siblings !!');


                    // set the parent to the parent of the more siblings node
                    parent_node = _this.nodeBox.parent_node;

                    // remove the parent's currently-displayed nodes
                    
                    // first make a clone of the parent array

                    //console.log('clicked the moreSiblings node');
                    //console.log('parent_node.child_nodes array: length = ' + parent_node.child_nodes.length);

                    let node_array = parent_node.child_nodes.slice();

                    function removeNodesFromParent(node_array) {

                      node_array.forEach(function(node) {
                        if (node.child_nodes) {
                          let childNode_array = node.child_nodes.slice();
                          removeNodesFromParent(childNode_array);
                        }
                        node.remove();
                        _this.d3_root.removeFromNodeArray(node);
                      });
                    }

                    removeNodesFromParent(node_array);
                
                  }

                  // update the idCounter

                  _this.d3_root.idCounter = json.idCounter;

                  let data = json.nodes;
                  let nodeArray = [];
                  let noOfNodes = data.length;
                  let count = 0;

                  // render each returned node

                  for (let record of data) {

                    // render the node's assembly

                    let node = await _this.renderAssembly('node', _this.d3_root.containerDiv, _this.context);
                    node.id = record.id;

                    // set the initial dummy path

                    let path = _this.d3_root.diagonal(parent_node, parent_node);
                    node.link.rootElement.setAttribute('d', path);
                    node.d3_link = _this.context.d3.select(node.link.rootElement);

                    if (record.moreSiblings) {
                      node.colorOf = 'moreSiblings';
                      node.childNodeBtn.atRight();
                      node.childNodeBtn.show();
                      node.childNodeBtn.activate(record);
                      node.actionBtn.hide();
                      node.nodeText.text = 'More Sibling Nodes';
                      node.nodeText.subscriptDiv.classList.remove('subscript-text-white');
                      node.nodeText.subscriptDiv.classList.add('subscript-text-black');
                      node.nodeText.showAsMoreSiblings();
                    }

                    else if (record.morePreviousSiblings) {
                      node.colorOf = 'moreSiblings';
                      node.childNodeBtn.atLeft();
                      node.childNodeBtn.show();
                      node.childNodeBtn.activate(record);
                      node.actionBtn.hide();
                      node.nodeText.text = 'More Sibling Nodes';
                      node.nodeText.subscriptDiv.classList.remove('subscript-text-white');
                      node.nodeText.subscriptDiv.classList.add('subscript-text-black');
                      node.nodeText.showAsMoreSiblings();
                    }

                    else if (record.leafNode) {
                      node.colorOf = 'leafNode';
                      node.childNodeBtn.hide();
                      node.nodeText.text = record.subscript;
                      node.nodeText.value = record.value;

                      // activate this node's parent action button


                      node.actionBtn.hide();  // for now
                      //parent_node.actionBtn.type = 'add';

                    }
                    else {
                      node.colorOf = 'intermediateNode';
                      node.nodeText.text = record.subscript;
                      node.childNodeBtn.atBottom();
                      node.childNodeBtn.show();
                      node.childNodeBtn.activate(record);
                      node.actionBtn.hide();
                    }

                    //node.parent_node = _this.nodeBox;
                    node.parent_node = parent_node;
                    //_this.nodeBox.child_nodes.push(node);
                    parent_node.child_nodes.push(node);
 
                    nodeArray.push({
                      id: record.id,
                      parent: record.parent,
                      node: node
                    });
 
                  }

                  // append the nodes to the control array and re-render

                  _this.d3_root.appendNodeData(nodeArray);
                  _this.d3_root.render();
                  //parent_node.actionBtn.type = 'add';
                  parent_node.childNodeBtn.type = 'collapse';
                }
              }
              else {
                // child nodes have already been fetched, so just bring them back into view

                function resetNodes(parentNode) {
                  if (parentNode.child_nodes && parentNode.child_nodes.length > 0 && parentNode.childNodeBtn.status() === 'collapse') {
                    parentNode.child_nodes.forEach(function(child) {
                      _this.d3_root.nodeArray.push({
                        id: child.id,
                        parent: child.parent_node.id,
                        node: child
                      });
                      resetNodes(child);
                    });
                  }
                }

                //_this.nodeBox.actionBtn.type = 'add';
                _this.nodeBox.childNodeBtn.type = 'collapse';

                resetNodes(_this.nodeBox);
                _this.d3_root.render();
              }
            }
            else {
              // collapse and hide child nodes

              function collapseChildNodes(parentNode) {
                if (parentNode.child_nodes) {
                  parentNode.child_nodes.forEach(function(child) {
                    collapseChildNodes(child);
                    child.collapse();
                    _this.d3_root.removeFromNodeArray(child);
                  });
                }
              }
              collapseChildNodes(_this.nodeBox);
              _this.nodeBox.childNodeBtn.type = 'expand';
              _this.nodeBox.actionBtn.hide();

              // redraw hiearchy in case positions of visible nodes will have changed
              _this.d3_root.render();
            }
          };
          _this.addHandler(handler);
        };
      }
    },
    'd3-action-button': {
      configure: function() {
        let _this = this;
        this.activate = function(data) {
        };
      }
    }
  };

  return {gx, hooks};
};