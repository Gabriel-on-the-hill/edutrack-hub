const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding curricula...');

  // 1. Samuel's Irish Junior Cycle Maths (Year 2)
  const irelandMath = await prisma.curriculum.create({
    data: {
      country: 'Ireland',
      countryCode: 'IE',
      jurisdictionLevel: 'national',
      grade: 'Junior Cycle Year 2',
      subject: 'Mathematics',
      sourceAuthority: 'NCCA Ireland',
      confidenceScore: 0.99,
      status: 'active',
      competencies: {
        create: [
          { title: 'Number Systems', description: 'Understanding Natural (N), Integers (Z), Rational (Q), Irrational (I), and Real numbers (R).', orderIndex: 1 },
          { title: 'Applied Arithmetic', description: 'Converting fractions, decimals, and percentages; ratio and proportion; financial calculations like VAT and profit/loss.', orderIndex: 2 },
          { title: 'Factorisation', description: 'Mastering mechanics of factorisation: Common Factors, Difference of Two Squares (DOTS), and quadratic expressions.', orderIndex: 3 },
          { title: 'Synthetic Geometry', description: 'Engaging with geometric axioms, properties of points/lines, and constructions using compass and straightedge.', orderIndex: 4 },
          { title: 'Trigonometry & Pythagoras', description: 'Right-angled triangle calculations using Pythagoras theorem and sine/cosine/tangent ratios.', orderIndex: 5 },
          { title: 'Statistics and Probability', description: 'Calculating probability, combinatorial listings, and measures of central tendency (mean, median, mode).', orderIndex: 6 }
        ]
      }
    }
  });

  // 2. Tracy's Algebra 2 (US Common Core)
  const usAlgebra2 = await prisma.curriculum.create({
    data: {
      country: 'United States',
      countryCode: 'US',
      jurisdictionLevel: 'national',
      grade: '11',
      subject: 'Algebra 2',
      sourceAuthority: 'Common Core State Standards',
      confidenceScore: 0.98,
      status: 'active',
      competencies: {
        create: [
          { title: 'Polynomial Functions', description: 'Analyzing, graphing, and solving polynomial equations including factorisation and division.', orderIndex: 1 },
          { title: 'Rational Expressions', description: 'Simplifying, multiplying, dividing, and solving equations with rational expressions.', orderIndex: 2 },
          { title: 'Exponential and Logarithmic Functions', description: 'Modeling growth and decay, properties of logarithms, and solving exponential equations.', orderIndex: 3 },
          { title: 'Trigonometric Functions', description: 'Periodic functions, unit circle, and trigonometric identities.', orderIndex: 4 },
          { title: 'Probability and Statistics', description: 'Conditional probability, independence, and normal distributions.', orderIndex: 5 }
        ]
      }
    }
  });

  console.log(`Seeding finished. Added 2 curricula.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
