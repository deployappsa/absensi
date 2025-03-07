import {
  type User, type InsertUser,
  type Shift, type InsertShift,
  type Attendance, type InsertAttendance,
  type Leave, type InsertLeave
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Shifts
  getShift(id: number): Promise<Shift | undefined>;
  listShifts(): Promise<Shift[]>;
  createShift(shift: InsertShift): Promise<Shift>;

  // Attendance
  getAttendance(id: number): Promise<Attendance | undefined>;
  listAttendanceByUser(userId: number): Promise<Attendance[]>;
  createAttendance(attendance: InsertAttendance): Promise<Attendance>;
  updateAttendance(id: number, attendance: Partial<InsertAttendance>): Promise<Attendance>;

  // Leaves
  getLeave(id: number): Promise<Leave | undefined>;
  listLeavesByUser(userId: number): Promise<Leave[]>;
  createLeave(leave: InsertLeave): Promise<Leave>;
  updateLeave(id: number, leave: Partial<InsertLeave>): Promise<Leave>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private shifts: Map<number, Shift>;
  private attendance: Map<number, Attendance>;
  private leaves: Map<number, Leave>;
  private currentIds: { [key: string]: number };

  constructor() {
    this.users = new Map();
    this.shifts = new Map();
    this.attendance = new Map();
    this.leaves = new Map();
    this.currentIds = { users: 1, shifts: 1, attendance: 1, leaves: 1 };

    // Add demo admin user
    this.createUser({
      username: "admin",
      password: "admin123",
      name: "Admin User",
      role: "admin" as const
    });
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentIds.users++;
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Shifts
  async getShift(id: number): Promise<Shift | undefined> {
    return this.shifts.get(id);
  }

  async listShifts(): Promise<Shift[]> {
    return Array.from(this.shifts.values());
  }

  async createShift(insertShift: InsertShift): Promise<Shift> {
    const id = this.currentIds.shifts++;
    const shift = { 
      ...insertShift, 
      id,
      allowedLocations: insertShift.allowedLocations ?? []
    };
    this.shifts.set(id, shift);
    return shift;
  }

  // Attendance
  async getAttendance(id: number): Promise<Attendance | undefined> {
    return this.attendance.get(id);
  }

  async listAttendanceByUser(userId: number): Promise<Attendance[]> {
    return Array.from(this.attendance.values()).filter(
      (record) => record.userId === userId
    );
  }

  async listPendingAttendance(): Promise<Attendance[]> {
    // Get all attendance records that haven't been approved yet
    const pendingRecords = Array.from(this.attendance.values()).filter(
      (record) => record.approved === false
    );
    
    // Enhance records with user names
    return Promise.all(pendingRecords.map(async (record) => {
      const user = await this.getUser(record.userId);
      return {
        ...record,
        userName: user ? user.name : 'Unknown'
      };
    }));
  }

  async createAttendance(insertAttendance: InsertAttendance): Promise<Attendance> {
    const id = this.currentIds.attendance++;
    const attendance = { 
      ...insertAttendance, 
      id,
      checkOutTime: null,
      checkOutPhoto: null,
      checkOutLocation: null
    };
    this.attendance.set(id, attendance);
    return attendance;
  }

  async updateAttendance(id: number, update: Partial<InsertAttendance>): Promise<Attendance> {
    const existing = await this.getAttendance(id);
    if (!existing) throw new Error("Attendance record not found");

    const updated = { ...existing, ...update };
    this.attendance.set(id, updated);
    return updated;
  }

  // Leaves
  async getLeave(id: number): Promise<Leave | undefined> {
    return this.leaves.get(id);
  }

  async listLeavesByUser(userId: number): Promise<Leave[]> {
    return Array.from(this.leaves.values()).filter(
      (leave) => leave.userId === userId
    );
  }

  async createLeave(insertLeave: InsertLeave): Promise<Leave> {
    const id = this.currentIds.leaves++;
    const leave = { 
      ...insertLeave, 
      id,
      status: insertLeave.status ?? "pending" as const
    };
    this.leaves.set(id, leave);
    return leave;
  }

  async updateLeave(id: number, update: Partial<InsertLeave>): Promise<Leave> {
    const existing = await this.getLeave(id);
    if (!existing) throw new Error("Leave request not found");

    const updated = { ...existing, ...update };
    this.leaves.set(id, updated);
    return updated;
  }
}

export const storage = new MemStorage();