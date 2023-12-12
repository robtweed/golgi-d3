import JSON5 from 'https://unpkg.com/json5@2/dist/index.min.mjs';

export function load() {
  let gx=`
<sbadmin-content-page name="benchmark" golgi:hook="configure">

  <sbadmin-spacer />

  <sbadmin-card bgColor="light" textColor="dark" widthStyle="98%" position="center" golgi:ref="card" >
    <sbadmin-card-header text="Performance Benchmark" textalign="center" golgi:ref="cardTitle" />
    <sbadmin-card-body>
      <sbadmin-card-text>
         This benchmark will save to Global Storage multiple instances of a value or JSON that you specify
         here.
      </sbadmin-card-text>
      <sbadmin-card-text>
         It will then read them back and report back how long it took to save and retrieve the
         records.
      </sbadmin-card-text>
      <sbadmin-form golgi:ref="form">
        <sbadmin-input type="text" value="bmTest" name="documentName" label="Name of Document into which your values or JSON will be saved:" />
        <sbadmin-textarea name="json" label="Enter the value or JSON to save for each Record:" />
        <sbadmin-input type="number" value="100" name="noOfRecords" label="How many records to create?" min="1" max="1000000" step="100" />
        <sbadmin-spacer />
        <sbadmin-button text="Go!" golgi:ref="goBtn" color="green" position="right" />
      </sbadmin-form>
    </sbadmin-card-body>
  </sbadmin-card>

  <sbadmin-toast golgi:ref="toast" headerText="Warning" autohide="false">
    <div class="mt-2 pt-2 border-top">
      <sbadmin-button color="primary" size="small" text="Submit as Text" golgi:ref="acceptBtn" />
      <sbadmin-button color="secondary" size="small" text="Cancel and Edit JSON" golgi:ref="cancelBtn" />
    </div>
  </sbadmin-toast>

</sbadmin-content-page>
  `;
  let hooks = {
    'sbadmin-content-page': {
      configure: function() {

        let _this = this;
        this.on('selected', () => {

          let submitForm = async() => {
            let body = {}
            for (let val of this.form.values) {
              body[val.name] = val.value;
            }
            let json = await this.context.request('/benchmark', 'post', body);
            return json;
          };

          this.goBtn.on('clicked', async () => {
            try {
              let json = JSON5.parse(this.form.fieldsByName.get('json').value);
              let resp = await submitForm();
            }
            catch(err) {
              this.toast.display('Warning: Unable to parse this as JSON:<br />Treating it as a single text value instead');
            }
          });

          this.acceptBtn.on('clicked', async () => {
            this.toast.hide();
            let resp = await submitForm();
          });

          this.cancelBtn.on('clicked', async () => {
            this.toast.hide();
          });

        });
      }
    }
  };

  return {gx, hooks};
};