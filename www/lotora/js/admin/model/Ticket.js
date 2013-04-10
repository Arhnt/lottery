Ext.define('Loto.model.Ticket', {
  extend: 'Ext.data.Model',
  fields: [
    {name: 'id', type: 'int'},
    {name: 'numbers', type: 'string'},
    {name: 'session_id', type: 'int'},
    {name: 'games', type: 'int'},
    {name: 'games_left', type: 'int'}
  ],
  autoLoad: true,
  associations: [
    { type: 'belongsTo', model: 'Loto.model.GameSession', primaryKey: 'id', foreignKey: 'session_id' }
  ]
});

Ext.create('Ext.data.Store', {
  storeId: 'ticketsStore',
  model: 'Loto.model.Ticket',
  autoLoad: false,
  proxy: new Ext.data.HttpProxy({
    url: '/lotora/admin/tickets/load/ajax/',
    reader: {
      type: 'json',
      root: 'data'
    }
  })
});