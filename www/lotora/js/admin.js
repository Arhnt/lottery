Ext.Loader.setConfig({enabled:true});
Ext.application({
    name: 'Loto',
    appFolder: '/lotora/js/admin',
    controllers: [
      'Options',
      'Games',
      'Budget',
      'Tickets',
      'Sessions',
      'PlayedTickets',
      'Users'
    ], 
    launch: function()
    {
        Ext.create('Ext.container.Viewport', {
            layout: 'fit',
            items: [{
                xtype: 'tabpanel',
                renderTo: 'admin-screen',
                width: "100%",
                activeTab: 0,
                frame: true,
                defaults: {
                    autoHeight: true
                },
                items: [
                    { xtype: 'options' },
                    {
                        title: 'Розыгрыши',
                        items: [
                            { xtype: 'games' },
                            { xtype: 'playedTickets' },
                            {
                              xtype: 'users',
                              title: 'Победители',
                              store: null
                            }
                        ]
                    },
                    {
                        title: 'Сессии',
                        items: [
                            { xtype: 'sessions' },
                            { xtype: 'tickets' }
                        ]
                    },
                    { xtype: 'budget' },
                    { xtype: 'users' }
                ]
            }]
        });
    }
});
