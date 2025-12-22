/**
 * PM2 Ecosystem Configuration
 * 
 * Usage:
 *   pm2 start ecosystem.config.js        # Start all apps
 *   pm2 start ecosystem.config.js --only momentum-backend   # Start backend only
 *   pm2 start ecosystem.config.js --only momentum-frontend  # Start frontend only
 *   pm2 stop ecosystem.config.js         # Stop all apps
 *   pm2 restart ecosystem.config.js      # Restart all apps
 *   pm2 delete ecosystem.config.js       # Remove all apps from PM2
 *   pm2 logs                             # View logs
 *   pm2 monit                            # Monitor apps
 */

module.exports = {
  apps: [
    {
      name: 'momentum-backend',
      cwd: './backend',
      script: 'npm',
      args: 'run start:dev',
      interpreter: 'none',
      env: {
        NODE_ENV: 'development',
        PORT: 3001,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3001,
      },
      watch: false,
      ignore_watch: ['node_modules', 'dist', 'logs'],
      max_memory_restart: '500M',
      error_file: './logs/backend-error.log',
      out_file: './logs/backend-out.log',
      log_file: './logs/backend-combined.log',
      time: true,
      autorestart: true,
      max_restarts: 10,
      restart_delay: 1000,
    },
    {
      name: 'momentum-frontend',
      cwd: './frontend',
      script: 'npm',
      args: 'run dev',
      interpreter: 'none',
      env: {
        NODE_ENV: 'development',
        VITE_API_URL: 'http://localhost:3001/api',
      },
      env_production: {
        NODE_ENV: 'production',
      },
      watch: false,
      ignore_watch: ['node_modules', 'dist'],
      max_memory_restart: '300M',
      error_file: './logs/frontend-error.log',
      out_file: './logs/frontend-out.log',
      log_file: './logs/frontend-combined.log',
      time: true,
      autorestart: true,
      max_restarts: 10,
      restart_delay: 1000,
    },
  ],
};

