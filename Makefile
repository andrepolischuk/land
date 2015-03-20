
default: test

test: build
	@open test/index.html

clean:
	@rm -rf build.js land.js land.min.js components node_modules

build: $(wildcard test/*.js)
	@duo --development --stdout test/test.js > build.js

bundle: index.js
	@duo --standalone land --stdout index.js > land.js
	@uglifyjs land.js --mangle --compress --output land.min.js

.PHONY: clean test
