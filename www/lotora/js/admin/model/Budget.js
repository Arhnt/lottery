Ext.define('Loto.model.Budget', {
  extend: 'Ext.data.Model',
  fields: [
    {name: 'game_id', type: 'int'},
    {name: 'sum', type: 'float'},
    {name: 'prize', type: 'float'},
    {name: 'costs', type: 'float'},
    {name: 'marketing', type: 'float'},
    {name: 'support', type: 'float'},
    {name: 'profit', type: 'float'}
  ]
});
 
Ext.create('Ext.data.Store', {
  storeId: 'budgetStore',
  model: 'Loto.model.Budget',
  autoLoad: true,
  proxy: new Ext.data.HttpProxy({
    url: '/lotora/admin/budget/load/ajax/',
    reader: {
      type: 'json',
      root: 'data'
    }
  })
});

