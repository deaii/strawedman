
const fs = require('fs').promises;
const path = require('path');
const ejs = require('ejs');
const pkg = require('../package.json');

const buildPath = path.join(__dirname, '..', 'build', 'static');
const jsPath = path.join(buildPath, 'js');
const cssPath = path.join(buildPath, 'css');

const jsChunk = /\.chunk\.js$/;
const jsMainChunk = /main\.[.a-f0-9]+\.chunk\.js$/;
const jsRuntimeChunk = /runtime-main\.[.a-f0-9]+\.chunk\.js$/;
const cssChunk = /\.chunk.css$/;

const encoding = { encoding: 'utf8' };

async function doIt() {
  const jsDirTask = fs.opendir(jsPath);
  const cssDirTask = fs.opendir(cssPath);

  let jsContent = null;
  let jsMainContent = null;
  let cssContent = null;

  const jsDir = await jsDirTask;

  while (true) {
    const dirEnt = await jsDir.read();
    if (!dirEnt) {
      break;
    }
    if (dirEnt.isFile) {
      let name = dirEnt.name;
      if (name.match(jsChunk)) {
        if (name.match(jsRuntimeChunk)) {
          continue;
        }
        if (name.match(jsMainChunk)) {
          jsMainContent = fs.readFile(path.join(jsPath, dirEnt.name));
        } else {
          jsContent = fs.readFile(path.join(jsPath, dirEnt.name));
        }
      }
    }
  }

  const cssDir = await cssDirTask;

  while (true) {
    const dirEnt = await cssDir.read();
    if (!dirEnt) {
      break;
    }
    if (dirEnt.isFile) {
      let name = dirEnt.name;
      if (name.match(cssChunk)) {
        cssContent = fs.readFile(path.join(cssPath, dirEnt.name));
        break;
      }
    }
  }

  if (!jsChunk || !jsMainContent || !cssContent) {
    throw new Error("Not all files found.")
  }

  var distPath = 'dist/' + pkg.version;

  var htmlTemplate = ejs.compile(await fs.readFile(`${__dirname}/../public/index.ejs`, encoding));

	var formatData = {
		author: pkg.author.replace(/ <.*>/, ''),
		description: pkg.description,
		image: 'icon.svg',
		name: 'strawman',
		proofing: false,
		source: htmlTemplate({
			style: await cssContent,
      script1: await jsMainContent,
      script2: await jsContent,
		}),
		url: pkg.repository,
		version: pkg.version
  };

  await fs.mkdir(distPath, {recursive: true});

	await fs.writeFile(
    path.join(distPath, 'format.js'),
		'window.storyFormat(' + JSON.stringify(formatData) + ');'
  );
  
  await fs.copyFile(`${__dirname}/../public/icon.svg`, path.join(distPath, 'icon.svg'));
}

doIt()
.then(() => 0)
.catch((err) => {
  console.error(err);
  return -1;
});
