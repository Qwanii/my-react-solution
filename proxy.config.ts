export default function proxyConfig(env: Env) {
  return {
    [env.API_PATH]: {
      target: env.API_URL,
      secure: false,
      changeOrigin: true,
      timeout: 2000,
      // '^/uploads': {
      //   target: 'http://query.rest',
      //   secure: true,
      //   changeOrigin: true,
      //   timeout: 2000,
  
      // },
    },
  };
}
