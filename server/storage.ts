import { 
  users, userProfiles, interests, userInterests, matches, swipes,
  type User, type InsertUser, 
  type UserProfile, type InsertUserProfile,
  type Interest, type InsertInterest,
  type UserInterest, type InsertUserInterest,
  type Match, type InsertMatch,
  type Swipe, type InsertSwipe,
  type UserWithProfile
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Profile methods
  getUserProfile(userId: number): Promise<UserProfile | undefined>;
  createUserProfile(profile: InsertUserProfile): Promise<UserProfile>;
  updateUserProfile(userId: number, profile: Partial<InsertUserProfile>): Promise<UserProfile>;
  
  // Interest methods
  getInterests(): Promise<Interest[]>;
  getInterestByName(name: string): Promise<Interest | undefined>;
  createInterest(interest: InsertInterest): Promise<Interest>;
  
  // User Interest methods
  getUserInterests(userId: number): Promise<Interest[]>;
  addUserInterest(userInterest: InsertUserInterest): Promise<UserInterest>;
  removeUserInterest(userId: number, interestId: number): Promise<void>;
  
  // Match methods
  getMatches(userId: number): Promise<Match[]>;
  createMatch(match: InsertMatch): Promise<Match>;
  updateMatchStatus(id: number, status: string): Promise<Match>;
  
  // Swipe methods
  createSwipe(swipe: InsertSwipe): Promise<Swipe>;
  checkForMatch(swiperId: number, swipedId: number): Promise<boolean>;
  
  // Complex queries
  getPotentialMatches(userId: number, userType: string): Promise<UserWithProfile[]>;
  getUserWithProfile(userId: number): Promise<UserWithProfile | undefined>;
}

export class MemStorage implements IStorage {
  private userRepo: Map<number, User>;
  private profileRepo: Map<number, UserProfile>;
  private interestRepo: Map<number, Interest>;
  private userInterestRepo: Map<number, UserInterest>;
  private matchRepo: Map<number, Match>;
  private swipeRepo: Map<number, Swipe>;
  
  private userId: number;
  private profileId: number;
  private interestId: number;
  private userInterestId: number;
  private matchId: number;
  private swipeId: number;
  
  constructor() {
    this.userRepo = new Map();
    this.profileRepo = new Map();
    this.interestRepo = new Map();
    this.userInterestRepo = new Map();
    this.matchRepo = new Map();
    this.swipeRepo = new Map();
    
    this.userId = 1;
    this.profileId = 1;
    this.interestId = 1;
    this.userInterestId = 1;
    this.matchId = 1;
    this.swipeId = 1;
    
    // Initialize with some interests
    this.seedInterests();
  }

