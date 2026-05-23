module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // react-native-worklets/plugin debe ir SIEMPRE el último.
    // Lo requiere react-native-reanimated v4 para compilar
    // las funciones marcadas como worklets.
    plugins: ['react-native-worklets/plugin'],
  };
};
