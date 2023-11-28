import { RendererController } from './RendererController';

document.title = 'Scanning Bee'; // Setting the main window title (replacing Webpack App)

const root = document.createElement('div');

// Append root div to body
root.id = 'root';
document.body.appendChild(root);
document.body.setAttribute('oncontextmenu', 'return false;');
document.body.setAttribute('overflow', 'hidden');
document.body.setAttribute('height', '100%');

const rendererController = new RendererController();
(window as any).RendererController = rendererController;
