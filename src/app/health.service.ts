import { Injectable, EventEmitter } from "@angular/core";
import { HttpClient } from "@angular/common/http";
const HEALTH_CHECK_INTERVAL = 60000;
const HEALTHY_RESPONSE = "OK";
@Injectable()
export class HealthService {
  healthCheck = new EventEmitter<boolean>();
  constructor(private httpClient: HttpClient) {
    setInterval(() => {
      this.httpClient
        .get("/api/health")
        .subscribe(
          (data: string) => this.healthCheck.emit(data === HEALTHY_RESPONSE),
          () => this.healthCheck.emit(false)
        );
    }, HEALTH_CHECK_INTERVAL);
  }
}
