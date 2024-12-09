const NAMES_DATA = {
  male: {
    first: [
      'John',
      'Michael',
      'William',
      'James',
      'Alexander',
      'David',
      'Daniel',
      'Joseph',
      'Henry',
      'Lucas',
      'Thomas',
      'Robert',
      'Richard',
      'Charles',
      'Christopher',
      'Andrew',
      'Paul',
      'Steven',
      'Kevin',
      'Brian',
    ],
    last: [
      'Smith',
      'Johnson',
      'Brown',
      'Taylor',
      'Anderson',
      'Wilson',
      'Martinez',
      'Garcia',
      'Davis',
      'Rodriguez',
      'Miller',
      'Lee',
      'Wang',
      'Thompson',
      'White',
      'Harris',
      'Martin',
      'Moore',
      'Jackson',
      'Clark',
    ],
  },
  female: {
    first: [
      'Emma',
      'Sophia',
      'Isabella',
      'Olivia',
      'Ava',
      'Mia',
      'Charlotte',
      'Amelia',
      'Emily',
      'Elizabeth',
      'Sofia',
      'Evelyn',
      'Victoria',
      'Grace',
      'Zoe',
      'Lily',
      'Hannah',
      'Natalie',
      'Alice',
      'Laura',
    ],
    last: [
      'Smith',
      'Johnson',
      'Brown',
      'Taylor',
      'Anderson',
      'Wilson',
      'Martinez',
      'Garcia',
      'Davis',
      'Rodriguez',
      'Miller',
      'Lee',
      'Wang',
      'Thompson',
      'White',
      'Harris',
      'Martin',
      'Moore',
      'Jackson',
      'Clark',
    ],
  },
  domains: [
    'gmail.com',
    'yahoo.com',
    'hotmail.com',
    'outlook.com',
    'proton.me',
    'icloud.com',
    'aol.com',
    'fastmail.com',
  ],
} as const;

type Gender = 'male' | 'female';
type UserStatus = 'active' | 'inactive';

interface GoRestUser {
  name: string;
  gender: Gender;
  email: string;
  status: UserStatus;
}

const getRandomElement = <T>(arr: readonly T[]): T => {
  return arr[Math.floor(Math.random() * arr.length)];
};

/**
 * Generates a random full name based on gender
 */
export function generateRandomName(gender: Gender): string {
  const names = NAMES_DATA[gender];
  const firstName = getRandomElement(names.first);
  const lastName = getRandomElement(names.last);
  return `${firstName} ${lastName}`;
}

/**
 * Generates a random email address
 */
export function generateRandomEmail(name: string): string {
  const domain = getRandomElement(NAMES_DATA.domains);
  const localPart = name
    .toLowerCase()
    .replace(/\s+/g, '.')
    .replace(/[^a-z0-9.]/g, '');

  // Add random numbers to ensure uniqueness
  const randomString = Math.random().toString(36).substring(2, 5);
  return `${localPart}.${randomString}@${domain}`;
}

/**
 * Generates a random user compatible with GoRest API
 */
export function generateRandomUser(
  options: {
    gender?: Gender;
    status?: UserStatus;
  } = {},
): GoRestUser {
  const gender =
    options.gender || getRandomElement(['male', 'female'] as const);
  const status = options.status || 'active';
  const name = generateRandomName(gender);
  const email = generateRandomEmail(name);

  return {
    name,
    gender,
    email,
    status,
  };
}
