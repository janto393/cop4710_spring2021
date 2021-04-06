import "./index.css";

import React, { useEffect, useState } from "react";

import { Grid } from "@material-ui/core";
import ImageUploader from "react-images-upload";

export type ImageUploadProps = {
  handleOnChange: Function;
};

const ImageUpload: React.FC<ImageUploadProps> = (props: ImageUploadProps) => {
  const { handleOnChange } = props;

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
