const toBase64 = async (file: File): Promise<string | null | ArrayBuffer> => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  return await new Promise((res) => {
    reader.onloadend = function () {
      const url = reader.result;
      res(url);
    };
  });
};

export default toBase64;
