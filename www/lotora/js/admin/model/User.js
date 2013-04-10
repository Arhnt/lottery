Ext.define('Loto.model.User', {
  extend: 'Ext.data.Model',
  fields: [
    {name: 'id', type: 'int'},
    {name: 'asfn_id', type: 'string'},
    {name: 'name', type: 'string'},
    {name: 'email', type: 'email'},
    {name: 'country', type: 'string'},
    {name: 'city', type: 'string'},
    {name: 'created', type: 'date', dateFormat: 'Y-m-d H:i:s'},
    {name: 'last_seen', type: 'date', dateFormat: 'Y-m-d H:i:s'}
  ],
  autoLoad: true,
});
