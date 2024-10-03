import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitSchema1727939884672 implements MigrationInterface {
  name = 'InitSchema1727939884672';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "appointments" ("id" varchar PRIMARY KEY NOT NULL, "email" varchar NOT NULL, "fullName" varchar NOT NULL, "startTime" datetime NOT NULL, "endTime" datetime NOT NULL, "isCancelled" boolean NOT NULL DEFAULT (0), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "appointments"`);
  }
}
