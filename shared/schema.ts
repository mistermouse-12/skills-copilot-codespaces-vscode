import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User type enum
export const UserType = {
  STUDENT: "student",
  BUSINESS: "business",
} as const;

export type UserTypeValue = typeof UserType[keyof typeof UserType];

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  userType: text("user_type").notNull(),
  profilePic: text("profile_pic"), // Puede ser null o undefined
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userProfiles = pgTable("user_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  bio: text("bio"),
  education: json("education").default([]),
  experience: json("experience").default([]),
  completionPercentage: integer("completion_percentage").default(0),
});

export const interests = pgTable("interests", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
});

export const userInterests = pgTable("user_interests", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  interestId: integer("interest_id").notNull().references(() => interests.id),
});

export const matches = pgTable("matches", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull().references(() => users.id),
  businessId: integer("business_id").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  status: text("status").default("pending").notNull(), // pending, accepted, rejected
});

export const swipes = pgTable("swipes", {
  id: serial("id").primaryKey(),
  swiperId: integer("swiper_id").notNull().references(() => users.id),
  swipedId: integer("swiped_id").notNull().references(() => users.id),
  direction: text("direction").notNull(), // "right" for like, "left" for dislike
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Zod schemas for insert operations
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertProfileSchema = createInsertSchema(userProfiles).omit({ id: true });
export const insertInterestSchema = createInsertSchema(interests).omit({ id: true });
export const insertUserInterestSchema = createInsertSchema(userInterests).omit({ id: true });
export const insertMatchSchema = createInsertSchema(matches).omit({ id: true, createdAt: true });
export const insertSwipeSchema = createInsertSchema(swipes).omit({ id: true, createdAt: true });

// TypeScript types for the schema
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type UserProfile = typeof userProfiles.$inferSelect;
export type InsertUserProfile = z.infer<typeof insertProfileSchema>;

export type Interest = typeof interests.$inferSelect;
export type InsertInterest = z.infer<typeof insertInterestSchema>;

export type UserInterest = typeof userInterests.$inferSelect;
export type InsertUserInterest = z.infer<typeof insertUserInterestSchema>;

export type Match = typeof matches.$inferSelect;
export type InsertMatch = z.infer<typeof insertMatchSchema>;

export type Swipe = typeof swipes.$inferSelect;
export type InsertSwipe = z.infer<typeof insertSwipeSchema>;

// Extended schemas for validation
export const registerUserSchema = insertUserSchema.extend({
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type RegisterUser = z.infer<typeof registerUserSchema>;

// User with profile and interests
export type UserWithProfile = User & {
  profile: UserProfile | null;
  interests: Interest[];
};
