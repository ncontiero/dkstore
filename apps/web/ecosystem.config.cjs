module.exports = {
  apps: [
    {
      name: "worker",
      cwd: "./dist",
      script: "./index.js",
      instances: process.env.WORKER_INSTANCES || 1,
      env_production: {
        NODE_ENV: "production",
      },
      env_development: {
        NODE_ENV: "development",
      },
    },
  ],
};
