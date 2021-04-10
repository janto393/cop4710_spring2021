import "./index.css";

import { Grid } from "@material-ui/core";
import ImageUploader from "react-images-upload";
import React from "react";
import { getEventImages } from "../../Utils/formUtils";

export type ImageUploadProps = {
  handleOnChange?: Function;
};

const ImageUpload: React.FC<ImageUploadProps> = (props: ImageUploadProps) => {
  const { handleOnChange = () => null } = props;

  const onChange = (files: File[], pictures: string[]) => {
    handleOnChange("eventPictures", {
      value: getEventImages(files, pictures),
    });
  };

  return (
    <Grid item xs={12} className="image-upload-item">
      <ImageUploader
        className="image-uploader"
        withIcon
        withPreview
        singleImage={false}
        label="Upload Event Image (JPG or PNG)"
        onChange={onChange}
      />
    </Grid>
  );
};

export default ImageUpload;
