import { Injectable, Logger, OnApplicationBootstrap } from "@nestjs/common";

@Injectable()
export class WorkerService implements OnApplicationBootstrap {
  private readonly logger = new Logger(WorkerService.name);

  onApplicationBootstrap() {
    this.logger.log("Worker iniciado; las colas se configurarán en la siguiente fase.");
  }
}
