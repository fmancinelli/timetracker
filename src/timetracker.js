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

const Utils = Extension.imports.utils;

const TimeTracker = new Lang.Class({
    Name: 'Time tracker',    

    _init: function() {
	this._timeoutId = MainLoop.timeout_add(1000, Lang.bind(this, this._trackFocusWindow));
	
	this.trackingData = {};
    },

    _trackFocusWindow: function() {
	let focusWindow =  global.screen.get_display().focus_window;
	if(focusWindow) {	    
	    if(this.trackingData[focusWindow.get_wm_class()]) {
		this.trackingData[focusWindow.get_wm_class()].time++;
	    }
	    else {
		this.trackingData[focusWindow.get_wm_class()] = {
		    time: 1
		};
	    }
	}

	return true;
    },

    destroy: function() {
	if(this._timeoutId) {
	    MainLoop.source_remove(this._timeoutId);
	}
    }    
});

const Indicator = new Lang.Class({
    Name: 'Time tracker indicator',
    Extends: PanelMenu.Button,

    _init: function() {
	this.parent(St.Align.START);

	/* Build the indicator UI */
	let boxLayout = new St.BoxLayout();
	let icon = new St.Icon({
	    icon_name: 'system-run-symbolics',
	    style_class: 'system-status-icon'
	});
	boxLayout.add(icon);

	this.actor.add_actor(boxLayout);

	/* Build the indicator menu */
	let applicationList = new PopupMenu.PopupMenuSection();
	this.menu.addMenuItem(applicationList);

	this.menu.connect('open-state-changed', Lang.bind(this, function(menu) {
	    if(menu.isOpen) {
		this._rebuildApplicationList(applicationList, this._timeTracker);
	    }
	}));

	/* Time tracker */
	this._timeTracker = new TimeTracker();

	/* Handle the destroy signal */
	this.connect('destroy', Lang.bind(this, this._onDestroy));	
    },

    _rebuildApplicationList: function(menuSection, timeTracker) {
	/* Remove all the items */
	menuSection.removeAll();

	let trackingData = timeTracker.trackingData;
	let item;
	let totalTime = 0;

	let wmClasses = [];

	/* Compute the total time and sort WM class names */
	for(wmClass in trackingData) {
	    totalTime += trackingData[wmClass].time;
	    wmClasses.push(wmClass);
	}

	wmClasses.sort();

	/* Add a menu item for each tracked window */
	for(let i = 0; i < wmClasses.length; i++) {
	    let wmClass = wmClasses[i];
	    let time = trackingData[wmClass].time;
	    item = new PopupMenu.PopupMenuItem(wmClass +
					       ': ' +
					       Math.round((time * 100) / totalTime) +
					       '% (' +
					       Utils.formatTime(time) +
					       ')', { reactive: false });  	    
	    menuSection.addMenuItem(item);
	}

	/* Separator */
	menuSection.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());

	/* Total time indicator */
	item = new PopupMenu.PopupMenuItem('Total time: ' + Utils.formatTime(totalTime), { reactive: false });
	menuSection.addMenuItem(item);
    },

    _onDestroy: function() {
	this._timeTracker.destroy();
    }    
});


