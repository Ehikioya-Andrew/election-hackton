import { ExecutiveSummaryLoadpointExpandButtonComponent } from './executive-summary-loadpoint-expand-button/executive-summary-loadpoint-expand-button.component';
import { GeneratingSetExecutiveSummaryDto } from './../../@core/dtos/generating-set-executive-summary.dto';
import { LoadPointExecutiveSummaryDto } from './../../@core/dtos/load-point-executive-summary.dto';
import { PowerStationExecutiveSummaryDto } from './../../@core/dtos/power-station-executive-summary.dto';
import { forkJoin, lastValueFrom, timer } from 'rxjs';
import { filter, map, takeWhile } from 'rxjs/operators';
import { ExecutiveSummaryIntervalEnum } from './../../@core/enums/executive-summary.enum';
import { ExecutiveSummaryService } from './../../@core/data-services/executive-summary.service';
import { ExecutiveSummaryConfigComponent } from './executive-summary-config/executive-summary-config.component';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  NbDateService,
  NbDialogRef,
  NbDialogService,
  NbThemeService,
} from '@nebular/theme';
import { take } from 'rxjs/operators';
import mermaid from 'mermaid';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NumberFormatter } from 'src/app/@core/functions/formatter.funtion';
import { LocalStorageKey } from 'src/app/@core/enums/local-storage-key.enum';
import { SecureLocalStorageService } from 'src/app/@core/utils/secure-local-storage.service';
import { ExecutiveSummaryGenSetExpandButtonComponent } from './executive-summary-gen-set-expand-button/executive-summary-gen-set-expand-button.component';
import { ExecutiveSummaryDialogComponent } from './executive-summary-dialog/executive-summary-dialog.component';
import { TitleCasePipe } from '@angular/common';
import { AnimationOptions } from 'ngx-lottie';
import { ActivatedRoute, NavigationEnd, Params, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import {
  trigger,
  transition,
  animate,
  keyframes,
  style,
  state,
} from '@angular/animations';
import { SeoService } from 'src/app/@core/utils';

interface PowerStationWIthAnimateAction
  extends PowerStationExecutiveSummaryDto {
  animateCard?: string;
  backgroundColor?: string;
}
@Component({
  selector: 'app-executive-summary',
  templateUrl: './executive-summary.component.html',
  styleUrls: ['./executive-summary.component.scss'],
  animations: [
    trigger('fade', [
      transition(
        'animateCard => notAnimateCard',
        animate(
          '500ms ease-out',
          keyframes([
            style({ opacity: 0.1, offset: 0.1 }),
            style({ opacity: 0.6, offset: 0.2 }),
            style({ opacity: 1, offset: 0.5 }),
            style({ opacity: 0.8, offset: 1 }),
          ])
        )
      ),

      transition(
        'notAnimateCard => animateCard',
        animate(
          '500ms ease-in',
          keyframes([
            style({ opacity: 0.1, offset: 0.1 }),
            style({ opacity: 0.6, offset: 0.2 }),
            style({ opacity: 1, offset: 0.5 }),
            style({ opacity: 0.8, offset: 1 }),
          ])
        )
      ),
    ]),

    trigger('backGroundAnimation', [
      state(
        'newBackground',
        style({
          background: '#3366ff',
        })
      ),
      state(
        'originalBackground',
        style({
          background: 'rgba(80, 124, 222, 0.3)',
        })
      ),
    ]),
  ],
})
export class ExecutiveSummaryComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  powerSourceData: PowerStationExecutiveSummaryDto[] = [];
  loadpointData!: LoadPointExecutiveSummaryDto[];
  genSetData!: GeneratingSetExecutiveSummaryDto[];
  selectedPowerSourceId!: string;

  genSetTableData: GeneratingSetExecutiveSummaryDto[] = [];
  loadpointTableData: LoadPointExecutiveSummaryDto[] = [];

  @ViewChild('getSetModalTpl') public genSetTableModal!: TemplateRef<null>;
  @ViewChild('loadpointModalTpl')
  public loadPointTableModal!: TemplateRef<null>;

  private dialogRef!: NbDialogRef<ExecutiveSummaryDialogComponent>;

  startDate!: string;
  endDate!: string;
  interval = ExecutiveSummaryIntervalEnum.DAILY;
  totalConsumption!: number;
  totalConsumedCost!: number;
  totalGenerated!: number;
  totalGeneratedCost!: number;

  selectedTheme!: string;
  renderedText!: SafeHtml;

  selectedStartDate: string | undefined;
  selectedEndDate: string | undefined;

  newPowerStationWIthAnimateAction: PowerStationWIthAnimateAction[] = [];
  powerSourceGenSetData: GeneratingSetExecutiveSummaryDto[] = [];
  powerSourceLoadPointData: LoadPointExecutiveSummaryDto[] = [];
  selectedPowerSource!: PowerStationWIthAnimateAction;

  isGensetLoadpointView: boolean = false;
  isSelectedPowerSource: boolean = false;
  isThirdView: boolean = false;

  private _renderText = '';
  isLive = true;
  get monthStart(): Date {
    return this.dateService.getMonthStart(new Date());
  }
  get currentDate(): Date {
    return this.dateService.today();
  }

  isloading = true;

  public get renderText(): string {
    return this._renderText;
  }
  public set renderText(v: string) {
    this._renderText = v;
    this.setFlowChartContent();
  }

  queryParams: Params = {}

  options: AnimationOptions = {
    path: '/assets/animations/36499-page-not-found.json',
  };

  constructor(
    private dialogService: NbDialogService,
    private executiveSummaryService: ExecutiveSummaryService,
    private theme: NbThemeService,
    private seo: SeoService,
    private router: Router,
    private route: ActivatedRoute,
    private storageService: SecureLocalStorageService,
    protected dateService: NbDateService<Date>,
    private domSanitizer: DomSanitizer,
    private renderer: Renderer2
  ) {
    this.getThemeData();
    this.router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        takeWhile(() => this.isLive)
      )
      .subscribe((e) => {
        this.startDate =
          this.route.snapshot.queryParams.startDate ?? this.monthStart;
        this.endDate =
          this.route.snapshot.queryParams.endDate ?? this.currentDate;
      });
  }

  getThemeData(): void {
    this.theme
      .getJsTheme()
      .pipe(takeWhile(() => this.isLive))
      .subscribe({
        next: (config) => {
          this.selectedTheme = config.name;
          this.extractChartData();
        },
      });
  }

  ngOnInit(): void {
    this.seo.setSeoData('Executive Summary', 'Executive Summary Dashboard');
    mermaid.initialize({
      securityLevel: 'loose' as any,
      theme: 'base' as any,
      startOnLoad: false,

      darkMode: true,
      flowchart: { useMaxWidth: true },
    });
    const data = {
      interval: this.interval,
      startDate: this.dateService.getMonthStart(new Date()).toUTCString(),
      endDate: this.dateService.today().toUTCString(),
    };

    this.requestData(data);

    this.queryParams = {
      startDate: data.startDate,
      endDate: data.endDate,
    };
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: this.queryParams,
    });

  }

  animStateClick(powerSource: PowerStationWIthAnimateAction) {
    this.selectedPowerSource = powerSource;
    this.isGensetLoadpointView = true;

    this.powerSourceGenSetData = this.genSetData.filter(
      (g) => g?.powerSourceId === powerSource?.id
    );
    this.powerSourceLoadPointData = this.loadpointData.filter(
      (g) => g?.powerSourceId === powerSource?.id
    );

    powerSource.animateCard == 'animateCard' ? 'notAnimateCard' : 'animateCard';
    powerSource.backgroundColor = 'newBackground';
    this.updateBackground(powerSource.id);

    //Show selected power source on the top
    const powerSourceData = this.newPowerStationWIthAnimateAction;
    powerSourceData.sort(function (x, y) {
      return x.id === powerSource.id ? -1 : y.id === powerSource.id ? 1 : 0;
    });
  }

  showPowersourceLoadPoint(powerSource: PowerStationWIthAnimateAction) {
    this.selectedPowerSource = powerSource;
    this.selectedPowerSourceId = powerSource.id;
    this.powerSourceGenSetData = this.genSetData.filter(
      (g) => g?.powerSourceId === powerSource?.id
    );
    this.powerSourceLoadPointData = this.loadpointData.filter(
      (g) => g?.powerSourceId === powerSource?.id
    );
    powerSource.backgroundColor = 'newBackground';
    this.updateBackground(powerSource.id);
  }

  updateBackground(id: string) {
    const powerSourceData = this.newPowerStationWIthAnimateAction;
    for (const i in powerSourceData) {
      if (powerSourceData[i].id != id) {
        powerSourceData[i].backgroundColor = 'originalBackground';
      }
    }
  }

  goToMainView() {
    this.isGensetLoadpointView = false;
  }

  viewGenSetTable(powerSource: PowerStationWIthAnimateAction): void {
    const genSetTableData = this.genSetData.filter(
      (g) => g?.powerSourceId === powerSource.id
    );
    this.dialogRef = this.dialogService.open(ExecutiveSummaryDialogComponent, {
      closeOnBackdropClick: true,
      hasBackdrop: true,
      hasScroll: true,
      closeOnEsc: true,
      context: {
        genSetTableData,
        isloadPoint: false,
        powerSourceName: new TitleCasePipe().transform(powerSource.name),
      },
    });
  }
  viewLoadPointTable(powerSource: PowerStationWIthAnimateAction): void {
    const loadPointTableData = this.loadpointData.filter(
      (lp) => lp?.powerSourceId === powerSource.id
    );
    this.dialogRef = this.dialogService.open(ExecutiveSummaryDialogComponent, {
      closeOnBackdropClick: true,
      hasBackdrop: true,
      hasScroll: true,
      closeOnEsc: true,
      context: {
        loadPointTableData,
        isloadPoint: true,
        powerSourceName: new TitleCasePipe().transform(powerSource.name),
      },
    });
  }

  ngOnDestroy(): void {
    this.isLive = false;
  }

  async configureForm() {
    const config = await lastValueFrom(
      this.dialogService.open(ExecutiveSummaryConfigComponent, {
        closeOnBackdropClick: true,
        context: {
          selectedStartDate: this.selectedStartDate,
          selectedEndDate: this.selectedEndDate,
        },
        hasScroll: true,
        closeOnEsc: true,
      }).onClose
    );
    if (config) {
      this.selectedStartDate = config.startDate;
      this.selectedEndDate = config.endDate;
      const { startDate, endDate } = config;
      const dateDifferenceInMs =
        new Date(endDate).getTime() - new Date(startDate).getTime();
      const totalHours = dateDifferenceInMs / (1000 * 60 * 60);
      if (totalHours < 24) {
        this.interval = ExecutiveSummaryIntervalEnum.HOURLY;
      }
      if (totalHours >= 24 && totalHours < 720) {
        this.interval = ExecutiveSummaryIntervalEnum.DAILY;
      } else if (totalHours >= 720) {
        this.interval = ExecutiveSummaryIntervalEnum.MONTHLY;
      }
      const data = {
        interval: this.interval,
        startDate: new Date(startDate).toUTCString(),
        endDate: new Date(endDate).toUTCString(),
      };
      this.requestData(data);

    this.queryParams = {
      startDate: data.startDate,
      endDate: data.endDate,
    };
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: this.queryParams,
    });
    }
  }

  requestData(data: { interval: number; startDate: string; endDate: string }) {
    let powerSource =
      this.executiveSummaryService.getPowerStationsSummary(data);
    let loadpoint = this.executiveSummaryService.getLoadPointsSummary(data);
    let genSet = this.executiveSummaryService.getGeneratingSetsSummary(data);

    forkJoin([powerSource, loadpoint, genSet]).subscribe(
      ([powerSourceRes, loadpointRes, genSetRes]) => {
        this.loadpointData =
          loadpointRes?.data as LoadPointExecutiveSummaryDto[];
        this.powerSourceData =
          powerSourceRes?.data as PowerStationExecutiveSummaryDto[];
        this.genSetData = genSetRes?.data as GeneratingSetExecutiveSummaryDto[];

        this.newPowerStationWIthAnimateAction = (
          powerSourceRes?.data as PowerStationWIthAnimateAction[]
        )?.map((d) => {
          d.animateCard = 'animateCard';
          d.backgroundColor = 'originalBackground';
          return d;
        }) as PowerStationWIthAnimateAction[];
        this.extractChartData();
      }
    );
  }

  ngAfterViewInit(): void {
    timer(0, environment.refreshInterval)
      .pipe(takeWhile(() => this.isLive))
      .subscribe((x) => {
        this.setFlowChartContent();
      });
  }

  private setFlowChartContent(): void {
    if (!this.renderText?.length) {
      return;
    }
    mermaid.render('flowChart', this.renderText, (v: string) => {
      setTimeout(() => {
        this.renderedText = this.domSanitizer.bypassSecurityTrustHtml(v);
        setTimeout(() => {
          const classNames: string[] = [];
          this.powerSourceData?.forEach((p) => {
            const psClassName = this.classParser(p.name);
            classNames.push(
              psClassName,
              `${psClassName}_GS`,
              `${psClassName}_LP`
            );
          });
          for (const className of classNames) {
            const els = Array.from(document.getElementsByClassName(className));
            if (!els.length) {
              continue;
            }
            els.forEach((el) => {
              el.setAttribute('role', 'button');
              if (className.endsWith('_LP')) {
                this.renderer.listen(el, 'click', () => {
                  this.handleLPClick(className);
                });
              } else if (className.endsWith('_GS')) {
                this.renderer.listen(el, 'click', () => {
                  this.handleGSClick(className);
                });
              } else {
                this.renderer.listen(el, 'click', () => {
                  this.handlePSClick(className);
                });
              }
            });
          }
        });
      });
      this.isloading = false;
    });
  }

  private extractChartData(): void {
    if (!this.powerSourceData?.length) {
      this.isloading = true;
      return;
    }
    this.isloading = false;

    let totalPowerSourceConsumed = this.powerSourceData.map(
      (powerSource) => powerSource.consumed
    );

    let totalPowerSourceConsumedCost = this.powerSourceData.map(
      (powerSource) => powerSource.consumedCost
    );

    let totalPowerSourceGeneratedCost = this.powerSourceData.map(
      (powerSource) => powerSource.generatedCost
    );

    this.totalConsumption = totalPowerSourceConsumed.reduce(
      (a: number, b: number) => a + b
    );

    this.totalConsumedCost = totalPowerSourceConsumedCost.reduce(
      (a: number, b: number) => a + b
    );

    this.totalGeneratedCost = totalPowerSourceGeneratedCost.reduce(
      (a: number, b: number) => a + b
    );

    let totalPowerSourceGenerated = this.powerSourceData.map(
      (powerSource) => powerSource.generated
    );

    this.totalGenerated = totalPowerSourceGenerated.reduce(
      (a: number, b: number) => a + b
    );

    const chartText = this.powerSourceData
      .map((powerSource) => {
        let genSets = this.genSetData
          ?.sort((a, b) => b?.consumption - a?.consumption)
          ?.filter((g) => g?.powerSourceId === powerSource?.id)
          ?.slice(0, 5);

        let loadPoints = this.loadpointData
          ?.sort((a, b) => b?.consumption - a?.consumption)
          ?.filter((p) => p?.powerSourceId === powerSource?.id)
          ?.slice(0, 5);

        let gensetText = '';

        gensetText = `
          ${genSets
            ?.map(
              (g) =>
                `style ${
                  g.id
                } fill:#c3f98f,stroke:##c3f98f,stroke-width:1px,text-align:left \n class ${
                  g.id
                } ${this.classParser(powerSource.name)}_GS`
            )
            .join('\n')}

          subgraph ${powerSource?.id}_GS
            ${genSets
              ?.map((g) => `${this.defaultChartBox(g, false)}`)
              .join('\n')}
          end

        `;

        const loadpointText = `
      ${loadPoints
        ?.map(
          (lp) =>
            `style ${
              lp.id
            } style H fill:#FEEBD9,stroke:#FEEBD9,stroke-width:1px,text-align:left \n class ${
              lp.id
            } ${this.classParser(powerSource.name)}_LP`
        )
        .join('\n')}

        subgraph ${powerSource.id}_LP
        ${loadPoints
          ?.map((lp) => `${this.defaultChartBox(lp, true)}`)
          .join('\n')}
      end

      `;

        const powerSourceWithExpansionText = `
      ${this.powerStationBox(powerSource)}---->${powerSource.id}_GS---->${
          powerSource.id
        }_LP
      style ${
        powerSource.id
      } fill:#D6E4FF,stroke:#D6E4FF,stroke-width:1px,text-align:left

      style ${
        powerSource.id
      }_GS fill:#ffffff00,stroke:#000,stroke-width:1px,color:#ffffff00

      style ${
        powerSource.id
      }_LP fill:#ffffff00,stroke:#000,stroke-width:1px,color:#ffffff00

      class ${powerSource.id} ${this.classParser(powerSource.name)}
      class ${powerSource.id}_LP ${this.classParser(powerSource.name)}_LP
      class ${powerSource.id}_GS ${this.classParser(powerSource.name)}_GS

      ${gensetText}


      ${loadpointText}
      `;

        const powerSourceWithoutExpansionText = `
        ${this.powerStationBox(powerSource)}

      style ${
        powerSource.id
      } fill:#D6E4FF,stroke:#D6E4FF,stroke-width:1px,text-align:left,font-weight: bold

      class ${powerSource.id} ${this.classParser(powerSource.name)}
      class ${powerSource.id}_LP ${this.classParser(powerSource.name)}_LP
      class ${powerSource.id}_GS ${this.classParser(powerSource.name)}_GS
      `;

        return this.selectedPowerSourceId === powerSource.id
          ? powerSourceWithExpansionText
          : powerSourceWithoutExpansionText;
      })
      .join('\n');

    this.renderText = `
    flowchart TD

    ${chartText}
    `;
  }

  private defaultChartBox(
    lp: LoadPointExecutiveSummaryDto | GeneratingSetExecutiveSummaryDto,
    isloadPoint = false
  ): string {
    return `${lp.id}( ${this.graphHeader(
      isloadPoint ? 'Load Point Site' : 'Generating Unit',
      lp.name,
      true
    )} ${this.graphColumn(
      isloadPoint ? 'Consumed' : 'Generated',
      NumberFormatter.format(lp.consumption || 0),
      true
    )})`;
  }

  private powerStationBox(
    powerSource: PowerStationExecutiveSummaryDto
  ): string {
    return `${powerSource.id}( ${this.graphHeader(
      'Power Station',
      powerSource.name
    )} ${this.graphColumn(
      'Generated',
      NumberFormatter.format(powerSource.generated || 0)
    )} <br> ${this.graphColumn(
      'Consumed',
      NumberFormatter.format(powerSource.consumed || 0)
    )})`;
  }

  private graphColumn(
    headerText: string,
    data: string,
    smaller = false
  ): string {
    return `<div class='container row align-items-center'>  <div class='col-6 text-dark'>${headerText}: </div> <div class='col-6 text-right'> <span class='ml-2 text-right ${
      smaller ? 'h4' : 'h6'
    }'>${data} </span>kWh </div> </div> `;
  }

  private graphHeader(title: string, data: string, smaller = false): string {
    return `<div class='my-1 col-12 text-dark ${
      smaller ? 'h5' : 'h2'
    }'>${this.nameParser(
      this.titleCaseWord(data)
    )} <span class='mb-0 caption text-center'>- ${title}</span> </div> <hr> `;
  }

  private handlePSClick(name: string): void {
    this.selectedPowerSourceId = this.powerSourceData.find(
      (d) => this.classParser(d.name) === name
    )?.id as string;
    this.extractChartData();
  }

  private handleGSClick(name: string): void {
    const PowerSourceName = name.replace(/_GS/g, '');
    const genSetTableData = this.genSetData.filter(
      (g) => this.classParser(g?.powerSource) === PowerSourceName
    );
    this.dialogRef = this.dialogService.open(ExecutiveSummaryDialogComponent, {
      closeOnBackdropClick: true,
      hasBackdrop: true,
      hasScroll: true,
      closeOnEsc: true,
      context: {
        genSetTableData,
        isloadPoint: false,
        powerSourceName: new TitleCasePipe().transform(
          this.powerSourceData.find(
            (p) => p.id === genSetTableData[0].powerSourceId
          )?.name ?? ''
        ),
      },
    });
  }

  private handleLPClick(name: string): void {
    const PowerSourceName = name.replace(/_LP/g, '');
    const loadPointTableData = this.loadpointData.filter(
      (lp) => this.classParser(lp?.powerSource) === PowerSourceName
    );
    this.dialogRef = this.dialogService.open(ExecutiveSummaryDialogComponent, {
      closeOnBackdropClick: true,
      hasBackdrop: true,
      hasScroll: true,
      closeOnEsc: true,
      context: {
        loadPointTableData,
        isloadPoint: true,
        powerSourceName: new TitleCasePipe().transform(
          this.powerSourceData.find(
            (p) => p.id === loadPointTableData[0].powerSourceId
          )?.name ?? ''
        ),
      },
    });
  }

  private nameParser(name: string): string {
    return name.replace(/[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g, '');
  }

  private classParser(name: string): string {
    return name.replace(/[ !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g, '');
  }

  private titleCaseWord(word: string) {
    if (!word) return word;
    return new TitleCasePipe()
      .transform(word)
      .replace('Ipp', 'IPP')
      .replace('Ie', 'IE');
  }

  public close(): void {
    this.dialogRef.close();
  }
}
