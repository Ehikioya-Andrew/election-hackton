import {
  NbJSThemeOptions,
  DEFAULT_THEME as baseTheme,
  NbJSThemeVariable,
} from '@nebular/theme';

const baseThemeVariables = baseTheme.variables as NbJSThemeVariable;

export const DEFAULT_THEME = {
  name: 'default',
  base: 'default',
  variables: {
    chartjs: {
      axisLineColor: baseThemeVariables['separator'],
      textColor: baseThemeVariables['fgText'],
    },
    maps: JSON.stringify([
      {
        featureType: 'administrative',
        elementType: 'geometry',
        stylers: [
          {
            visibility: 'off',
          },
        ],
      },
      {
        featureType: 'poi',
        stylers: [
          {
            visibility: 'off',
          },
        ],
      },
      {
        featureType: 'road',
        elementType: 'labels.icon',
        stylers: [
          {
            visibility: 'off',
          },
        ],
      },
      {
        featureType: 'transit',
        stylers: [
          {
            visibility: 'off',
          },
        ],
      },
    ]),
  },
} as NbJSThemeOptions;
