export const genResponse = (data = {}, code = 0, msg = 'success') => ({
  data,
  code,
  msg,
});
