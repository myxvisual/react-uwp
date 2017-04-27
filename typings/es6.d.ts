export interface ObjectConstructor {
  assign(target: any, ...sources: any[]): any;
  observe(beingObserved: any, callback: (update: any) => any) : void;
}
