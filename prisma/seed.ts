import { PrismaClient, JobStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const skills = [
    ['Python', 'programming'], ['SQL', 'data'], ['React', 'frontend'], ['TypeScript', 'programming'],
    ['Git', 'tools'], ['AWS', 'cloud'], ['Communication', 'professional'], ['Data Structures', 'core'],
    ['Figma', 'design'], ['FastAPI', 'backend'], ['Machine Learning', 'ai'],
  ];
  for (const [name, category] of skills) {
    await prisma.skill.upsert({ where: { name }, update: { category }, create: { name, slug: name.toLowerCase().replaceAll(' ', '-'), category } });
  }
  const python = await prisma.skill.findUniqueOrThrow({ where: { name: 'Python' } });
  const sql = await prisma.skill.findUniqueOrThrow({ where: { name: 'SQL' } });
  const react = await prisma.skill.findUniqueOrThrow({ where: { name: 'React' } });
  const typescript = await prisma.skill.findUniqueOrThrow({ where: { name: 'TypeScript' } });
  const role = await prisma.careerRole.upsert({ where: { slug: 'full-stack-engineer' }, update: {}, create: { title: 'Full Stack Engineer', slug: 'full-stack-engineer', description: 'Build reliable product experiences across the frontend and backend.', demandScore: 88 } });
  await prisma.roleSkill.createMany({ data: [python, sql, react, typescript].map((skill, index) => ({ roleId: role.id, skillId: skill.id, required: index < 3, weight: 4 - index })), skipDuplicates: true });
  const company = await prisma.company.upsert({ where: { name: 'Northstar Labs' }, update: {}, create: { name: 'Northstar Labs' } });
  await prisma.job.upsert({ where: { id: '00000000-0000-0000-0000-000000000001' }, update: {}, create: { id: '00000000-0000-0000-0000-000000000001', companyId: company.id, roleId: role.id, title: 'Software Engineer — Platform', location: 'Bengaluru · Hybrid', description: 'Join a product platform team building developer tools.', ctc: '₹14–18 LPA', allowedBranches: ['CSE', 'IT'], maxBacklogs: 0, minCgpa: 7.5, deadline: new Date('2026-10-15T18:30:00.000Z'), externalUrl: 'https://example.com/apply', status: JobStatus.PUBLISHED } });
  console.info('OMEN development catalog seeded. This data is not historical institutional data.');
}

main().finally(() => prisma.$disconnect());
