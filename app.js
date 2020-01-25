/*
 * This file launches the application by asking Ext JS to create
 * and launch() the Application class.
 */
Ext.application({
    extend: 'feladat.Application',

    name: 'feladat',

    requires: [
        // This will automatically load all classes in the feladat namespace
        // so that application classes do not need to require each other.
        'feladat.*'
    ],

    launch: function () {
        viewport = Ext.getCmp('viewport');
        target = viewport.down('#kereses');
        view = Ext.create('feladat.view.main.Kereses');
        target.add(view);
    },

    // The name of the initial view to create.
    // mainView: 'feladat.view.main.Feladatok',
    // mainView: 'feladat.view.main.Kereses'
    autoCreateViewport: true
});
