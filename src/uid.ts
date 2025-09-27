import { customAlphabet, nanoid } from "nanoid";

export class UniqueID {
  protected static _alphabet: string = "abcdefgmrstuwxyz2345689";
  public id: string = "";

  constructor() {
    this.id = customAlphabet(UniqueID._alphabet, 12)();
  }
}