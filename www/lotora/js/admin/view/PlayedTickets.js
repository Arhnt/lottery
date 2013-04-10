Ext.define('Loto.view.PlayedTickets', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.playedTickets',
    title: 'Билеты',
    store: 'playedTicketsStore',
    stateful: true,
    columns: [
      {
        text     	: 'ID',
        dataIndex	: 'id'
      },
      {
        text     	: 'Пользователь',
        dataIndex	: 'asfn_id'
      },
      {
          text     	: 'Угадано',
          dataIndex	: 'guessed'
      },
      {
        text     	: 'Числа',
        dataIndex	: 'numbers',
        sortable 	: false,
        flex	 	: 1
      }
    ]
});
