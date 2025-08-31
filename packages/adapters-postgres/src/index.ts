import { User, createUser, validateEmail, hello } from "@omnilith/core";

export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
}

export class PostgresAdapter {
  private config: DatabaseConfig;

  constructor(config: DatabaseConfig) {
    this.config = config;
    console.log(hello()); // Using function from core package
  }

  async saveUser(name: string, email: string): Promise<User | null> {
    if (!validateEmail(email)) {
      console.log("Invalid email format");
      return null;
    }

    const user = createUser(name, email);
    console.log(
      `Saving user ${user.name} to Postgres at ${this.config.host}:${this.config.port}`
    );

    // In real implementation, would save to database
    return user;
  }

  async connect(): Promise<string> {
    return `Connected to PostgreSQL database: ${this.config.database}`;
  }
}

export function createPostgresAdapter(config: DatabaseConfig): PostgresAdapter {
  return new PostgresAdapter(config);
}

export function earMeal() {
  return hello();
}

earMeal();
