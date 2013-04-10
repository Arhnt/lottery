Ext.define('Loto.view.Tickets', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.tickets',
    title: 'Билеты',
    store: 'ticketsStore',
    stateful: true,
    columns: [
      {
        text     	: 'ID',
        dataIndex	: 'id'
      },
      {
        text     	: 'Игр',
        dataIndex	: 'games'
      },
      {
        text     	: 'Игр осталось',
        dataIndex	: 'games_left'
      },
      {
        text     	: 'Числа',
        dataIndex	: 'numbers',
        flex		: 1
      }
    ]
});
