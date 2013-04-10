Ext.define('Loto.model.PlayedTicket', {
  extend: 'Ext.data.Model',
  fields: [
    {name: 'id', type: 'int'},
    {name: 'game_id', type: 'int'},
    {name: 'asfn_id'},
    {name: 'numbers'},
    {name: 'guessed', type: 'int'}
  ]
});
 
Ext.create('Ext.data.Store', {
  storeId: 'playedTicketsStore',
  model: 'Loto.model.PlayedTicket',
  autoLoad: true,
  proxy: new Ext.data.HttpProxy({
    url: '/lotora/admin/gamehistory/load/ajax/',
    reader: {
      type: 'json',
      root: 'data'
    }
  })
});
