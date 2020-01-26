Ext.define('feladat.view.Viewport', {
    extend: 'Ext.container.Viewport',
    id: 'viewport',
    // items: [
    //     {
    //         region: 'north',
    //         // xtype: 'feladat-kereses'
    //         html: '<h1>North</h1>'
    //     },
    //     {
    //         region: 'west',
    //         xtype: 'panel',
    //         activeTab: 0,
    //         // itemId: 'viewport-target'
    //         html: '<h1>West</h1>'
    //     },
    //     {
    //         region: 'east',
    //         // xtype: 'panel'
    //         // xtype: 'feladat-kereses'
    //         html: '<h1>East</h1>'
    //     },
    //     {
    //         region: 'south',
    //         // xtype: 'feladat-kereses'
    //         html: '<h1>South</h1>'
    //     },
    // ]
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
                    xtype: 'mainlist', // TabPanel itself has no title
                    // activeTab: 0,      // First tab active by default
                    // items: {
                    //     title: 'Default Tab',
                    //     html: 'The first tab\'s content. Others may be added dynamically'
                    // }
                }
            ]


});