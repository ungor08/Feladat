Ext.define('feladat.store.Ugyintezok', {
    extend: 'Ext.data.Store',
    requires: [
        'Ext.data.proxy.Rest',
        'Ext.data.reader.Json'
    ],
    alias: 'store.ugyintezok',
    storeId: 'ugyintezok',
    itemId: 'ugyintezok',
    model: 'feladat.model.Ugyintezok',
    autoLoad: true,
    autoSync: true,
   
    proxy: {
        type: 'rest',
        url: 'http://localhost/feladat/php/ugyintezok',
        useDefaultXhrHeader: false,
        cors: true,
        reader: {
            type: 'json',
            rootProperty: 'data'
        },
        writer: {
            type: 'json'
        }
    }
});