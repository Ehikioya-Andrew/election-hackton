import { CurrencyFormatter, DateFormatter, NumberFormatter } from "src/app/@core/functions/formatter.funtion";

export const GeneratingUnitColumns = {
  name: {
    title: 'Name',
    filter: false
  },
  address: {
    title: 'Address',
    filter: false
  },
  totalEnergySupply: {
    title: 'Energy Supply (kWh)',
    filter: false,
    valuePrepareFunction: (d: number) => {
      return NumberFormatter.format(d || 0) + ' kWh';
    }
  },
  minPowerDemand: {
    title: 'Min. Power Demand (kW)',
    filter: false,
    valuePrepareFunction: (d: number) => {
      return NumberFormatter.format(d || 0) + ' kW';
    }
  },
  averagePowerDemand: {
    title: 'Average Power Demand (kW)',
    filter: false,
    valuePrepareFunction: (d: number) => {
      return NumberFormatter.format(d || 0) + ' kW';
    }
  },

  maxPowerDemand: {
    title: 'Max. Power Demand (kW)',
    filter: false,
    valuePrepareFunction: (d: number) => {
      return NumberFormatter.format(d || 0) + ' kW';
    }
  },
  totalEnergyCost: {
    title: 'Energy Cost (NGN)',
    filter: false,
    valuePrepareFunction: (d: number) => {
      return CurrencyFormatter.format(d || 0);
    },
  },

}
export const GeneratingUnitColumnsById = {
  name: {
    title: 'Name',
    filter: false
  },
  energy: {
    title: 'Energy (kWh)',
    filter: false,
    valuePrepareFunction: (d: number) => {
      return NumberFormatter.format(d || 0) + ' kWh';
    }
  },
  tariff: {
    title: 'Tariff (NGN)',
    filter: false,
    valuePrepareFunction: (d: number) => {
      return CurrencyFormatter.format(d || 0);
    },
  },
  cost: {
    title: 'Cost (NGN)',
    filter: false,
    valuePrepareFunction: (d: number) => {
      return CurrencyFormatter.format(d || 0);
    },
  },
  powerSource: {
    title: 'Power Source',
    filter: false,
  },

  power: {
    title: 'Power (kW)',
    filter: false,
    valuePrepareFunction: (d: number) => {
      return NumberFormatter.format(d || 0) + ' kW';
    }
  },
  period: {
    title: 'Period',
    filter: false,
    valuePrepareFunction: (date: string) => {
      return DateFormatter.format(new Date(date));
    }
  },
}