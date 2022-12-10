export class Sack {
  constructor(public contents: string) {}

  get compartment1(): string {
    return this.contents.slice(0, this.contents.length / 2);
  }

  get compartment2(): string {
    return this.contents.slice(this.contents.length / 2);
  }
}
