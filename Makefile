.PHONY: build clean build-notify

build: src/build.js

build-dev: src/build-dev.js

clean:
	rm -f src/build.js

build-notify:
	make build -q || (make build && notify-send "Built")

# Note: browserify --list is so slow, just rely on node_modules
src/build.js: src/app.js $(shell ls src/lib/*.js) node_modules
	./node_modules/.bin/browserify --debug -t reactify -o $@ -- $<

# Build only base libraries, the rest is loaded using individual <script>
src/build-dev.js: node_modules
	./node_modules/.bin/browserify -r react -r react/dist/JSXTransformer -o $@

node_modules:
	npm install
