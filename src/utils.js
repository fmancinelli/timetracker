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
const Tweener = imports.ui.tweener;

function formatTime(time) {
    // See http://stackoverflow.com/questions/4228356/integer-division-in-javascript
    let hours = ~~(time / 3600);
    time -= hours * 3600;
    let minutes = ~~(time / 60);
    let seconds = time % 60;

    if(hours < 10) {
	hours = '0' + hours;
    }
    
    if(minutes < 10) {
	minutes = '0' + minutes;
    }

    if(seconds < 10) {
	seconds = '0' + seconds;
    }

    return hours + ':' + minutes + ':' + seconds;
}

