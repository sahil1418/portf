import type { SkillData } from '@/lib/types';

export const mockSkills: SkillData[] = [
  // Languages
  { name: 'C', category: 'languages', proficiency: 72, yearsUsed: 3, githubBytes: 60000 },
  { name: 'C++', category: 'languages', proficiency: 78, yearsUsed: 3, githubBytes: 95000 },
  { name: 'Python', category: 'languages', proficiency: 92, yearsUsed: 3, githubBytes: 245000 },
  { name: 'JavaScript', category: 'languages', proficiency: 88, yearsUsed: 3, githubBytes: 160000 },
  { name: 'TypeScript', category: 'languages', proficiency: 85, yearsUsed: 2, githubBytes: 180000 },

  // Frameworks & Tools
  { name: 'Next.js', category: 'frameworks', proficiency: 85, yearsUsed: 2, githubBytes: 150000 },
  { name: 'NestJS', category: 'frameworks', proficiency: 80, yearsUsed: 1, githubBytes: 110000 },
  { name: 'PostgreSQL', category: 'frameworks', proficiency: 78, yearsUsed: 2, githubBytes: 70000 },
  { name: 'Prisma', category: 'frameworks', proficiency: 76, yearsUsed: 1, githubBytes: 55000 },
  { name: 'Docker', category: 'frameworks', proficiency: 74, yearsUsed: 1, githubBytes: 25000 },
  { name: 'Git', category: 'frameworks', proficiency: 85, yearsUsed: 3, githubBytes: 0 },
  { name: 'REST APIs', category: 'frameworks', proficiency: 85, yearsUsed: 3, githubBytes: 0 },
  { name: 'JWT', category: 'frameworks', proficiency: 78, yearsUsed: 2, githubBytes: 0 },
  { name: 'BullMQ / Redis', category: 'frameworks', proficiency: 72, yearsUsed: 1, githubBytes: 30000 },
  { name: 'Socket.IO', category: 'frameworks', proficiency: 70, yearsUsed: 1, githubBytes: 20000 },

  // AI / ML
  { name: 'PyTorch', category: 'ai-ml', proficiency: 88, yearsUsed: 2, githubBytes: 120000 },
  { name: 'HuggingFace Transformers', category: 'ai-ml', proficiency: 75, yearsUsed: 1, githubBytes: 40000 },
  { name: 'Scikit-learn', category: 'ai-ml', proficiency: 82, yearsUsed: 2, githubBytes: 85000 },
  { name: 'XGBoost', category: 'ai-ml', proficiency: 80, yearsUsed: 2, githubBytes: 50000 },
  { name: 'Google Earth Engine', category: 'ai-ml', proficiency: 78, yearsUsed: 1, githubBytes: 45000 },

  // CS Fundamentals
  { name: 'OOP', category: 'fundamentals', proficiency: 88, yearsUsed: 3, githubBytes: 0 },
  { name: 'Operating Systems', category: 'fundamentals', proficiency: 75, yearsUsed: 2, githubBytes: 0 },
  { name: 'DBMS', category: 'fundamentals', proficiency: 80, yearsUsed: 2, githubBytes: 0 },
  { name: 'System Design', category: 'fundamentals', proficiency: 72, yearsUsed: 1, githubBytes: 0 },
  { name: 'DSA', category: 'fundamentals', proficiency: 85, yearsUsed: 3, githubBytes: 0 },
];
