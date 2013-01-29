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
const PopupMenu = imports.ui.popupMenu;
const St = imports.gi.St;

const Utils = Extension.imports.utils;

const ApplicationInfoMenuItem = new Lang.Class({
    Name: 'ApplicationInfoMenuItem',
    Extends: PopupMenu.PopupBaseMenuItem,

    _init: function(trackingDataStorage) {
	this.parent({reactive: false});

	let boxLayout = new St.BoxLayout();

	let appNamesLayout = new St.BoxLayout({
	    vertical: true,
	    styleClass: 'application-names-box'
	});

	let appTimesLayout = new St.BoxLayout({
	    vertical: true,
	    styleClass: 'application-times-box'
	});

	let appPercentagesLayout = new St.BoxLayout({
	    vertical: true,
	    styleClass: 'application-percentages-box'
	});
	
	let totalFocusTime = trackingDataStorage.getTotalFocusTime();
	
	let applicationNames = trackingDataStorage.getTrackedApplicationNames();
	applicationNames.sort();

	for(let i = 0; i < applicationNames.length; i++) {
	    let applicationName = applicationNames[i];
	    
	    let label = new St.Label({
		text: applicationName
	    });
	    appNamesLayout.add(label);
	
	    label = new St.Label({
		text: '(' + Utils.formatTime(trackingDataStorage.getFocusTime(applicationName)) + ')'
	    });
	    appTimesLayout.add(label);

	    label = new St.Label({
		text: Math.round((trackingDataStorage.getFocusTime(applicationName) * 100) / totalFocusTime) + '%'
	    });
	    appPercentagesLayout.add(label);
	}

	boxLayout.add(appNamesLayout);
	boxLayout.add(appPercentagesLayout);
	boxLayout.add(appTimesLayout);
	
	this.addActor(boxLayout);
    }
});
