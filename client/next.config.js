// next.config.js
module.exports = {
    webpack(config, { isServer }) {
      if (!isServer) {
        config.resolve.fallback = {
          fs: false,
          path: false,
          os: false,
          stream: false,
          util: false,
        };
      }
  
      return config;
    },
  };
  