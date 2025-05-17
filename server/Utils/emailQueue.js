const Queue = require('bull');

const emailQueue = new Queue('emailQueue', {
  redis: {
    host: '127.0.0.1',
    port: 6379, // default Redis port
  },
});

module.exports = emailQueue;