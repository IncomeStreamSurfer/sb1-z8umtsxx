export { renderers } from '../../../renderers.mjs';
export { onRequest } from '../../../_empty-middleware.mjs';
import '../../../chunks/astro.99384f8d.mjs';
import 'html-escaper';
import 'react';
import 'react-dom/server';

const page = () => import('../../../chunks/pages/_business_.astro.1107f622.mjs').then(n => n.b);

export { page };
