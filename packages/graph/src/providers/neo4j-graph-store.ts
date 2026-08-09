import neo4j, {
  type Driver,
} from "neo4j-driver";

import type {
  Entity,
  Relationship,
} from "../models";

import type { GraphStore } from "../interfaces";

export interface Neo4jGraphStoreOptions {
  uri: string;
  username: string;
  password: string;
  database?: string;
}

export class Neo4jGraphStore
  implements GraphStore
{
  private readonly driver: Driver;
  private readonly database: string;

  constructor(
    options: Neo4jGraphStoreOptions,
  ) {
    this.driver = neo4j.driver(
      options.uri,
      neo4j.auth.basic(
        options.username,
        options.password,
      ),
    );

    this.database =
      options.database ?? "75ab4bc5";
  }

  async connect(): Promise<void> {
    await this.driver.verifyConnectivity();
  }

  async upsertEntity(
    entity: Entity,
  ): Promise<void> {
    const session =
      this.driver.session({
        database: this.database,
      });

    try {
      await session.run(
        `
        MERGE (e:Entity {id: $id})
        SET
          e.name = $name,
          e.type = $type,
          e.metadata = $metadata
        `,
        {
          id: entity.id,
          name: entity.name,
          type: entity.type,
          metadata: JSON.stringify(
            entity.metadata ?? {},
          ),
        },
      );
    } finally {
      await session.close();
    }
  }

  async upsertRelationship(
    relationship: Relationship,
  ): Promise<void> {
    const session =
      this.driver.session({
        database: this.database,
      });

    try {
      await session.run(
        `
        MATCH (source:Entity {id: $sourceId})
        MATCH (target:Entity {id: $targetId})

        MERGE (
          source
        )-[r:RELATED_TO {
          id: $id
        }]->(
          target
        )

        SET
          r.type = $type,
          r.confidence = $confidence,
          r.metadata = $metadata
        `,
        {
          id: relationship.id,
          sourceId:
            relationship.sourceId,
          targetId:
            relationship.targetId,
          type: relationship.type,
          confidence:
            relationship.confidence,
          metadata: JSON.stringify(
            relationship.metadata ?? {},
          ),
        },
      );
    } finally {
      await session.close();
    }
  }

  async getEntity(
    id: string,
  ): Promise<Entity | null> {
    const session =
      this.driver.session({
        database: this.database,
      });

    try {
      const result =
        await session.run(
          `
          MATCH (e:Entity {id: $id})
          RETURN e
          `,
          { id },
        );

      if (result.records.length === 0) {
        return null;
      }

      const node =
        result.records[0].get("e");

      return {
        id: node.properties.id,
        name: node.properties.name,
        type: node.properties.type,
        metadata: JSON.parse(
          node.properties.metadata,
        ),
      };
    } finally {
      await session.close();
    }
  }

  async getRelationships(
    entityId: string,
  ): Promise<Relationship[]> {
    const session =
      this.driver.session({
        database: this.database,
      });

    try {
      const result =
        await session.run(
          `
          MATCH (source:Entity)
                -[r:RELATED_TO]->
                (target:Entity)

          WHERE
            source.id = $entityId
            OR target.id = $entityId

          RETURN
            r,
            source.id AS sourceId,
            target.id AS targetId
          `,
          { entityId },
        );

      return result.records.map(
        (record) => {
          const relationship =
            record.get("r");

          return {
            id:
              relationship.properties.id,

            sourceId:
              record.get("sourceId"),

            targetId:
              record.get("targetId"),

            type:
              relationship.properties.type,

            confidence:
              relationship.properties
                .confidence,

            metadata: JSON.parse(
              relationship.properties
                .metadata,
            ),
          };
        },
      );
    } finally {
      await session.close();
    }
  }

  async deleteEntity(
    id: string,
  ): Promise<void> {
    const session =
      this.driver.session({
        database: this.database,
      });

    try {
      await session.run(
        `
        MATCH (e:Entity {id: $id})
        DETACH DELETE e
        `,
        { id },
      );
    } finally {
      await session.close();
    }
  }

  async deleteRelationship(
    id: string,
  ): Promise<void> {
    const session =
      this.driver.session({
        database: this.database,
      });

    try {
      await session.run(
        `
        MATCH ()-[r:RELATED_TO {id: $id}]->()
        DELETE r
        `,
        { id },
      );
    } finally {
      await session.close();
    }
  }

  async close(): Promise<void> {
    await this.driver.close();
  }

  async findEntity(
    name: string,
    type: string,
  ): Promise<Entity | null> {
    const session =
      this.driver.session();

    try {
      const result =
        await session.run(
          `
          MATCH (e:Entity)
          WHERE
            toLower(e.name) = toLower($name)
            AND
            toLower(e.type) = toLower($type)
          RETURN e
          LIMIT 1
          `,
          {
            name,
            type,
          },
        );

      if (result.records.length === 0) {
        return null;
      }

      const node =
        result.records[0].get("e");

      return {
        id: node.properties.id,
        name: node.properties.name,
        type: node.properties.type,
        metadata:
          node.properties.metadata,
      };
    } finally {
      await session.close();
    }
  }
}
