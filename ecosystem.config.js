module.exports = {
  apps: [
    {
      name: 'api-server',
      script: './index.js',
      exp_backoff_restart_delay: 100,
      env: {
        NODE_ENV: 'production',
        PORT: '5000',
      },
    },
  ],
}
