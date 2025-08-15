import type { Context } from "hono";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { IS_PROD, ROOT_DIR } from "@/constants.ts";

const getDevScripts = () => {
  if (import.meta.env.PROD) {
    return "";
  }

  /**
   * Required since we are not using vite html template for dev server and vite is not able to inject this automatically.
   */
  return `
	  <script type="module" src="/@vite/client"></script>
	  <script type="module">
      import RefreshRuntime from "/@react-refresh"
      RefreshRuntime.injectIntoGlobalHook(window)
      window.$RefreshReg$ = () => {}
      window.$RefreshSig$ = () => (type) => type
      window.__vite_plugin_react_preamble_installed__ = true
	  </script>
	`;
};

const getBundleScript = (
  { meta, basepath }: { basepath?: string; meta: ImportMeta },
) => {
  let script: string;

  if (IS_PROD) {
    /**
     * In prod we need to extract handler dir name.
     * At built time, the name is prepended to the entry-client.js file.
     */
    const fileName = path.basename(meta.url);
    const dirName = path.parse(fileName).name.replace("-entry-server", "");
    script = `${basepath ?? ""}/assets/${dirName}-entry-client.js`;
  } else {
    /**
     * In dev we just need to extract relative path to the handler dir.
     * Entry point should be in the same dir as the entry-server.
     */
    const realativePath = path.dirname(
      path.relative(ROOT_DIR, fileURLToPath(meta.url)),
    );

    script = `/${realativePath}/entry-client.tsx`;
  }

  return `<script type="module" src="${script}"></script>`;
};

export const clientEntryPoint = (
  { meta, basepath, context }: {
    basepath?: string;
    meta: ImportMeta;
    context: Context;
  },
) => {
  const html = `
	<html lang="en">
    <head>
      <meta charSet="utf-8" />
      <meta content="width=device-width, initial-scale=1" name="viewport" />
      <link rel="stylesheet" href="https://cdn.simplecss.org/simple.min.css" />
      ${getDevScripts()}
      <script type="module">
        window.env = {
          BASE_PATH: '${basepath}'
        }
      </script>
    </head>
    <body>
      <div id="root" />
      ${getBundleScript({ basepath, meta })}
    </body>
	</html>
`;

  return context.html(html);
};
