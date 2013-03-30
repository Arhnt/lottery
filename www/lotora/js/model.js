Ext.define('GameSession', {
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
  hasMany: { model: 'Ticket', name: 'tickets', foreignKey: 'session_id' }
});
 
Ext.create('Ext.data.Store', {
  storeId: 'sessionsStore',
  model: 'GameSession',
  autoLoad: true,
  proxy: new Ext.data.HttpProxy({
    url: '/lotora/admin/sessions/load/ajax/',
    reader: {
      type: 'json',
      root: 'data'
    }
  })
});

Ext.define('Ticket', {
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
    { type: 'belongsTo', model: 'GameSession', primaryKey: 'id', foreignKey: 'session_id' }
  ]
});

Ext.create('Ext.data.Store', {
  storeId: 'ticketsStore',
  model: 'Ticket',
  autoLoad: false,
  proxy: new Ext.data.HttpProxy({
    url: '/lotora/admin/tickets/load/ajax/',
    reader: {
      type: 'json',
      root: 'data'
    }
  })
});

Ext.define('User', {
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

Ext.create('Ext.data.Store', {
  storeId: 'usersStore',
  model: 'User',
  autoLoad: true,
  proxy: new Ext.data.HttpProxy({
    url: '/lotora/admin/users/load/ajax/',
    reader: {
      type: 'json',
      root: 'data'
    }
  })
});

Ext.define('Game', {
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
  hasMany: { model: 'PlayedTicket', name: 'tickets', foreignKey: 'game_id' }
});
 
Ext.create('Ext.data.Store', {
  storeId: 'gamesStore',
  model: 'Game',
  autoLoad: true,
  proxy: new Ext.data.HttpProxy({
    url: '/lotora/admin/games/load/ajax/',
    reader: {
      type: 'json',
      root: 'data'
    }
  })
});

Ext.define('PlayedTicket', {
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
  model: 'PlayedTicket',
  autoLoad: true,
  proxy: new Ext.data.HttpProxy({
    url: '/lotora/admin/gamehistory/load/ajax/',
    reader: {
      type: 'json',
      root: 'data'
    }
  })
});

Ext.define('Budget', {
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
  model: 'Budget',
  autoLoad: true,
  proxy: new Ext.data.HttpProxy({
    url: '/lotora/admin/budget/load/ajax/',
    reader: {
      type: 'json',
      root: 'data'
    }
  })
});

