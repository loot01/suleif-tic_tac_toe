// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    public: "/",
    src: "/_dist_",
  },
  plugins: [
    [
      "@snowpack/plugin-run-script",
      {
        cmd: "postcss src/index.css -o public/styles.css",
        watch: "postcss src/index.css -o public/styles.css -w",
      },
    ],
    [
      "@snowpack/plugin-typescript",
      {
        tsc: "tsc",
        args: "./src/app.ts",
      },
    ],
  ],
  packageOptions: {
    /* ... */
  },
  devOptions: {
    /* ... */
  },
  buildOptions: {
    /* ... */
  },
};
