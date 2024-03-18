// this file invokes the backend service

import { spawn } from 'child_process';
import path from 'path';

const BACKEND_WORKING_DIRECTORY = path.join(__dirname, '..', '..', '..', '..', '..', '..', 'backend');
const BACKEND_COMMAND = 'docker compose up';

console.log('BACKEND_WORKING_DIRECTORY', BACKEND_WORKING_DIRECTORY);

export async function invokeBackend() {
    const backendProcess = spawn(BACKEND_COMMAND, {
        cwd: BACKEND_WORKING_DIRECTORY,
        shell: true,
    });

    backendProcess.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });

    backendProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    backendProcess.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
    });
}
