const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

var mkdirp = require('mkdirp');

const RIDDLES_YAML = path.resolve(__dirname, './riddles.yml');

let riddles;
try {
    riddles = yaml.safeLoad(fs.readFileSync(RIDDLES_YAML, 'utf8'));
} catch (e) {
    console.log(e);
    process.exit(1);
}

riddles.forEach(riddle => {
    // Example full href: 'https://fivethirtyeight.com/features/who-will-survive-the-dodgeball-duel/'
    let folder_path = riddle.href.replace(/^https?:\/\/fivethirtyeight\.com\//, '');
    let full_folder_path = path.resolve(__dirname, folder_path);

    // Doing this synchronously isn't the best, but oh well
    if (!fs.existsSync(folder_path)) {
        console.log(`Creating "${folder_path}" directory.`);
        mkdirp.sync(full_folder_path);
    }
})
