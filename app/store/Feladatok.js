Ext.define('feladat.store.Feladatok', {
    extend: 'Ext.data.Store',
    requires: [
        'Ext.data.proxy.Rest',
        'Ext.data.reader.Json'
    ],
    alias: 'store.feladatok',
    storeId: 'feladatok',
    itemId: 'feladatok',
    model: 'feladat.model.Feladatok',
    autoLoad: true,
    autoSync: true,
    // pageSize: 10,
    sorters: [{
        property: 'letrehozas_datuma',
        direction: 'ASC'
    }],

    // idProperty: 'feladat_azonosito',
    // clientIdProperty: 'id',
    // identifier: 'negative',

    proxy: {
        type: 'rest',
        url: 'http://localhost/feladat/php/feladatok',
        appendId: true,
        reader: {
            type: 'json',
            rootProperty: 'data'
        },
        writer: {
            type: 'json',
            writeRecordId: true,
            writeRecord: 'data'
        }
    }
});
