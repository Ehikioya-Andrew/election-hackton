import { CurrencyFormatter, DateFormatter, NumberFormatter } from "src/app/@core/functions/formatter.funtion";

export const LoadPointsReportColumns = {
  name: {
    title: 'Name'
  },
  address: {
    title: 'Address'
  },
  meterNumber:{
    title: 'Meter Number'
  },
  totalEnergyDemand: {
    title: 'Energy Demand (kWh)',
    valuePrepareFunction: (d: number) => {
      return NumberFormatter.format(d || 0) + ' kWh';
    },
  },
  minPowerDemand: {
    title: 'Min. Demand (kW)',
    valuePrepareFunction: (d: number) => {
      return NumberFormatter.format(d || 0) + ' kW';
    },
  },
  averagePowerDemand: {
    title: 'Average Power Demand (kW)',
    valuePrepareFunction: (d: number) => {
      return NumberFormatter.format(d || 0) + ' kW';
    }
  },

  maxPowerDemand: {
    title: 'Max. Demand (kW)',
    valuePrepareFunction: (d: number) => {
      return NumberFormatter.format(d || 0) + ' kW';
    }
  },
  totalEnergyCost: {
    title: 'Energy Cost (NGN)',
    valuePrepareFunction: (d: number) => {
      return CurrencyFormatter.format(d || 0);
    },
  },

}

export const LoadPointByIdReportColumns = {
  name: {
    title: 'Name'
  },
  energy: {
    title: 'Energy(kWh)',
    valuePrepareFunction: (d: number) => {
      return NumberFormatter.format(d || 0) + ' kWh';
    }
  },
  tariff: {
    title: 'Tariff (NGN)',
    valuePrepareFunction: (d: number) => {
      return CurrencyFormatter.format(d || 0);
    },
  },
  cost: {
    title: 'Cost (NGN)',
    valuePrepareFunction: (d: number) => {
      return CurrencyFormatter.format(d || 0);
    },
  },
  powerSource: {
    title: 'Power Source'
  },
  power: {
    title: 'Power (kW)',
    valuePrepareFunction: (d: number) => {
      return NumberFormatter.format(d || 0) + ' kW';
    }
  },
  period: {
    title: 'Period',
    valuePrepareFunction: (date: string) => {
      return DateFormatter.format(new Date(date));
    }
  }
}