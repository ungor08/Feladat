Ext.define('feladat.view.Viewport', {
    extend: 'Ext.container.Viewport',
    id: 'viewport',
    layout: 'border',
    items: [
                {
                    region: 'east',
                    title: 'Keresés',
                    itemId: 'kereses',
                    collapsible: true,
                    split: true,
                    collapsed: true,
                    width: 400
                }, 
                {
                    region: 'center',
                    xtype: 'mainlist', 
                }
            ]


});