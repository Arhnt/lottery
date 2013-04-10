Ext.define('Loto.view.Games', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.games',
    title: 'Розыгрыши',
    store: 'gamesStore',
    stateful: true,
    columns: [
      {
        text     	: 'ID',
        dataIndex	: 'id'
      },
      {
        text     	: 'Дата',
        dataIndex	: 'date',
        format   	: 'Y-m-d H:i',
        renderer 	: Ext.util.Format.dateRenderer('Y-m-d H:i')          
      },
      {
        text     	: 'Выигрышные числа',
        sortable 	: false,
        dataIndex	: 'lucky_numbers',
        flex     	: 1
      },
      {
        text     	: 'Билеты',
        dataIndex	: 'tickets',
        renderer 	: function(value, meta, record){
          return record.tickets().count();
        }
      },
      {
        text     	: 'Стоимость',
        dataIndex	: 'sum'
      },
      {
        text     	: 'Приз',
        dataIndex	: 'prize',
      },
      {
        text     	: 'Победители',
        dataIndex	: 'winners',
        flex	 	: 1
      }
    ]
});
