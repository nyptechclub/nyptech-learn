import { relations } from "drizzle-orm";
import { boolean, integer, pgEnum, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createId } from '@paralleldrive/cuid2';

export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  imageSrc: text("image_src").notNull(),
});

export const coursesRelations = relations(courses, ({ many }) => ({
  userProgress: many(userProgress),
  units: many(units),
}));

export const units = pgTable("units", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(), // Unit 1
  description: text("description").notNull(), // Learn the basics of spanish
  courseId: integer("course_id").references(() => courses.id, { onDelete: "cascade" }).notNull(),
  order: integer("order").notNull(),
});

export const unitsRelations = relations(units, ({ many, one }) => ({
  course: one(courses, {
    fields: [units.courseId],
    references: [courses.id],
  }),
  lessons: many(lessons),
}));

export const lessons = pgTable("lessons", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  unitId: integer("unit_id").references(() => units.id, { onDelete: "cascade" }).notNull(),
  order: integer("order").notNull(),
});

export const lessonsRelations = relations(lessons, ({ one, many }) => ({
  unit: one(units, {
    fields: [lessons.unitId],
    references: [units.id],
  }),
  challenges: many(challenges),
}));

export const challengesEnum = pgEnum("type", ["SELECT", "ASSIST"]);

export const challenges = pgTable("challenges", {
  id: serial("id").primaryKey(),
  lessonId: integer("lesson_id").references(() => lessons.id, { onDelete: "cascade" }).notNull(),
  type: challengesEnum("type").notNull(),
  question: text("question").notNull(),
  order: integer("order").notNull(),
  lesson: text("lesson")
});

export const challengesRelations = relations(challenges, ({ one, many }) => ({
  lesson: one(lessons, {
    fields: [challenges.lessonId],
    references: [lessons.id],
  }),
  challengeOptions: many(challengeOptions),
  challengeProgress: many(challengeProgress),
}));

export const challengeOptions = pgTable("challenge_options", {
  id: serial("id").primaryKey(),
  challengeId: integer("challenge_id").references(() => challenges.id, { onDelete: "cascade" }).notNull(),
  text: text("text").notNull(),
  correct: boolean("correct").notNull(),
  imageSrc: text("image_src"),
  audioSrc: text("audio_src"),
});

export const challengeOptionsRelations = relations(challengeOptions, ({ one }) => ({
  challenge: one(challenges, {
    fields: [challengeOptions.challengeId],
    references: [challenges.id],
  }),
}));

export const challengeProgress = pgTable("challenge_progress", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(), 
  challengeId: integer("challenge_id").references(() => challenges.id, { onDelete: "cascade" }).notNull(),
  completed: boolean("completed").notNull().default(false),
});

export const challengeProgressRelations = relations(challengeProgress, ({ one }) => ({
  challenge: one(challenges, {
    fields: [challengeProgress.challengeId],
    references: [challenges.id],
  }),
}));

export const userProgress = pgTable("user_progress", {
  userId: text("user_id").primaryKey(),
  userName: text("user_name").notNull().default("User"),
  userImageSrc: text("user_image_src").notNull().default("/mascot.svg"),
  activeCourse: integer("active_course_id").references(() => courses.id, { onDelete: "cascade" }),
  hearts: integer("hearts").notNull().default(5),
  maxhearts: integer("maxhearts").notNull().default(5),
  points: integer("points").notNull().default(0),
  theme: text("theme").notNull().default("cupcake"),
});

export const userProgressRelations = relations(userProgress, ({ one }) => ({
  activeCourse: one(courses, {
    fields: [userProgress.activeCourse],
    references: [courses.id],
  }),
}));
export const userSubcription = pgTable("user_subscription", {
  id: serial("id").primaryKey(),
  userId: text("user_Id").notNull().unique(),
  stripeCustomerId: text("stripe_customer_id").notNull().unique(),
  stripeSubscriptionId: text("stripe_subscription_id").notNull().unique(),
  stripePriceId: text("stripe_price_id").notNull().unique(),
  stripeEnd: timestamp("stripe_end").notNull(),
})
export const cCourses = pgTable("cCourses", {
  id: text("id").primaryKey().default(createId()),
  title: text("title"),
  userId: text("userId"),
  imageSrc: text("imageSrc"),
  description: text("description"),
  isPublished: boolean("is_published").default(false),
  categoryId: text("category_id").references(() => categories.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const cCoursesRelations = relations(cCourses, ({ many, one }) => ({
  userProgress: many(userProgress),
  units: many(units),
  attachments: many(attachments),
  category: one(categories, {
    fields: [cCourses.categoryId],
    references: [categories.id],
  }),
  chapters: many(chapters),
}));

export const categories = pgTable("categories", {
  id: text("id").primaryKey().default(createId()),
  name: text("name").unique().notNull(),
});

export const categoriesRelations = relations(categories, ({ many }) => ({
  courses: many(cCourses),
}));

export const attachments = pgTable("attachments", {
  id: text("id").primaryKey().default(createId()),
  name: text("name"),
  url: text("url"),
  courseId: text("course_id").references(() => cCourses.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const attachmentsRelations = relations(attachments, ({ one }) => ({
  course: one(cCourses, {
    fields: [attachments.courseId],
    references: [cCourses.id],
  }),
}));

export const chapters = pgTable("chapters", {
  id: text("id").primaryKey().default(createId()),
  title: text("title"),
  description: text("description"),
  videoUrl: text("video_url"),
  position: integer("position").notNull(),
  isPublished: boolean("is_published").default(false),
  courseId: text("course_id").references(() => cCourses.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const chaptersRelations = relations(chapters, ({ one, many }) => ({
  course: one(cCourses, {
    fields: [chapters.courseId],
    references: [cCourses.id],
  }),
  muxData: many(muxData),
  cuserProgress: many(cuserProgress),
}));

export const muxData = pgTable("mux_data", {
  id: text("id").primaryKey().default(createId()),
  assetId: text("asset_id"),
  playbackId: text("playback_id"),
  chapterId: text("chapter_id").references(() => chapters.id, { onDelete: "cascade" }).unique(),
});

export const muxDataRelations = relations(muxData, ({ one }) => ({
  chapter: one(chapters, {
    fields: [muxData.chapterId],
    references: [chapters.id],
  }),
}));

export const cuserProgress = pgTable("cuserprogress", {
  id: text("id").primaryKey().default(createId()),
  userId: text("user_id").unique(),
  chapterId: text("chapter_id").unique(),
  isCompleted: boolean("is_completed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const cuserProgressRelations = relations(cuserProgress, ({ one }) => ({
  chapter: one(chapters, {
    fields: [cuserProgress.chapterId],
    references: [chapters.id],
  }),
}));