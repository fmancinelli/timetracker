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
const Main = imports.ui.main;
const St = imports.gi.St;

const TimeTracker = Extension.imports.timetracker;

let timeTrackerIndicator;

function init() {   
}

function enable() {
    if(!timeTrackerIndicator) {
	timeTrackerIndicator = new TimeTracker.Indicator();
	Main.panel.addToStatusArea('timetracker', timeTrackerIndicator);
    }  
}

function disable() {
    if(timeTrackerIndicator) {
	timeTrackerIndicator.destroy();
	timeTrackerIndicator = null;
    }
}
