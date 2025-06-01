declare interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

declare interface ScreenMetadata {
  width: number;
  height: number;
  boundingBoxes: BoundingBox[];
}

declare interface Screen {
  id: string;
  screenUrl: string;
  screenNumber: number;
}

declare interface ScreensResponse {
  success: boolean;
  screens: Screen[];
  total: number;
  message?: string;
}
