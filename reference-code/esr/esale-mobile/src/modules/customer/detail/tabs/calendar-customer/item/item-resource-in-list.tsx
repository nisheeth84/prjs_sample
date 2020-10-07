import React from "react";
import { DataOfResource } from "../type";
import { RenderResource } from "./render-resource";

interface IItemResourceInList {
  dataOfResource: DataOfResource;
}

export const ItemResourceInList = (props: IItemResourceInList) => {
  let sFormatStart = props.dataOfResource.isOverDay
    ? "YYYY/MM/DD HH:mm"
    : "HH:mm";
  let sFormatEnd = props.dataOfResource.isOverDay
    ? "YYYY/MM/DD HH:mm"
    : "HH:mm";
  if (props.dataOfResource.isOverDay) {
    sFormatStart = "HH:mm";
  }
  if (props.dataOfResource.isOverDay) {
    sFormatEnd = "HH:mm";
  }

  return (
    <RenderResource
      prefixKey={"_" + "item-Resource-view-more"}
      key={"_" + props.dataOfResource.uniqueId}
      dataOfResource={props.dataOfResource}
      isShowStart={true}
      isShowEnd={true}
      formatStart={sFormatStart}
      formatEnd={sFormatEnd}
    />
  );
};
