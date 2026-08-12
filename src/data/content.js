export const profile = {
  name: 'Muhammad Zaeem',
  shortName: 'MZ',
  title: 'Full-Stack .NET Developer',
  tagline:
    'Building scalable, secure, and high-performance web applications with .NET Core, Angular & Blazor',
  location: 'Islamabad, Pakistan',
  email: 'muhammadzaeem520@gmail.com',
  phone: '(+92) 303-9775115',
  phoneHref: '+923039775115',
  cvUrl: '/assets/cv.pdf',
  linkedin: 'https://www.linkedin.com/in/muhammadzaeem0/',
}

export const navLinks = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'education', label: 'Education' },
  { id: 'contact', label: 'Contact' },
]

export const about = {
  bio: 'Full-Stack .NET Developer with hands-on experience building enterprise-grade software — from RESTful APIs and microservices architecture to rich Blazor front-ends using Telerik, Radzen, and Syncfusion. Skilled in designing secure, scalable systems (RabbitMQ, PostgreSQL, AES encryption) and leading modules end-to-end, from bug tracking to document management platforms.',
  techBadges: [
    { name: '.NET', label: '.NET' },
    { name: 'Angular', label: 'Angular' },
    { name: 'Blazor', label: 'Blazor' },
    { name: 'Docker', label: 'Docker' },
    { name: 'PostgreSQL', label: 'PostgreSQL' },
    { name: 'RabbitMQ', label: 'RabbitMQ' },
  ],
}

export const skills = [
  {
    category: 'Backend',
    items: [
      '.NET Core',
      'C#',
      'REST APIs',
      'Entity Framework Core',
      'Microservices',
      'RabbitMQ',
      'SignalR',
      'Clean Architecture',
    ],
  },
  {
    category: 'Frontend',
    items: ['Angular', 'Blazor', 'Telerik', 'Radzen', 'Syncfusion', 'HTML/CSS'],
  },
  {
    category: 'Databases',
    items: ['PostgreSQL', 'MySQL', 'SQL Server'],
  },
  {
    category: 'DevOps / Tools',
    items: ['Docker', 'GitHub', 'Jira', 'Git (branching / merging / PRs)'],
  },
]

export const experience = [
  {
    id: 'ba-se',
    role: 'Software Engineer',
    company: 'Business Analytics Pvt Ltd',
    location: 'Islamabad, Onsite',
    period: 'Jun 2022 – Present',
    projects: [
      {
        name: 'FATWA Software',
        bullets: [
          'Built responsive Blazor front-ends (Telerik, Radzen, Syncfusion) with RESTful .NET Core APIs and ASP.NET Identity user management',
          'Module lead for the Bug Reporting Module and built the Organizing Committee Module for event management',
          'Engineered Excel-processing logic for actuarial data validation and PDF report generation (risk summaries, scorecards) using RadFixedDocument and PDF Export Setting',
        ],
      },
      {
        name: 'Document Management System (DMS)',
        subtitle: 'Senior Software Developer',
        bullets: [
          'Implemented microservices architecture with RabbitMQ for async inter-service communication',
          'Used PostgreSQL with advanced indexing, query optimization, and JSONB for large-scale document metadata',
          'Integrated Blazor libraries (SfPdfViewerServer, SfSpreadsheet, SfDocumentEditorContainer, SfImageEditor) for in-browser document viewing/editing',
          'Implemented AES-256 encryption (CBC mode, PKCS7 padding) for secure document storage',
          'Built scalable .NET Core APIs with EF Core for document upload, retrieval, and versioning; async background processing for file conversion/compression/thumbnails',
        ],
      },
    ],
  },
]

export const projects = [
  {
    id: 'clippable',
    name: 'Clippable',
    stack: '.NET Core',
    year: '2025',
    url: '#', // TODO: Add real project URL
    // TODO: Replace with a more accurate project description
    description: 'Full-stack application built with .NET Core.',
  },
  {
    id: 'radzen-grid',
    name: 'Radzen Grid Pagination Library',
    stack: 'Blazor',
    year: '2025',
    url: '#', // TODO: Add real project URL
    // TODO: Replace with a more accurate project description
    description: 'Reusable Blazor pagination library for Radzen grids.',
  },
  {
    id: 'am-best',
    name: 'A.M. Best',
    stack: 'Blazor Frontend',
    year: '2024',
    url: '#', // TODO: Add real project URL
    // TODO: Replace with a more accurate project description
    description: 'Blazor frontend for insurance rating workflows.',
  },
  {
    id: 'e2-value',
    name: 'E2 Value',
    stack: '.NET WebForms',
    year: '2024',
    url: '#', // TODO: Add real project URL
    // TODO: Replace with a more accurate project description
    description: 'Legacy .NET WebForms application enhancements.',
  },
  {
    id: 'inspect-connect',
    name: 'Inspect Connect',
    stack: '.NET Core + Angular',
    year: '2024',
    url: '#', // TODO: Add real project URL
    // TODO: Replace with a more accurate project description
    description: 'Inspection platform with .NET Core APIs and Angular UI.',
  },
  {
    id: 'medicine-auth',
    name: 'Medicine Authenticator',
    stack: 'Flutter',
    year: '2021',
    url: '#', // TODO: Add real project URL
    // TODO: Replace with a more accurate project description
    description: 'Mobile app for medicine authenticity verification.',
  },
]

export const education = {
  degree: 'BSc in Software Engineering',
  major: 'Software Development Major',
  institution: 'COMSATS University Islamabad, Lahore Campus',
  period: 'Sep 2021',
  coursework: [
    'Data Structures',
    'OOP',
    'Programming Fundamentals',
    'Machine Learning',
  ],
}

export const languages = [
  { name: 'Urdu', level: 'Native' },
  { name: 'English', level: 'Advanced' },
]
