Ext.define('Admin.view.faq.Feladatok', {
    extend: 'Ext.dataview.Feladatok',
    xtype: 'faq',

    store: {
        type: 'faq',
        autoLoad: true
    },

    itemConfig: {
        xtype: 'faqitems',
        shadow: true,
        viewModel: true,
        bind: {
            title: '{record.name}',
            store: '{record.questions}'
        }
    }
});
