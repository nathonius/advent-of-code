export class Elf {
  constructor(public foods: number[]) {}

  get totalCalories(): number {
    return this.foods.reduce((prev, current) => prev + current);
  }
}
