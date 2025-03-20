module.exports = {
  apps: [
    {
      name: "queue-dashboard",
      cwd: "./dist",
      script: "./index.js",
      instances: process.env.DASHBOARD_INSTANCES || undefined,
      port: 3002,
      env_production: {
        NODE_ENV: "production",
      },
      env_development: {
        NODE_ENV: "development",
      },
    },
  ],
};
