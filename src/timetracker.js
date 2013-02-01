/*
 * Time tracker. A tool for tracking the time spent on different applications.
 * Copyright (C) 2013 Fabio Mancinelli <fabio@mancinelli.me>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
const ExtensionUtils = imports.misc.extensionUtils;
const Extension = ExtensionUtils.getCurrentExtension();
const Lang = imports.lang;
const MainLoop = imports.mainloop;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
const St = imports.gi.St;
const Shell = imports.gi.Shell;

const Constants = Extension.imports.constants;
const Ui = Extension.imports.ui;
const Utils = Extension.imports.utils;

const TrackingDataStorage = new Lang.Class({
    Name: 'Tracking data storage',

    _init: function() {
	this._trackingData = {};
    },

    track: function(name, seconds) {
	if(this._trackingData[name]) {
	    this._trackingData[name].time += seconds;
	}
	else {
	    this._trackingData[name] = {
		time: seconds
	    }
	}
    },
    
    getTotalFocusTime: function() {
	let totalTrackedTime = 0;
	for(name in this._trackingData) {
	    totalTrackedTime += this._trackingData[name].time;
	}
	
	return totalTrackedTime;
    },

    getTrackedApplicationNames: function() {
	let applicationNames = [];
	for(name in this._trackingData) {
	    applicationNames.push(name);
	}

	return applicationNames;   
    },

    getFocusTime: function(application) {
	return this._trackingData[application].time;
    },

    reset: function() {
	this._trackingData = {};
    }
});

const TimeTracker = new Lang.Class({
    Name: 'Time tracker',    

    _init: function(trackingDataStorage) {
	this._timeoutId = MainLoop.timeout_add(1000, Lang.bind(this, this._trackFocusWindow));
	
	this._trackingDataStorage = trackingDataStorage;
    },

    _trackFocusWindow: function() {
	let focusWindow =  global.screen.get_display().focus_window;
	if(focusWindow) {
	    this._trackingDataStorage.track(focusWindow.get_wm_class(), 1);
	}

	return true;
    },

    destroy: function() {
	if(this._timeoutId) {
	    MainLoop.source_remove(this._timeoutId);
	}
    },

    reset: function() {
	this._trackingDataStorage.reset();
    }
});

const Indicator = new Lang.Class({
    Name: 'Time tracker indicator',
    Extends: PanelMenu.Button,

    _init: function(trackingDataStorage) {
	this.parent(St.Align.START);

	/* Build the indicator UI */
	let boxLayout = new St.BoxLayout();
	let icon = new St.Icon({
	    gicon: Constants.timeTrackerGIcon,
	    style_class: 'system-status-icon'
	});
	boxLayout.add(icon);

	this.actor.add_actor(boxLayout);

	/* Build the indicator menu */
	let applicationList = new PopupMenu.PopupMenuSection();
	this.menu.addMenuItem(applicationList);

	this.menu.connect('open-state-changed', Lang.bind(this, function(menu) {
	    if(menu.isOpen) {
		this._rebuildApplicationList(applicationList, trackingDataStorage);
	    }
	}));

	/* Time tracker */
	this._timeTracker = new TimeTracker(trackingDataStorage);

	/* Handle the destroy signal */
	this.connect('destroy', Lang.bind(this, this._onDestroy));	
    },

    _rebuildApplicationList: function(menuSection, trackingDataStorage) {
	/* Remove all the items */
	menuSection.removeAll();

	menuSection.addMenuItem(new Ui.ApplicationInfoMenuItem(trackingDataStorage));

	/* Separator */
	menuSection.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());

	/* Total time indicator */
	menuSection.addMenuItem(new PopupMenu.PopupMenuItem('Total time: ' + Utils.formatTime(trackingDataStorage.getTotalFocusTime()), { reactive: false }));

	/* Separator */
	menuSection.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());

	let resetMenuItem = new PopupMenu.PopupMenuItem('Reset');
	resetMenuItem.connect('activate', Lang.bind(this, function() {
	    this._timeTracker.reset();
	}));
	menuSection.addMenuItem(resetMenuItem);
    },

    _onDestroy: function() {
	this._timeTracker.destroy();
    }    
});
