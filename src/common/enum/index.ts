enum ROLES  {
  ADMIN = 'admin',
  USER = 'user',
  
  MANAGER = 'manager',
  TEACHER = 'teacher',
  STUDENT = 'student',
}

enum Room_STATUS {
  AVAILABLE = 'available',
  OCCUPIED = 'occupied',
  MAINTENANCE = 'maintenance',
}

enum STUDENT_STATUS {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  GRADUATED = 'graduated',
  SUSPENDED = 'suspended',
}

export { ROLES, Room_STATUS, STUDENT_STATUS };