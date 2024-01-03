export function load() {
  let gx=`
<sbadmin-content-page name="node_viewer" golgi:hook="configure">

  <sbadmin-spacer />

  <sbadmin-card bgColor="light" textColor="dark" widthStyle="98%" position="center" golgi:ref="viewerCard" >
    <sbadmin-card-header text="Node Viewer" textalign="center" golgi:ref="nodeCardTitle" />
    <sbadmin-card-body>
      <d3-hierarchy-root maxSubscripts="6" golgi:ref="d3_root">
      </d3-hierarchy-root>
    </sbadmin-card-body>
  </sbadmin-card>

  <sbadmin-toast golgi:ref="toast" />

</sbadmin-content-page>
  `;

  let hooks = {
    'sbadmin-content-page': {
      configure: async function() {

        let _this = this;

        this.on('selected', async () => {

          let documentName = this.menuComponent.globalName;
          this.context.toast = this.toast;

          var targetNode = this.viewerCard.rootElement;
          var observer = new MutationObserver(() => {
            if(targetNode.style.display != 'none'){
              console.log('Now on view!');
              let rootRect = this.d3_root.containerDiv.getBoundingClientRect();
              console.log(rootRect);
              this.d3_root.offsetX = (rootRect.width / 2) - 102;
              this.d3_root.offsetY = 8;
              this.d3_root.position = {
                x: this.d3_root.offsetX,
                y: this.d3_root.offsetY
              };
            }
          });
          observer.observe(targetNode, { attributes: true, childList: true });

          this.context.nodeBoxTarget = this.d3_root.nodeBoxTarget;

          let json = await this.context.request('/viewer/documentNode/' + documentName);

          if (json.error) {
            this.toast.display(json.error);
          }
          else {
            this.viewerCard.show();
            this.nodeCardTitle.text = ' Document: ' + documentName;
            this.context.d3_root.clearDown();

            let node = await this.renderAssembly('node', this.d3_root.containerDiv, this.context);
            node.colorOf = 'documentNode';
            node.childNodeBtn.show();
            node.nodeText.text = json.node.documentName;
            node.childNodeBtn.activate(json.node);
            node.actionBtn.hide();
            node.id = json.node.id;
            node.idCounter = json.idCounter;

            this.d3_root.topNode = node;
            let nodeArray = [];
            nodeArray.push({
              node: node,
              id: json.node.id,
              parent: ''
            });
            this.d3_root.appendNodeData(nodeArray);
            this.d3_root.render();
          }

        });
      }
    },
    'sbadmin-select': {
      populate: async function() {
        let url = '/viewer/globaldirectory';
        let json = await this.context.request(url);
        let arr = [];
        json.names.forEach((name) => {
          arr.push({value: name, text: name});
        });
        this.options = arr;
      }
    }
  };

  return {gx, hooks};
};