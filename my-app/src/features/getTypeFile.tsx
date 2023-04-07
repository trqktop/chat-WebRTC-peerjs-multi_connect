type TSize = {
  width: string | number;
  height: string | number;
};

const getTypeFile = (type: string, src: string, size: TSize) => {
  const searchType = type.split("/")[0];
  switch (searchType) {
    case "image":
      return (
        <div
          style={{
            maxWidth: size.width,
            maxHeight: size.height,
          }}
        >
          <img alt={type} src={src} className="message__image" />
        </div>
      );
    case "audio":
      return <audio controls src={src} />;
    case "video":
      return (
        <video width={size.width} height={size.height} controls>
          <source src={src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      );
  }
  return null;
};
export default getTypeFile;
