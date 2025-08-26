import { pgTable, timestamp, uuid, text, unique } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
    name: text("name").notNull().unique(),
});

export type Feed = typeof feeds.$inferSelect;

export const feeds = pgTable("feeds", {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
    name: text("name").notNull().unique(),
    url: text("url").notNull().unique(),
    user_id: uuid("user_id").notNull().references(() => users.id, {onDelete: "cascade"}),
    last_fetched_at: timestamp("last_fetched_at"),
});

export type User = typeof users.$inferSelect;

export const feed_follows = pgTable("feed_follows", {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
    user_id: uuid("user_id").notNull().references(() => users.id, {onDelete: "cascade"}),
    feed_id: uuid("feed_id").notNull().references(() => feeds.id, {onDelete: "cascade"})
    },
    (t) => [{ unq: unique().on(t.user_id, t.feed_id)} ],
);

export type FeedFollow = typeof feed_follows.$inferSelect;

export const posts = pgTable("posts", {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
    title: text("title").notNull(),
    url: text("url").notNull().unique(),
    description: text("description"),
    publishDate: timestamp("publish_date"),
    feed_id: uuid("feed_id").notNull().references(() => feeds.id, {onDelete: "cascade"})
    });

export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;