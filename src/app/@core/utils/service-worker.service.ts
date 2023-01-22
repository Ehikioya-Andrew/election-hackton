import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { BehaviorSubject, interval, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServiceWorkerService {

  updateRequired = new Subject<boolean>();
  errorOccured = new Subject<boolean>();
  readyForInstall = new BehaviorSubject<boolean>(false);

  deferredPrompt: any;

  constructor(
    private updates: SwUpdate,
  ) {
    if (environment.production) {
      this.pollForUpdates();
      this.forceApplicationUpdate();
      this.handleUnrecoverableState();
    }
  }

  pollForUpdates(): void {
    const pollFrequency$ = interval(5 * 60 * 1000);

    pollFrequency$.subscribe(() => {
      this.updates.checkForUpdate();
    });
  }

  forceApplicationUpdate(): void {
    this.updates.available.subscribe(() => {
      this.updateRequired.next(true);
      setTimeout(() => {
        this.updates.activateUpdate().then(() => document.location.reload());
      }, 5000);
    });
  }

  handleUnrecoverableState(): void {
    this.updates.unrecoverable.subscribe(() => {
      this.errorOccured.next(true);
      setTimeout(() => {
        this.updates.activateUpdate().then(() => document.location.reload());
      }, 5000);
    });
  }

  initInstallPrompt(e: any) {
    this.deferredPrompt = e;
    this.readyForInstall.next(true);
  }

  async installPwa() {
    this.deferredPrompt.prompt();
    const { outcome } = await this.deferredPrompt.userChoice;
    if ('accepted' === outcome) {
      this.deferredPrompt = null;
      this.readyForInstall.next(false);
    }
  }
}
