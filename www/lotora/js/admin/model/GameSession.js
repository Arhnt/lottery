Ext.define('Loto.model.GameSession', {
  extend: 'Ext.data.Model',
  fields: [
    {name: 'id', type: 'int'},
    {name: 'cgi_session'},
    {name: 'user_id', type: 'int'},
    {name: 'game_price', type: 'float'},
    {name: 'key'},
    {name: 'created', type: 'date', dateFormat: 'Y-m-d H:i:s'},
    {name: 'paid', type: 'date', dateFormat: 'Y-m-d H:i:s'}
  ],
  autoLoad: true,
  hasMany: { model: 'Loto.model.Ticket', name: 'tickets', foreignKey: 'session_id', associationKey: 'tickets' }
});
 
Ext.create('Ext.data.Store', {
  storeId: 'sessionsStore',
  model: 'Loto.model.GameSession',
  autoLoad: true,
  proxy: new Ext.data.HttpProxy({
    url: '/lotora/admin/sessions/load/ajax/',
    reader: {
      type: 'json',
      root: 'data'
    }
  })
});
