declare module "react-medium-image-zoom" {
  import { ComponentType, ReactNode } from "react";

  export interface ZoomProps {
    children: ReactNode;
    zoomMargin?: number;
    overlayBgColorEnd?: string;
    overlayBgColorStart?: string;
    containerModal?: string;
    zoomZindex?: number;
  }

  const Zoom: ComponentType<ZoomProps>;
  export default Zoom;
}