  private seedInterests() {
    const defaultInterests = [
      "Desarrollo Web", "React", "UI/UX", "Marketing", 
      "Diseño Gráfico", "Social Media", "JavaScript", "Node.js",
      "Desarrollo Mobile", "Python", "Business Intelligence", "Data Science",
      "E-commerce", "Innovación", "Emprendimiento", "Ventas"
    ];
    
    defaultInterests.forEach(name => {
      this.createInterest({ name });
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.userRepo.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.userRepo.values()).find(
      (user) => user.username === username
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.userRepo.values()).find(
      (user) => user.email === email
    );
  }

  // Profile methods
  async getUserProfile(userId: number): Promise<UserProfile | undefined> {
    return Array.from(this.profileRepo.values()).find(
      (profile) => profile.userId === userId
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const timestamp = new Date();
  
    // Asegurarse de que profilePic sea string o null
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: timestamp, 
      profilePic: insertUser.profilePic ?? null // Si es undefined, asignar null
    };
  
    this.userRepo.set(id, user);
    return user;
  }

  async updateUserProfile(userId: number, profileData: Partial<InsertUserProfile>): Promise<UserProfile> {
    const existingProfile = await this.getUserProfile(userId);
    
    if (!existingProfile) {
      throw new Error("Profile not found");
    }
    
    const updatedProfile: UserProfile = { 
      ...existingProfile, 
      ...profileData 
    };
    
    this.profileRepo.set(existingProfile.id, updatedProfile);
    return updatedProfile;
  }

  // Interest methods
  async getInterests(): Promise<Interest[]> {
    return Array.from(this.interestRepo.values());
  }

  async getInterestByName(name: string): Promise<Interest | undefined> {
    return Array.from(this.interestRepo.values()).find(
      (interest) => interest.name.toLowerCase() === name.toLowerCase()
    );
  }

  async createInterest(interest: InsertInterest): Promise<Interest> {
    // Check if interest already exists
    const existing = await this.getInterestByName(interest.name);
    if (existing) {
      return existing;
    }
    
    const id = this.interestId++;
    const newInterest: Interest = { ...interest, id };
    this.interestRepo.set(id, newInterest);
    return newInterest;
  }

  // User Interest methods
  async getUserInterests(userId: number): Promise<Interest[]> {
    const userInterestIds = Array.from(this.userInterestRepo.values())
      .filter(ui => ui.userId === userId)
      .map(ui => ui.interestId);
    
    return Array.from(this.interestRepo.values())
      .filter(interest => userInterestIds.includes(interest.id));
  }

  async addUserInterest(userInterest: InsertUserInterest): Promise<UserInterest> {
    // Check if user already has this interest
    const exists = Array.from(this.userInterestRepo.values()).some(
      ui => ui.userId === userInterest.userId && ui.interestId === userInterest.interestId
    );
    
    if (exists) {
      throw new Error("User already has this interest");
    }
    
    const id = this.userInterestId++;
    const newUserInterest: UserInterest = { ...userInterest, id };
    this.userInterestRepo.set(id, newUserInterest);
    return newUserInterest;
  }

  async removeUserInterest(userId: number, interestId: number): Promise<void> {
    const userInterest = Array.from(this.userInterestRepo.entries()).find(
      ([_, ui]) => ui.userId === userId && ui.interestId === interestId
    );
    
    if (userInterest) {
      this.userInterestRepo.delete(userInterest[0]);
    }
  }

  // Match methods
  async getMatches(userId: number): Promise<Match[]> {
    return Array.from(this.matchRepo.values()).filter(
      match => match.studentId === userId || match.businessId === userId
    );
  }

  async createMatch(match: InsertMatch): Promise<Match> {
    const id = this.matchId++;
    const timestamp = new Date();
    
    // Asegurarse de que status sea string y nunca undefined
    const newMatch: Match = { 
      ...match, 
      id, 
      createdAt: timestamp,
      status: match.status ?? "pending" // Usar valor predeterminado si status es undefined
    };
    
    this.matchRepo.set(id, newMatch);
    return newMatch;
  }

  async updateMatchStatus(id: number, status: string): Promise<Match> {
    const match = this.matchRepo.get(id);
    
    if (!match) {
      throw new Error("Match not found");
    }
    
  
    const updatedMatch: Match = { ...match, status };
    this.matchRepo.set(id, updatedMatch);
    return updatedMatch;
  }

  // Swipe methods
  async createSwipe(swipe: InsertSwipe): Promise<Swipe> {
    const id = this.swipeId++;
    const timestamp = new Date();
    const newSwipe: Swipe = { ...swipe, id, createdAt: timestamp };
    this.swipeRepo.set(id, newSwipe);
    return newSwipe;
  }

  async checkForMatch(swiperId: number, swipedId: number): Promise<boolean> {
    // Check if the swiped user has already swiped right on the swiper
    const otherSwipe = Array.from(this.swipeRepo.values()).find(
      s => s.swiperId === swipedId && s.swipedId === swiperId && s.direction === "right"
    );
    
    return !!otherSwipe;
  }

  async getPotentialMatches(userId: number, userType: string): Promise<UserWithProfile[]> {
  const oppositeType = userType === "student" ? "business" : "student";
  
  // Get all users of the opposite type
  const potentialMatches = Array.from(this.userRepo.values())
    .filter(u => u.userType === oppositeType);
  
  // Filter out users that have already been swiped
  const swipedIds = Array.from(this.swipeRepo.values())
    .filter(s => s.swiperId === userId)
    .map(s => s.swipedId);
  
  const filteredMatches = potentialMatches.filter(u => !swipedIds.includes(u.id));
  
  // Enrich with profiles and interests
  const result: UserWithProfile[] = [];
  
  for (const user of filteredMatches) {
    // Conversión explícita de undefined a null
    const profile = await this.getUserProfile(user.id) ?? null;
    const interests = await this.getUserInterests(user.id);
    
    result.push({
      ...user,
      profile, // Ahora profile es UserProfile | null, no undefined
      interests
    });
  }
  
  return result;
}
  async getUserWithProfile(userId: number): Promise<UserWithProfile | undefined> {
    const user = await this.getUser(userId);
    
    if (!user) {
      return undefined;
    }
    
    // Convertir undefined a null
    const profile = await this.getUserProfile(userId) ?? null;
    const interests = await this.getUserInterests(userId);
    
    return {
      ...user,
      profile, 
      interests
    };
  }
  // Dentro de la clase MemStorage
async createUserProfile(profile: InsertUserProfile): Promise<UserProfile> {
  const id = this.profileId++;
  
  const userProfile: UserProfile = { 
    ...profile, 
    id,
    // Asegúrate de que los campos opcionales sean null y no undefined
    bio: profile.bio ?? null,
    education: profile.education ?? null,
    experience: profile.experience ?? null,
    completionPercentage: profile.completionPercentage ?? null
  };
  
  this.profileRepo.set(id, userProfile);
  
  // Asumiendo que profile tiene un campo userId
  const user = this.userRepo.get(profile.userId);
  if (user) {
    // Aquí podrías actualizar alguna referencia al perfil en el usuario si es necesario
  }
  
  return userProfile;
}
}

export const storage = new MemStorage();
