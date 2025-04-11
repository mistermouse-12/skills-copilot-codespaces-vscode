import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { 
  insertUserSchema, 
  insertProfileSchema, 
  insertInterestSchema,
  insertUserInterestSchema,
  insertSwipeSchema,
  registerUserSchema,
  Match
} from "@shared/schema";

// Middleware para verificar autenticación
const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ message: "No autenticado" });
};

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes - all prefixed with /api
  
  // Configurar autenticación 
  setupAuth(app);
  
  // User routes
  app.get("/api/users/:id", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const user = await storage.getUserWithProfile(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Don't send password back to client
      const { password, ...userWithoutPassword } = user;
      
      res.status(200).json(userWithoutPassword);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // Profile routes
  app.get("/api/profiles/:userId", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const profile = await storage.getUserProfile(userId);
      
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      
      res.status(200).json(profile);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });
  
  app.put("/api/profiles/:userId", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const parseResult = insertProfileSchema.partial().safeParse(req.body);
      
      if (!parseResult.success) {
        return res.status(400).json({ message: "Invalid input", errors: parseResult.error.format() });
      }
      
      const updatedProfile = await storage.updateUserProfile(userId, parseResult.data);
      
      res.status(200).json(updatedProfile);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // Interest routes
  app.get("/api/interests", async (_req: Request, res: Response) => {
    try {
      const interests = await storage.getInterests();
      res.status(200).json(interests);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });
  
  app.post("/api/interests", async (req: Request, res: Response) => {
    try {
      const parseResult = insertInterestSchema.safeParse(req.body);
      
      if (!parseResult.success) {
        return res.status(400).json({ message: "Invalid input", errors: parseResult.error.format() });
      }
      
      const interest = await storage.createInterest(parseResult.data);
      
      res.status(201).json(interest);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // User Interest routes
  app.get("/api/users/:userId/interests", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const interests = await storage.getUserInterests(userId);
      
      res.status(200).json(interests);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });
  
  app.post("/api/users/:userId/interests", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const { interestId } = req.body;
      
      if (!interestId) {
        return res.status(400).json({ message: "Interest ID is required" });
      }
      
      const parseResult = insertUserInterestSchema.safeParse({
        userId,
        interestId
      });
      
      if (!parseResult.success) {
        return res.status(400).json({ message: "Invalid input", errors: parseResult.error.format() });
      }
      
      const userInterest = await storage.addUserInterest(parseResult.data);
      
      res.status(201).json(userInterest);
    } catch (error: any) {
      if (error.message === "User already has this interest") {
        return res.status(400).json({ message: error.message });
      }
      
      res.status(500).json({ message: error.message });
    }
  });
  
  app.delete("/api/users/:userId/interests/:interestId", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const interestId = parseInt(req.params.interestId);
      
      if (isNaN(userId) || isNaN(interestId)) {
        return res.status(400).json({ message: "Invalid user ID or interest ID" });
      }
      
      await storage.removeUserInterest(userId, interestId);
      
      res.status(204).end();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // Match routes
  app.get("/api/users/:userId/matches", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const matches = await storage.getMatches(userId);
      
      // Enhance with user details
      const enhancedMatches = await Promise.all(matches.map(async match => {
        const otherUserId = match.studentId === userId ? match.businessId : match.studentId;
        const otherUser = await storage.getUserWithProfile(otherUserId);
        
        if (!otherUser) {
          return null;
        }
        
        // Don't send password back to client
        const { password, ...otherUserWithoutPassword } = otherUser;
        
        return {
          ...match,
          otherUser: otherUserWithoutPassword
        };
      }));
      
      // Filter out nulls (shouldn't happen, but just in case)
      const validMatches = enhancedMatches.filter(m => m !== null);
      
      res.status(200).json(validMatches);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });
  
  app.post("/api/swipes", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const parseResult = insertSwipeSchema.safeParse(req.body);
      
      if (!parseResult.success) {
        return res.status(400).json({ message: "Invalid input", errors: parseResult.error.format() });
      }
      
      const { swiperId, swipedId, direction } = parseResult.data;
      
      // Create the swipe
      const swipe = await storage.createSwipe(parseResult.data);
      
      let match: Match | null = null; // Ahora puede almacenar Match o null
      
      if (direction === "right") {
        const isMatch = await storage.checkForMatch(swiperId, swipedId);
        
        if (isMatch) {
          // Get user types
          const swiper = await storage.getUser(swiperId);
          const swiped = await storage.getUser(swipedId);
          
          if (!swiper || !swiped) {
            return res.status(404).json({ message: "User not found" });
          }
          
          // Determine who's the student and who's the business
          let studentId: number, businessId: number;
          
          if (swiper.userType === "student" && swiped.userType === "business") {
            studentId = swiperId;
            businessId = swipedId;
          } else if (swiper.userType === "business" && swiped.userType === "student") {
            studentId = swipedId;
            businessId = swiperId;
          } else {
            return res.status(400).json({ message: "Invalid match: both users are the same type" });
          }
          
          // Create match
          match = await storage.createMatch({
            studentId,
            businessId,
            status: "accepted"
          });
        }
      }
      
      res.status(201).json({ swipe, match });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      res.status(500).json({ message: errorMessage });
    }
  });
  // Get potential matches for swiping
  app.get("/api/users/:userId/potential-matches", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const potentialMatches = await storage.getPotentialMatches(userId, user.userType);
      
      // Remove passwords
      const sanitizedMatches = potentialMatches.map(match => {
        const { password, ...userWithoutPassword } = match;
        return userWithoutPassword;
      });
      
      res.status(200).json(sanitizedMatches);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
