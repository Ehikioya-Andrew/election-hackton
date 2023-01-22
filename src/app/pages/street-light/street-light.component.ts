import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { DEFAULT_THEME, NbDialogService } from '@nebular/theme';
import { AnimationItem } from 'lottie-web';
import { isMobile } from 'mobile-device-detect';
import { AnimationOptions } from 'ngx-lottie';
import { timer } from 'rxjs';
import { map, takeWhile } from 'rxjs/operators';
import { StreetLightService } from 'src/app/@core/data-services/street-light.service';
import { Street, Weather } from 'src/app/@core/dtos/street-light-dashboard.dto';
import { GetUniqueArray } from 'src/app/@core/functions/data-request.funtion';
import { MapMarkerModel } from 'src/app/@core/models/map-marker.model';
import { SeoService } from 'src/app/@core/utils/seo.service';
import { environment } from 'src/environments/environment';
import { StreetLightMarkerInfoComponent } from './street-light-marker-info/street-light-marker-info';

@Component({
  selector: 'app-street-light',
  templateUrl: './street-light.component.html',
  styleUrls: ['./street-light.component.scss'],
})
export class StreetLightComponent implements OnInit, AfterViewInit, OnDestroy {
  isLive = true;
  selectedMarkerIndex!: number;

  isMobile = isMobile;

  selectedStreet!: Street;

  streetLightWeatherInfo!: Weather | undefined;

  isLoading = false;

  searchForm!: UntypedFormGroup;

  weatherAnimation: AnimationOptions = this.getWeatherAnimation();

  markers: MapMarkerModel<Street>[] = [];

  filteredMarkers: MapMarkerModel<Street>[] = [];
  isSearch = false;

  private readonly colors = [
    DEFAULT_THEME?.variables?.primaryLight,
    DEFAULT_THEME?.variables?.success,
    '#FFD014',
    '#D966FF',
    '#FF4F9B',
  ];

  public get canSelectOption() {
    return !this.markers?.length;
  }

  constructor(
    private seo: SeoService,
    private streetLightService: StreetLightService,
    private dialogService: NbDialogService,
    private formBuilder: UntypedFormBuilder
  ) {}

  animationCreated(animationItem: AnimationItem): void {
    animationItem.setSpeed(1.5);
  }

  ngOnInit(): void {
    this.initForm();
    this.seo.setSeoData('Streets Light', 'Manage street light');
  }
  getWeatherAnimation(): AnimationOptions {
    const rain = {
      path: '/assets/animations/day-rain.json',
    };
    const nightrain = {
      path: '/assets/animations/weather-night-rain-dark.json',
    };
    const nightcloud = {
      path: '/assets/animations/night-clouds.json',
    };
    const cloud = {
      path: '/assets/animations/cloudy.json',
    };
    const loading = {
      path: '/assets/animations/9844-loading-40-paperplane.json',
    };
    const sunny = {
      path: '/assets/animations/sunny.json',
    };
    const nightthunder = {
      path: '/assets/animations/thunder-icon.json',
    };
    const thunderstorm = {
      path: '/assets/animations/weather-thunder.json',
    };
    const weather = this.streetLightWeatherInfo?.weather_type;
    const now = new Date();
    const nowHour = now.getHours();
    let periodOfDay = 'Night';

    if (nowHour < 18) {
      periodOfDay = 'Day';
    }
    if (!weather) {
      return loading;
    } else if (weather.toLowerCase().includes('rain')) {
      if (periodOfDay === 'Day') {
        return rain;
      } else {
        return nightrain;
      }
    } else if (weather.toLocaleLowerCase().includes('cloud')) {
      if (periodOfDay === 'Day') {
        return cloud;
      } else {
        return nightcloud;
      }
    } else if (weather.toLocaleLowerCase().includes('thunderstorm')) {
      if (periodOfDay === 'Day') {
        return thunderstorm;
      } else {
        return nightthunder;
      }
    } else {
      if (periodOfDay === 'Day') {
        return sunny;
      } else {
        return nightcloud;
      }
    }
  }

  ngAfterViewInit(): void {
    if (!this.isSearch) {
      timer(0, environment.refreshInterval)
        .pipe(takeWhile(() => this.isLive))
        .subscribe((x) => {
          this.callService()?.subscribe();
        });
    }
  }

  initForm(): void {
    this.searchForm = this.formBuilder.group({
      location: '',
    });

    this.searchForm
      .get('location')
      ?.valueChanges.pipe(takeWhile(() => this.isLive))
      .subscribe((data) => {
        this.isSearch = true;
        this.getFilteredMarkers(data);
      });
  }

  clearLocationSelection() {
    this.searchForm.get('location')?.setValue('');
  }

  getFilteredMarkers(value?: string) {
    value = value?.toLowerCase();
    this.filteredMarkers = this.markers.filter((m) => {
      if (value) {
        return (
          m?.info?.street_id.toString().toLowerCase().includes(value) ||
          m?.info?.name.toLowerCase().includes(value)
        );
      }
      return true;
    });
  }

  private callService() {
    this.isLoading = true;
    return this.streetLightService.getStreetLightDashboard().pipe(
      map((d) => {
        const response = this.getMarkerFromPayload(d.data?.streets ?? []);
        this.streetLightWeatherInfo = d.data?.weather as Weather;
        this.markers = GetUniqueArray(response, this.markers);
        this.isLoading = false;
        this.weatherAnimation = this.getWeatherAnimation();
        this.getFilteredMarkers();
        return response;
      })
    );
  }

  getMarkerFromPayload(data: Street[]): MapMarkerModel<Street>[] {
    let response: MapMarkerModel<Street>[] = [];
    response = data.map(
      (d, i) =>
        ({
          title: d.name,
          labelText: { text: `Str-${i}`, color: 'black' },
          position: { lat: d.latitude, lng: d.longitude },
          iconColor: this.colors[i % this.colors.length],
          info: d,
          id: d.street_id,
        } as MapMarkerModel<Street>)
    );
    return [...response];
  }

  onSelectedMarkerChange(index: number): void {
    this.selectedMarkerIndex = index;
    this.dialogService.open(StreetLightMarkerInfoComponent, {
      closeOnBackdropClick: false,
      context: {
        streetMarkerInfo: this.filteredMarkers[index]?.info as Street,
      },
      hasScroll: true,
      closeOnEsc: true,
    });
  }

  ngOnDestroy() {
    this.isLive = false;
    this.isSearch = true;
  }
}
