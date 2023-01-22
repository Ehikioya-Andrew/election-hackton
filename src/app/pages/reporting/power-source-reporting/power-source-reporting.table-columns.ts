import { CurrencyFormatter, NumberFormatter } from "src/app/@core/functions/formatter.funtion";

export const PowerSourceColumns = {
  name: {
    title: 'Name',
    filter: false
  },
  address: {
    title: 'Address',
    filter: false
  },
  totalEnergyDemand: {
    title: 'Energy Demand (kWh)',
    filter: false,
    valuePrepareFunction: (d: number) => {
      return NumberFormatter.format(d || 0) + ' kWh';
    }
  },
  totalEnergySupply: {
    title: 'Energy Supply (kWh)',
    filter: false,
    valuePrepareFunction: (d: number) => {
      return NumberFormatter.format(d || 0) + ' kWh';
    }
  },
  minPowerSupply: {
    title: 'Min. Power Supply (kW)',
    filter: false,
    valuePrepareFunction: (d: number) => {
      return NumberFormatter.format(d || 0) + ' kW';
    }
  },
  averagePowerSupply: {
    title: 'Average Power Supply (kW)',
    filter: false,
    valuePrepareFunction: (d: number) => {
      return NumberFormatter.format(d || 0) + ' kW';
    }
  },

  maxPowerSupply: {
    title: 'Max. Power Supply (kW)',
    filter: false,
    valuePrepareFunction: (d: number) => {
      return NumberFormatter.format(d || 0) + ' kW';
    }
  },
  utilization: {
    title: 'Utilization (%)',
    filter: false,
    valuePrepareFunction: (d: number) => Math.floor(d * 100)
  },

}
export const PowerSourceGenSetColumns = {
  name: {
    title: 'Name',
    filter: false
  },
  address: {
    title: 'Address',
    filter: false
  },
  energySupply: {
    title: 'Energy Supply (kWh)',
    filter: false,
    valuePrepareFunction: (d: number) => {
      return NumberFormatter.format(d || 0) + ' kWh';
    }
  },
  powerSupply: {
    title: 'Power Supply (kW)',
    filter: false,
    valuePrepareFunction: (d: number) => {
      return new Intl.NumberFormat('en').format(d || 0) + ' kW';
    }
  },
  energyCost: {
    title: 'Energy Cost (NGN)',
    filter: false,
    valuePrepareFunction: (d: number) => {
      return CurrencyFormatter.format(d || 0);
    },
  },
  tariff: {
    title: 'Tariff(NGN)',
    filter: false,
    valuePrepareFunction: (d: number) => {
      return CurrencyFormatter.format(d || 0);
    },
  }

}
export const PowerSourceLoadPointColumns = {
  name: {
    title: 'Name',
    filter: false
  },
  address: {
    title: 'Address',
    filter: false
  },
  energyDemand: {
    title: 'Energy Demand (kWh)',
    filter: false,
    valuePrepareFunction: (d: number) => {
      return NumberFormatter.format(d || 0) + ' kWh';
    }
  },
  powerDemand: {
    title: 'Power Demand (KW)',
    filter: false,
    valuePrepareFunction: (d: number) => {
      return NumberFormatter.format(d || 0) + ' kW';
    }
  },
  energyCost: {
    title: 'Energy Cost (NGN)',
    filter: false,
    valuePrepareFunction: (d: number) => {
      return CurrencyFormatter.format(d || 0);
    },
  },
  tariff: {
    title: 'Tariff (NGN)',
    filter: false,
    valuePrepareFunction: (d: number) => {
      return CurrencyFormatter.format(d || 0);
    },
  }

}