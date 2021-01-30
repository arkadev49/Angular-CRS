export class User {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    private TOKEN: string,
    public role: 'ADMIN' | 'CITIZEN' | 'POLICE',
    public image: string
  ) {}

  get token(): string {
    return this.TOKEN
  }
}
