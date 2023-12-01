export function load(ctx) {

  let gx=`
<sbadmin-root>

  <span golgi:appendTo="topbarTarget">
    <sbadmin-sidebar-toggle />
    <sbadmin-brand text="Global Storage Viewer" />
  </span>

  <sbadmin-footer-text golgi:appendTo="footerTarget">
    Developed using the golgi-sbadmin WebComponent Library
  </sbadmin-footer-text>

  <sbadmin-sidebar-menu golgi:appendTo="sidebarTarget">
    <sbadmin-sidebar-heading text="Global Storage Documents" />
    <sbadmin-sidebar-nested-menu iconName="list" text="Directory" golgi:hook="getDirectory" />
  </sbadmin-sidebar-menu>


  <sbadmin-sidebar-footer bgColor="#eeeeee" golgi:appendTo="sidebarTarget">
    <sbadmin-footer-text text="Not Logged In" />
  </sbadmin-sidebar-footer>

</sbadmin-root>
  `;

  let hooks = {
    'sbadmin-sidebar-nested-menu': {
      getDirectory: function() {
        this.on('menuItemSelected', async (data) => {

          if (this.globalArr) return;

          // send request for global directory

          let json = await this.context.request('/viewer/globaldirectory');
          this.globalArr = json.names;
          // add list of menu items using this array

          for (let name of this.globalArr) {
            let item = await this.renderComponent('sbadmin-sidebar-menu-item', this.childrenTarget, this.context);
            item.text = name;
            item.contentPage = 'node_viewer';
            item.globalName = name;

            item.on('menuItemSelected', (data) => {
              console.log('**** global menu item selected: ****');
              console.log(data);
            });       

          }
        });
      }
    }
  };

  return {gx, hooks};
};