import { Subject } from 'rxjs';

export class InteractionCreateService {
  private readonly slashCommand: Subject<any>;

  private readonly selectMenu: Subject<any>;

  private readonly buttonCommand: Subject<any>;

  private readonly autoComplete: Subject<any>;

  constructor() {
    this.slashCommand = new Subject();
    this.selectMenu = new Subject();
    this.buttonCommand = new Subject();
    this.autoComplete = new Subject();
  }

  // data in

  emitInteractionSlashCommand(interaction: any) {
    this.slashCommand.next(interaction);
  }

  emitInteractionSelectMenu(interaction: any) {
    this.selectMenu.next(interaction);
  }

  emitInteractionButton(interaction: any) {
    this.buttonCommand.next(interaction);
  }

  emitInteractionAutoComplete(interaction: any) {
    this.autoComplete.next(interaction);
  }

  // data out

  getInteractionAutoComplete() {
    return this.autoComplete;
  }

  getInteractionButtonCommand() {
    return this.buttonCommand;
  }

  getInteractionSelectMenu() {
    return this.selectMenu;
  }

  getInteractionSlashCommand() {
    return this.slashCommand;
  }
}

export const interactionCreateStream = new InteractionCreateService();
