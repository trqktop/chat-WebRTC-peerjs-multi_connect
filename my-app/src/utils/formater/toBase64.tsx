const toBase64 = (file: File) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  return new Promise((res) => {
    reader.onloadend = function () {
      const url = reader.result;
      res(url);
    };
  });
};

export default toBase64;
