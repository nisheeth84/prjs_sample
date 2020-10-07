const isUrl = str => {
  const expression = /[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)?/gi;
  const pattern = new RegExp(expression);
  return !!pattern.test(str);
};

export default isUrl;
