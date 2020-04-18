
const fs = require('fs').promises;
const path = require('path');
const pkg = require('../package.json');

const encoding = { encoding: 'utf8' };

async function doIt() {
  var html = await fs.readFile(`${__dirname}/../public/index_debug.html`, encoding);

	var formatData = {
		author: pkg.author.replace(/ <.*>/, ''),
		description: pkg.description,
		image: 'icon.svg',
		name: `${pkg.name}-debug`,
		proofing: false,
		source: html, 
		url: pkg.repository,
		version: pkg.version
  };

  await fs.mkdir(`${__dirname}/../public/`, {recursive: true});

	await fs.writeFile(
    path.join(`${__dirname}/../public/`, 'format-debug.js'),
		'window.storyFormat(' + JSON.stringify(formatData) + ');'
	);
}

doIt()
.then(() => 0)
.catch((err) => {
  console.error(err);
  return -1;
});
