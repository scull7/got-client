NODE_BIN=./node_modules/.bin


install:
	yarn install

clean:
	rm -f ./dist/*

build:
	${NODE_BIN}/rollup -c

dist: clean
	NODE_ENV=production ${NODE_BIN}/rollup -c

test: 
	${NODE_BIN}/ava

flow:
	${NODE_BIN}/flow

.PHONY: install test flow build clean
