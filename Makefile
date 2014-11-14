SOURCE = src/app.js
LIBS = $(shell ls src/lib/*.js)
TARGET = src/build.js
FLAGS = -t reactify -t es6ify

WATCHIFY = ./node_modules/.bin/watchify
BROWSERIFY = ./node_modules/.bin/browserify
NPM = npm

# make sourcemap=1 build
ifdef sourcemap
	FLAGS += --debug
endif

.PHONY: build clean watch

build: $(TARGET)

clean:
	rm -f $(TARGET)

watch:
	$(WATCHIFY) $(FLAGS) -o $(TARGET) -- $(SOURCE)

# Note: browserify --list is so slow, just rely on node_modules
$(TARGET): $(SOURCE) $(LIBS) node_modules
	$(BROWSERIFY) $(FLAGS) -o $@ -- $<

node_modules:
	$(NPM) install
