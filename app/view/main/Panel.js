Ext.create('Ext.panel.Panel', {
    width: 500,
    height: 300,
    title: 'Border Layout',
    xtype: 'panel',
    layout: 'border',
    items: [{
        title: 'South Region is resizable',
        region: 'south', // position for region
        xtype: 'panel',

        height: 100,
        split: true, // enable resizing
        margins: '0 5 5 5'
    }, {
        // xtype: 'panel' implied by default
        title: 'West Region is collapsible',
        region: 'east',
        xtype: 'panel',
        layout: 'fit',
        flex:100,
        collapsible:true,
        id: 'west-region-container',
        layout: 'fit',
        html:'Content of the west panel'
    }, {
        title: 'Center Region is collapsible',
        region: 'center', 
        xtype: 'panel',
        //hidden:true,
        flex:100,
        layout: 'fit',
        collapsible:true,
        html:'Content of the center'
    }],
    renderTo: Ext.getBody()
});