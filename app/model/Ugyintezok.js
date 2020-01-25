Ext.define('feladat.model.Ugyintezok', {
    extend: 'feladat.model.Base',
    idProperty: 'ugyintezo_azonosito',
    idProperty: 'feladat_azonosito',
    clientIdProperty: 'clientId',
    identifier: 'negative',
    fields: [
        {
            name: "ugyintezo_azonosito"
        },
        {
            name: "ugyintezo_nev"
        },
        {
            name: "ugyintezo_email"
        }
    ],
        /*
        Uncomment to add validation rules
            validators: {
            age: 'presence',
            name: { type: 'length', min: 2 },
            gender: { type: 'inclusion', list: ['Male', 'Female'] },
            username: [
            { type: 'exclusion', list: ['Admin', 'Operator'] },
            { type: 'format', matcher: /([a-z]+)[0-9]{2,3}/i }
            ]
            }
        */
        /*
        Uncomment to add a rest proxy that syncs data with the back end.
            proxy: {
            type: 'rest',
            url : '/users'
            }
        */
});