import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1774211922567 implements MigrationInterface {
    name = 'InitialSchema1774211922567'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "cultures_planted" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, CONSTRAINT "UQ_bc11cb843fe9337cc5442b8c281" UNIQUE ("name"), CONSTRAINT "PK_531e6394baea1f4483e54789a01" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "producers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "cpf_cnpj" character varying NOT NULL, "name" character varying NOT NULL, "deleted_at" TIMESTAMP, CONSTRAINT "UQ_69c9e8a2abe4f39ee6d64d8977e" UNIQUE ("cpf_cnpj"), CONSTRAINT "PK_7f16886d1a44ed0974232b82506" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "farms" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "city" character varying NOT NULL, "state" character varying NOT NULL, "total_area" numeric(10,2) NOT NULL, "arable_area" numeric(10,2) NOT NULL, "vegetation_area" numeric(10,2) NOT NULL, "producer_id" uuid NOT NULL, "deleted_at" TIMESTAMP, CONSTRAINT "PK_39aff9c35006b14025bba5a43d9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "plantios" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "farm_id" uuid NOT NULL, "safra_id" uuid NOT NULL, "culture_planted_id" uuid NOT NULL, CONSTRAINT "UQ_09ebf28db264d4d898ed8a2836a" UNIQUE ("farm_id", "safra_id", "culture_planted_id"), CONSTRAINT "PK_a895f3297b944371aa7eb85344d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "safras" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, CONSTRAINT "UQ_53a4d59bca3cf6fd33020d6a0d1" UNIQUE ("name"), CONSTRAINT "PK_3cb7ebbb540db145b066ef34403" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "farms" ADD CONSTRAINT "FK_9c593007fa71180e11f2af67458" FOREIGN KEY ("producer_id") REFERENCES "producers"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "plantios" ADD CONSTRAINT "FK_a3e738099194cc3d0a40b099fa7" FOREIGN KEY ("farm_id") REFERENCES "farms"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "plantios" ADD CONSTRAINT "FK_5a0f6dc0532a9e803dc6df242e6" FOREIGN KEY ("safra_id") REFERENCES "safras"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "plantios" ADD CONSTRAINT "FK_200eab9ce7995ab48e258689e7a" FOREIGN KEY ("culture_planted_id") REFERENCES "cultures_planted"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "plantios" DROP CONSTRAINT "FK_200eab9ce7995ab48e258689e7a"`);
        await queryRunner.query(`ALTER TABLE "plantios" DROP CONSTRAINT "FK_5a0f6dc0532a9e803dc6df242e6"`);
        await queryRunner.query(`ALTER TABLE "plantios" DROP CONSTRAINT "FK_a3e738099194cc3d0a40b099fa7"`);
        await queryRunner.query(`ALTER TABLE "farms" DROP CONSTRAINT "FK_9c593007fa71180e11f2af67458"`);
        await queryRunner.query(`DROP TABLE "safras"`);
        await queryRunner.query(`DROP TABLE "plantios"`);
        await queryRunner.query(`DROP TABLE "farms"`);
        await queryRunner.query(`DROP TABLE "producers"`);
        await queryRunner.query(`DROP TABLE "cultures_planted"`);
    }

}
