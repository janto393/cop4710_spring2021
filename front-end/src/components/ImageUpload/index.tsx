import "./index.css";

import React, { useEffect, useState } from "react";

import { Grid } from "@material-ui/core";
import ImageUploader from "react-images-upload";

export type ImageUploadProps = {
  setStudEvent: Function;
};

const ImageUpload: React.FC<ImageUploadProps> = (props: ImageUploadProps) => {
  const { setStudEvent } = props;

  // this is just to see the event base64 populate in an array (can delete)
  // will need to drill setStudEvent from eventsContainer?
  // once you implement that, delete below:

  // --------- delete ----------
  const [eventImages, setEventImages] = useState<Array<string>>([]);

  useEffect(() => {
    console.log(eventImages);
  }, [eventImages]);
  // --------- delete ---------

  const handleOnChange = (files: File[], pictures: string[]) => {
    const base64s = pictures.map((picture) => {
      return picture.split(";")?.[2].substr(7);
    });

    setEventImages(base64s);
  };

  return (
    <Grid item xs={12} className="image-upload-item">
      <ImageUploader
        className="image-uploader"
        withIcon
        withPreview
        singleImage={false}
        label="Upload Event Image (JPG or PNG)"
        onChange={(files: File[], pictures: string[]) =>
          handleOnChange(files, pictures)
        }
      />
    </Grid>
  );
};

export default ImageUpload;
