dist: clean
	mkdir -p dist build
	cp -r src/* build/
	cp COPYING build
	(cd build; zip -qr ../dist/timetracker@mancinelli.me.zip .)
clean:
	rm -rf build
	rm -rf dist
install: dist
	unzip dist/timetracker@mancinelli.me -d ~/.local/share/gnome-shell/extensions/timetracker@mancinelli.me

