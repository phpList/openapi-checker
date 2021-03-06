#!/usr/bin/env node

import axios from 'axios';
import YAML from 'yaml';
import fs from 'fs';
import path from 'path';
import {
    exit
} from 'process';


const validate = async (payload) => {
    console.log("Validation started...");
    let res = await axios.post('https://validator.swagger.io/validator/debug', payload);
    if (Object.keys(res.data).length === 0) {
        console.log("Validation passed.");
        process.exit(0);
    } else {
        console.log("Validation failed\n==================\n");
        console.log(res.data);
        console.log("\nPaste your JSON in https://editor.swagger.io/ for more information.")
        process.exit(1);
    }
}


const isPath = (path) => {
    return /((\/)?([A-Za-z0-9_-]+)(\/)?)+[A-Za-z0-9_-]+.((json)|(yaml))/g.test(path);
}

const run = () => {

    let openapi_file = process.argv[2];
    if (openapi_file !== undefined) {

        if (!isPath(openapi_file)) {
            console.log("Invalid JSON or YAML file path: Run npm run validate <file-path> # Example /path/to/file.json");
            exit;
        }

        const extension = path.extname(openapi_file);
        let payload = fs.readFileSync(openapi_file, {
            encoding: 'utf8',
            flag: 'r'
        });

        if (extension === '.json') {
            payload = JSON.parse(payload);
        }

        if (extension === '.yaml') {
            payload = YAML.parse(payload);
        }

        validate(payload);
    } else {
        console.log("Parameter missing: Run npm run validate <file-path>")
    }

}

run();