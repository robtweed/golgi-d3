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

  <sbadmin-modal golgi:ref="modal">
    <div golgi:appendTo="header">Results</div>

    <sbadmin-card-text cls="fw-bold" align="center">Set Performance</sbadmin-card-text>

    <sbadmin-table cls="table-striped" golgi:ref="setPerfTable" />
    <sbadmin-button color="green" size="small" text="Show mg-dbx-napi API Usage" golgi:ref="dbxSetCountBtn" />
    <sbadmin-table cls="table-striped" hidden="true" golgi:ref="setDbxTable" />

    <sbadmin-card-text cls="fw-bold" align="center">Get Performance (Using Nested Nexts)</sbadmin-card-text>

    <sbadmin-table cls="table-striped" golgi:ref="getPerfTable" />
    <sbadmin-button color="green" size="small" text="Show mg-dbx-napi API Usage" golgi:ref="dbxGetCountBtn" />
    <sbadmin-table cls="table-striped" hidden="true" golgi:ref="getDbxTable" />

    <sbadmin-card-text cls="fw-bold" align="center">Get Performance (Using mcursor/leaf nodes)</sbadmin-card-text>

    <sbadmin-table cls="table-striped" golgi:ref="getqPerfTable" />
    <sbadmin-button color="green" size="small" text="Show mg-dbx-napi API Usage" golgi:ref="dbxGetqCountBtn" />
    <sbadmin-table cls="table-striped" hidden="true" golgi:ref="getqDbxTable" />

  </sbadmin-modal>

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

          let showDbxSetCount = false;
          let showDbxGetCount = false;
          let showDbxGetqCount = false;

          let displayTables = (resp) => {
              this.modal.show();

              let table = {
                head: [
                  {value: 'No of Records'}, 
                  {value: 'Time (sec)'}, 
                  {value: 'Rate (per sec)'}
                ],
                body: [
                  [
                    {value: resp.set.noOfRecords}, 
                    {value: resp.set.totalTime}, 
                    {value: resp.set.rate}
                  ]
                ]
              };
              this.setPerfTable.render(table);

              table = {
                body: [
                  [
                    {value: 'set'}, 
                    {value: resp.set.dbxCounts.set}
                  ],
                  [
                    {value: 'get'}, 
                    {value: resp.set.dbxCounts.get}
                  ],
                  [
                    {value: 'increment'}, 
                    {value: resp.set.dbxCounts.inc}
                  ],
                  [
                    {value: 'defined'}, 
                    {value: resp.set.dbxCounts.def}
                  ],
                  [
                    {value: 'next'}, 
                    {value: resp.set.dbxCounts.nxt}
                  ],
                ]
              };
              this.setDbxTable.render(table);

              table = {
                head: [
                  {value: 'No of Records'}, 
                  {value: 'Time (sec)'}, 
                  {value: 'Rate (per sec)'}
                ],
                body: [
                  [
                    {value: resp.get.noOfRecords}, 
                    {value: resp.get.totalTime}, 
                    {value: resp.get.rate}
                  ]
                ]
              };
              this.getPerfTable.render(table);

              table = {
                body: [
                  [
                    {value: 'set'}, 
                    {value: resp.get.dbxCounts.set}
                  ],
                  [
                    {value: 'get'}, 
                    {value: resp.get.dbxCounts.get}
                  ],
                  [
                    {value: 'increment'}, 
                    {value: resp.get.dbxCounts.inc}
                  ],
                  [
                    {value: 'defined'}, 
                    {value: resp.get.dbxCounts.def}
                  ],
                  [
                    {value: 'next'}, 
                    {value: resp.get.dbxCounts.nxt}
                  ],
                ]
              };
              this.getDbxTable.render(table);

              table = {
                head: [
                  {value: 'No of Records'}, 
                  {value: 'Time (sec)'}, 
                  {value: 'Rate (per sec)'}
                ],
                body: [
                  [
                    {value: resp.get_q.noOfRecords}, 
                    {value: resp.get_q.totalTime}, 
                    {value: resp.get_q.rate}
                  ]
                ]
              };
              this.getqPerfTable.render(table);

              table = {
                body: [
                  [
                    {value: 'set'}, 
                    {value: resp.get_q.dbxCounts.set}
                  ],
                  [
                    {value: 'get'}, 
                    {value: resp.get_q.dbxCounts.get}
                  ],
                  [
                    {value: 'increment'}, 
                    {value: resp.get_q.dbxCounts.inc}
                  ],
                  [
                    {value: 'defined'}, 
                    {value: resp.get_q.dbxCounts.def}
                  ],
                  [
                    {value: 'next'}, 
                    {value: resp.get_q.dbxCounts.nxt}
                  ],
                ]
              };
              this.getqDbxTable.render(table);
          };

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
              displayTables(resp);
            }
            catch(err) {
              this.toast.display('Warning: Unable to parse this as JSON:<br />Treating it as a single text value instead');
            }
          });

          this.acceptBtn.on('clicked', async () => {
            this.toast.hide();
            let resp = await submitForm();
            displayTables(resp);
          });

          this.cancelBtn.on('clicked', async () => {
            this.toast.hide();
          });

          this.dbxSetCountBtn.on('clicked', () => {
            showDbxSetCount = !showDbxSetCount;
            if (showDbxSetCount) {
              this.setDbxTable.show();
              this.dbxSetCountBtn.text = 'Hide mg-dbx-napi API Usage';
            }
            else {
              this.setDbxTable.hide();
              this.dbxSetCountBtn.text = 'Show mg-dbx-napi API Usage';
            }
          });

          this.dbxGetCountBtn.on('clicked', () => {
            showDbxGetCount = !showDbxGetCount;
            if (showDbxGetCount) {
              this.getDbxTable.show();
              this.dbxGetCountBtn.text = 'Hide mg-dbx-napi API Usage';
            }
            else {
              this.getDbxTable.hide();
              this.dbxGetCountBtn.text = 'Show mg-dbx-napi API Usage';
            }
          });

          this.dbxGetqCountBtn.on('clicked', () => {
            showDbxGetqCount = !showDbxGetqCount;
            if (showDbxGetqCount) {
              this.getqDbxTable.show();
              this.dbxGetqCountBtn.text = 'Hide mg-dbx-napi API Usage';
            }
            else {
              this.getqDbxTable.hide();
              this.dbxGetqCountBtn.text = 'Show mg-dbx-napi API Usage';
            }
          });

        });
      }
    }
  };

  return {gx, hooks};
};