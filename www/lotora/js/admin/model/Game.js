Ext.define('Loto.model.Game', {
  extend: 'Ext.data.Model',
  fields: [
    {name: 'id', type: 'int'},
    {name: 'sum', type: 'float'},
    {name: 'lucky_numbers', type: 'string'},
    {name: 'prize', type: 'float'},
    {name: 'winners', type: 'string'},
    {name: 'date', type: 'date', dateFormat: 'Y-m-d H:i:s'}
  ],
  autoLoad: true,
  hasMany: { model: 'Loto.model.PlayedTicket', name: 'tickets', foreignKey: 'game_id' }
});
 
Ext.create('Ext.data.Store', {
  storeId: 'gamesStore',
  model: 'Loto.model.Game',
  autoLoad: true,
  proxy: new Ext.data.HttpProxy({
    url: '/lotora/admin/games/load/ajax/',
    reader: {
      type: 'json',
      root: 'data'
    }
  })
});
