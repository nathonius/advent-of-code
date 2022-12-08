import { join } from "path";

export class Directory {
  parent: Directory | null = null;
  children: Record<string, Directory | number> = {};

  constructor(public readonly path: string) {}

  get fullPath(): string {
    if (this.parent) {
      return join(this.parent.fullPath, this.path);
    } else {
      return this.path;
    }
  }

  getSize(): number {
    let total = 0;
    Object.values(this.children).forEach((c) => {
      if (typeof c === "number") {
        total += c;
      } else {
        total += c.getSize();
      }
    });
    return total;
  }
}
