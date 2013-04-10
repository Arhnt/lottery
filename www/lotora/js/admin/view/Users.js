Ext.define('Loto.view.Users', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.users',
    title: 'Пользователи',
    store: 'User',
    stateful: true,
    columns: [
      {
        text     : 'Дата регистрации',
        dataIndex: 'created',
        format   : 'Y-m-d H:i',
        renderer : Ext.util.Format.dateRenderer('Y-m-d H:i')          
      },
      {
        text     	: 'Последняя активность',
        dataIndex	: 'last_seen',
        format   	: 'Y-m-d H:i',
        renderer 	: Ext.util.Format.dateRenderer('Y-m-d H:i')          
      },
      {
        text     	: 'ASFN ID',
        dataIndex	: 'asfn_id'
      },
      {
        text     	: 'Имя',
        dataIndex	: 'name',
        flex	 	: 1
      },
      {
        text     	: 'E-mail',
        dataIndex	: 'email',
        flex	 	: 1
      },
      {
        text     	: 'Страна',
        dataIndex	: 'country',
        flex	 	: 1
      },
      {
        text     	: 'Населенный пункт',
        dataIndex	: 'city',
        flex	 	: 1
      }
    ]
 });
