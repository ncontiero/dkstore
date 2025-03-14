module.exports = {
  apps: [
    {
      name: "worker",
      script: "./src/worker/index.ts",
      ignore_watch: ["node_modules", ".next"],
      env_production: {
        NODE_ENV: "production",
      },
      env_development: {
        NODE_ENV: "development",
      },
    },
  ],
};
