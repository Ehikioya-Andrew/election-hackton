export interface EchartModel {
  seriesNameString?: string;
  labels?: string | string[];
  xData?: string[];
  datasets?: Dataset[];
}

interface Dataset {
  data?: number[];
  label?: string;
  backgroundColor?: string[];
  backgroundColorTop?: string[];
  valueFormat?: string;
  borderColor?: string;
}
