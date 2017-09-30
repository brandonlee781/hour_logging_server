module.exports = {
  apps: [{
    name: 'hour-logger-server',
    script: './dist/index.js'
  }],
  deploy: {
    production: {
      user: 'ubuntu',
      host: 'ec2-52-15-150-175.us-east-2.compute.amazonaws.com',
      key: '~/.ssh/hour_logger.pem',
      ref: 'origin/master',
      repo: 'git@github.com:brandonlee781/hour_logging_server.git',
      path: '/home/ubuntu/server',
      'post-deploy': 'npm install && pm2 startOrRestart ecosystem.config.js'
    }
  }
}