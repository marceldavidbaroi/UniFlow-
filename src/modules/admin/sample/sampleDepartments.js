// src/modules/admin/sample/sampleDepartments.js
// Sample department data for mass insertion
export const sampleDepartments = [
  // IT Faculty Departments
  {
    name: 'Computer Science',
    initial: 'CS',
    code: 'IT-01',
    description: 'Department of Computer Science under IT Faculty.',
    headOfDepartment: 'Dr. Sana Malik',
    email: 'cs@university.edu',
    phone: '+123456789',
    officeLocation: 'Block B, Room 110',
    website: 'https://university.edu/departments/cs',
    facultyInitial: 'IT'
  },
  {
    name: 'Information Systems',
    initial: 'IS',
    code: 'IT-02',
    description: 'Department of Information Systems under IT Faculty.',
    headOfDepartment: 'Dr. John Doe',
    email: 'is@university.edu',
    phone: '+123456790',
    officeLocation: 'Block B, Room 120',
    website: 'https://university.edu/departments/is',
    facultyInitial: 'IT'
  },
  // EE Faculty Departments
  {
    name: 'Power Engineering',
    initial: 'PE',
    code: 'EE-01',
    description: 'Department of Power Engineering under EE Faculty.',
    headOfDepartment: 'Dr. Jane Smith',
    email: 'pe@university.edu',
    phone: '+123456791',
    officeLocation: 'Block C, Room 210',
    website: 'https://university.edu/departments/pe',
    facultyInitial: 'EE'
  },
  {
    name: 'Electronics',
    initial: 'EL',
    code: 'EE-02',
    description: 'Department of Electronics under EE Faculty.',
    headOfDepartment: 'Dr. Emily Clark',
    email: 'el@university.edu',
    phone: '+123456792',
    officeLocation: 'Block C, Room 220',
    website: 'https://university.edu/departments/el',
    facultyInitial: 'EE'
  },
  // ME Faculty Departments
  {
    name: 'Thermal Engineering',
    initial: 'TE',
    code: 'ME-01',
    description: 'Department of Thermal Engineering under ME Faculty.',
    headOfDepartment: 'Dr. Robert Brown',
    email: 'te@university.edu',
    phone: '+123456793',
    officeLocation: 'Block D, Room 310',
    website: 'https://university.edu/departments/te',
    facultyInitial: 'ME'
  },
  {
    name: 'Design Engineering',
    initial: 'DE',
    code: 'ME-02',
    description: 'Department of Design Engineering under ME Faculty.',
    headOfDepartment: 'Prof. Ahmed Khan',
    email: 'de@university.edu',
    phone: '+123456794',
    officeLocation: 'Block D, Room 320',
    website: 'https://university.edu/departments/de',
    facultyInitial: 'ME'
  },
  // CE Faculty Departments
  {
    name: 'Structural Engineering',
    initial: 'SE',
    code: 'CE-01',
    description: 'Department of Structural Engineering under CE Faculty.',
    headOfDepartment: 'Prof. Maria Lee',
    email: 'se@university.edu',
    phone: '+123456795',
    officeLocation: 'Block G, Room 610',
    website: 'https://university.edu/departments/se',
    facultyInitial: 'CE'
  },
  {
    name: 'Environmental Engineering',
    initial: 'ENV',
    code: 'CE-02',
    description: 'Department of Environmental Engineering under CE Faculty.',
    headOfDepartment: 'Dr. William Turner',
    email: 'envce@university.edu',
    phone: '+123456796',
    officeLocation: 'Block G, Room 620',
    website: 'https://university.edu/departments/envce',
    facultyInitial: 'CE'
  },
  // BA Faculty Departments
  {
    name: 'Management',
    initial: 'MGMT',
    code: 'BA-01',
    description: 'Department of Management under BA Faculty.',
    headOfDepartment: 'Dr. Olivia White',
    email: 'mgmt@university.edu',
    phone: '+123456797',
    officeLocation: 'Block E, Room 410',
    website: 'https://university.edu/departments/mgmt',
    facultyInitial: 'BA'
  },
  {
    name: 'Finance',
    initial: 'FIN',
    code: 'BA-02',
    description: 'Department of Finance under BA Faculty.',
    headOfDepartment: 'Dr. Henry Green',
    email: 'fin@university.edu',
    phone: '+123456798',
    officeLocation: 'Block E, Room 420',
    website: 'https://university.edu/departments/fin',
    facultyInitial: 'BA'
  },
  // HU Faculty Departments
  {
    name: 'English',
    initial: 'ENG',
    code: 'HU-01',
    description: 'Department of English under HU Faculty.',
    headOfDepartment: 'Dr. Sophia Black',
    email: 'eng@university.edu',
    phone: '+123456799',
    officeLocation: 'Block F, Room 510',
    website: 'https://university.edu/departments/eng',
    facultyInitial: 'HU'
  },
  {
    name: 'History',
    initial: 'HIST',
    code: 'HU-02',
    description: 'Department of History under HU Faculty.',
    headOfDepartment: 'Dr. Michael Adams',
    email: 'hist@university.edu',
    phone: '+123456800',
    officeLocation: 'Block F, Room 520',
    website: 'https://university.edu/departments/hist',
    facultyInitial: 'HU'
  },
  // LAW Faculty Departments
  {
    name: 'Public Law',
    initial: 'PL',
    code: 'LAW-01',
    description: 'Department of Public Law under Law Faculty.',
    headOfDepartment: 'Dr. William Turner',
    email: 'pl@university.edu',
    phone: '+123456801',
    officeLocation: 'Block I, Room 810',
    website: 'https://university.edu/departments/pl',
    facultyInitial: 'LAW'
  },
  {
    name: 'Private Law',
    initial: 'PRL',
    code: 'LAW-02',
    description: 'Department of Private Law under Law Faculty.',
    headOfDepartment: 'Dr. Olivia White',
    email: 'prl@university.edu',
    phone: '+123456802',
    officeLocation: 'Block I, Room 820',
    website: 'https://university.edu/departments/prl',
    facultyInitial: 'LAW'
  },
  // MED Faculty Departments
  {
    name: 'Surgery',
    initial: 'SUR',
    code: 'MED-01',
    description: 'Department of Surgery under Medicine Faculty.',
    headOfDepartment: 'Dr. Henry Green',
    email: 'sur@university.edu',
    phone: '+123456803',
    officeLocation: 'Block J, Room 910',
    website: 'https://university.edu/departments/sur',
    facultyInitial: 'MED'
  },
  {
    name: 'Internal Medicine',
    initial: 'IM',
    code: 'MED-02',
    description: 'Department of Internal Medicine under Medicine Faculty.',
    headOfDepartment: 'Dr. Sophia Black',
    email: 'im@university.edu',
    phone: '+123456804',
    officeLocation: 'Block J, Room 920',
    website: 'https://university.edu/departments/im',
    facultyInitial: 'MED'
  },
  // PH Faculty Departments
  {
    name: 'Pharmaceutical Chemistry',
    initial: 'PC',
    code: 'PH-01',
    description: 'Department of Pharmaceutical Chemistry under Pharmacy Faculty.',
    headOfDepartment: 'Dr. Michael Adams',
    email: 'pc@university.edu',
    phone: '+123456805',
    officeLocation: 'Block K, Room 1010',
    website: 'https://university.edu/departments/pc',
    facultyInitial: 'PH'
  },
  {
    name: 'Pharmacology',
    initial: 'PHARM',
    code: 'PH-02',
    description: 'Department of Pharmacology under Pharmacy Faculty.',
    headOfDepartment: 'Prof. Linda Scott',
    email: 'pharm@university.edu',
    phone: '+123456806',
    officeLocation: 'Block K, Room 1020',
    website: 'https://university.edu/departments/pharm',
    facultyInitial: 'PH'
  },
  // SCI Faculty Departments
  {
    name: 'Physics',
    initial: 'PHY',
    code: 'SCI-01',
    description: 'Department of Physics under Science Faculty.',
    headOfDepartment: 'Dr. Richard Evans',
    email: 'phy@university.edu',
    phone: '+123456807',
    officeLocation: 'Block L, Room 1110',
    website: 'https://university.edu/departments/phy',
    facultyInitial: 'SCI'
  },
  {
    name: 'Chemistry',
    initial: 'CHEM',
    code: 'SCI-02',
    description: 'Department of Chemistry under Science Faculty.',
    headOfDepartment: 'Dr. Barbara King',
    email: 'chem@university.edu',
    phone: '+123456808',
    officeLocation: 'Block L, Room 1120',
    website: 'https://university.edu/departments/chem',
    facultyInitial: 'SCI'
  },
  // EDU Faculty Departments
  {
    name: 'Primary Education',
    initial: 'PED',
    code: 'EDU-01',
    description: 'Department of Primary Education under Education Faculty.',
    headOfDepartment: 'Dr. Alice Rivers',
    email: 'ped@university.edu',
    phone: '+123456809',
    officeLocation: 'Block M, Room 1210',
    website: 'https://university.edu/departments/ped',
    facultyInitial: 'EDU'
  },
  {
    name: 'Curriculum Studies',
    initial: 'CUR',
    code: 'EDU-02',
    description: 'Department of Curriculum Studies under Education Faculty.',
    headOfDepartment: 'Dr. Mark Jensen',
    email: 'cur@university.edu',
    phone: '+123456810',
    officeLocation: 'Block M, Room 1220',
    website: 'https://university.edu/departments/cur',
    facultyInitial: 'EDU'
  },
  // FA Faculty Departments
  {
    name: 'Visual Arts',
    initial: 'VA',
    code: 'FA-01',
    description: 'Department of Visual Arts under Fine Arts Faculty.',
    headOfDepartment: 'Dr. Priya Nair',
    email: 'va@university.edu',
    phone: '+123456811',
    officeLocation: 'Block N, Room 1310',
    website: 'https://university.edu/departments/va',
    facultyInitial: 'FA'
  },
  {
    name: 'Performing Arts',
    initial: 'PA',
    code: 'FA-02',
    description: 'Department of Performing Arts under Fine Arts Faculty.',
    headOfDepartment: 'Dr. Leo Martinez',
    email: 'pa@university.edu',
    phone: '+123456812',
    officeLocation: 'Block N, Room 1320',
    website: 'https://university.edu/departments/pa',
    facultyInitial: 'FA'
  },
  // ARCH Faculty Departments
  {
    name: 'Urban Design',
    initial: 'UD',
    code: 'ARCH-01',
    description: 'Department of Urban Design under Architecture Faculty.',
    headOfDepartment: 'Dr. Hannah Kim',
    email: 'ud@university.edu',
    phone: '+123456813',
    officeLocation: 'Block O, Room 1410',
    website: 'https://university.edu/departments/ud',
    facultyInitial: 'ARCH'
  },
  {
    name: 'Landscape Architecture',
    initial: 'LA',
    code: 'ARCH-02',
    description: 'Department of Landscape Architecture under Architecture Faculty.',
    headOfDepartment: 'Dr. Omar Farouk',
    email: 'la@university.edu',
    phone: '+123456814',
    officeLocation: 'Block O, Room 1420',
    website: 'https://university.edu/departments/la',
    facultyInitial: 'ARCH'
  },
  // AG Faculty Departments
  {
    name: 'Crop Science',
    initial: 'CSCI',
    code: 'AG-01',
    description: 'Department of Crop Science under Agriculture Faculty.',
    headOfDepartment: 'Dr. Grace Lee',
    email: 'csci@university.edu',
    phone: '+123456815',
    officeLocation: 'Block P, Room 1510',
    website: 'https://university.edu/departments/csci',
    facultyInitial: 'AG'
  },
  {
    name: 'Animal Science',
    initial: 'ASCI',
    code: 'AG-02',
    description: 'Department of Animal Science under Agriculture Faculty.',
    headOfDepartment: 'Dr. Samuel Osei',
    email: 'asci@university.edu',
    phone: '+123456816',
    officeLocation: 'Block P, Room 1520',
    website: 'https://university.edu/departments/asci',
    facultyInitial: 'AG'
  },
  // ENV Faculty Departments
  {
    name: 'Earth Sciences',
    initial: 'ES',
    code: 'ENV-01',
    description: 'Department of Earth Sciences under Environmental Sciences Faculty.',
    headOfDepartment: 'Dr. Julia Novak',
    email: 'es@university.edu',
    phone: '+123456817',
    officeLocation: 'Block AB, Room 2710',
    website: 'https://university.edu/departments/es',
    facultyInitial: 'ENV'
  },
  {
    name: 'Sustainability Studies',
    initial: 'SS',
    code: 'ENV-02',
    description: 'Department of Sustainability Studies under Environmental Sciences Faculty.',
    headOfDepartment: 'Dr. Peter Mensah',
    email: 'ssenv@university.edu',
    phone: '+123456818',
    officeLocation: 'Block AB, Room 2720',
    website: 'https://university.edu/departments/ssenv',
    facultyInitial: 'ENV'
  },
  // SS Faculty Departments
  {
    name: 'Psychology',
    initial: 'PSY',
    code: 'SS-01',
    description: 'Department of Psychology under Social Sciences Faculty.',
    headOfDepartment: 'Dr. Isabella Rossi',
    email: 'psy@university.edu',
    phone: '+123456819',
    officeLocation: 'Block AC, Room 2810',
    website: 'https://university.edu/departments/psy',
    facultyInitial: 'SS'
  },
  {
    name: 'Sociology',
    initial: 'SOC',
    code: 'SS-02',
    description: 'Department of Sociology under Social Sciences Faculty.',
    headOfDepartment: 'Dr. Barbara King',
    email: 'soc@university.edu',
    phone: '+123456820',
    officeLocation: 'Block AC, Room 2820',
    website: 'https://university.edu/departments/soc',
    facultyInitial: 'SS'
  },
  // MATH Faculty Departments
  {
    name: 'Mathematics',
    initial: 'MATH',
    code: 'MATH-01',
    description: 'Department of Mathematics under Mathematics and Statistics Faculty.',
    headOfDepartment: 'Dr. Leo Martinez',
    email: 'math@university.edu',
    phone: '+123456821',
    officeLocation: 'Block AD, Room 2910',
    website: 'https://university.edu/departments/math',
    facultyInitial: 'MATH'
  },
  {
    name: 'Statistics',
    initial: 'STAT',
    code: 'MATH-02',
    description: 'Department of Statistics under Mathematics and Statistics Faculty.',
    headOfDepartment: 'Dr. Hannah Kim',
    email: 'stat@university.edu',
    phone: '+123456822',
    officeLocation: 'Block AD, Room 2920',
    website: 'https://university.edu/departments/stat',
    facultyInitial: 'MATH'
  },
  // CMS Faculty Departments
  {
    name: 'Journalism',
    initial: 'JOUR',
    code: 'CMS-01',
    description: 'Department of Journalism under Communication and Media Studies Faculty.',
    headOfDepartment: 'Dr. Omar Farouk',
    email: 'jour@university.edu',
    phone: '+123456823',
    officeLocation: 'Block AE, Room 3010',
    website: 'https://university.edu/departments/jour',
    facultyInitial: 'CMS'
  },
  {
    name: 'Media Studies',
    initial: 'MS',
    code: 'CMS-02',
    description: 'Department of Media Studies under Communication and Media Studies Faculty.',
    headOfDepartment: 'Dr. Grace Lee',
    email: 'ms@university.edu',
    phone: '+123456824',
    officeLocation: 'Block AE, Room 3020',
    website: 'https://university.edu/departments/ms',
    facultyInitial: 'CMS'
  },
  // PSIR Faculty Departments
  {
    name: 'Political Science',
    initial: 'PS',
    code: 'PSIR-01',
    description: 'Department of Political Science under Political Science and International Relations Faculty.',
    headOfDepartment: 'Dr. Samuel Osei',
    email: 'ps@university.edu',
    phone: '+123456825',
    officeLocation: 'Block AF, Room 3110',
    website: 'https://university.edu/departments/ps',
    facultyInitial: 'PSIR'
  },
  {
    name: 'International Relations',
    initial: 'IR',
    code: 'PSIR-02',
    description: 'Department of International Relations under Political Science and International Relations Faculty.',
    headOfDepartment: 'Dr. Julia Novak',
    email: 'ir@university.edu',
    phone: '+123456826',
    officeLocation: 'Block AF, Room 3120',
    website: 'https://university.edu/departments/ir',
    facultyInitial: 'PSIR'
  },
  // LIS Faculty Departments
  {
    name: 'Library Science',
    initial: 'LS',
    code: 'LIS-01',
    description: 'Department of Library Science under Library and Information Science Faculty.',
    headOfDepartment: 'Dr. Peter Mensah',
    email: 'ls@university.edu',
    phone: '+123456827',
    officeLocation: 'Block AG, Room 3210',
    website: 'https://university.edu/departments/ls',
    facultyInitial: 'LIS'
  },
  {
    name: 'Information Management',
    initial: 'IM',
    code: 'LIS-02',
    description: 'Department of Information Management under Library and Information Science Faculty.',
    headOfDepartment: 'Dr. Isabella Rossi',
    email: 'imlis@university.edu',
    phone: '+123456828',
    officeLocation: 'Block AG, Room 3220',
    website: 'https://university.edu/departments/imlis',
    facultyInitial: 'LIS'
  },
  // SSPE Faculty Departments
  {
    name: 'Sports Science',
    initial: 'SSCI',
    code: 'SSPE-01',
    description: 'Department of Sports Science under Sports Science and Physical Education Faculty.',
    headOfDepartment: 'Dr. Barbara King',
    email: 'ssci@university.edu',
    phone: '+123456829',
    officeLocation: 'Block AH, Room 3310',
    website: 'https://university.edu/departments/ssci',
    facultyInitial: 'SSPE'
  },
  {
    name: 'Physical Education',
    initial: 'PE',
    code: 'SSPE-02',
    description: 'Department of Physical Education under Sports Science and Physical Education Faculty.',
    headOfDepartment: 'Dr. Henry Green',
    email: 'pe@university.edu',
    phone: '+123456830',
    officeLocation: 'Block AH, Room 3320',
    website: 'https://university.edu/departments/pe',
    facultyInitial: 'SSPE'
  },
  // NUR Faculty Departments
  {
    name: 'Nursing Science',
    initial: 'NS',
    code: 'NUR-01',
    description: 'Department of Nursing Science under Nursing Faculty.',
    headOfDepartment: 'Dr. William Turner',
    email: 'ns@university.edu',
    phone: '+123456831',
    officeLocation: 'Block AI, Room 3410',
    website: 'https://university.edu/departments/ns',
    facultyInitial: 'NUR'
  },
  {
    name: 'Allied Health',
    initial: 'AH',
    code: 'NUR-02',
    description: 'Department of Allied Health under Nursing Faculty.',
    headOfDepartment: 'Dr. Michael Adams',
    email: 'ah@university.edu',
    phone: '+123456832',
    officeLocation: 'Block AI, Room 3420',
    website: 'https://university.edu/departments/ah',
    facultyInitial: 'NUR'
  },
  // VET Faculty Departments
  {
    name: 'Animal Health',
    initial: 'ANH',
    code: 'VET-01',
    description: 'Department of Animal Health under Veterinary Medicine Faculty.',
    headOfDepartment: 'Dr. Linda Scott',
    email: 'anh@university.edu',
    phone: '+123456833',
    officeLocation: 'Block AJ, Room 3510',
    website: 'https://university.edu/departments/anh',
    facultyInitial: 'VET'
  },
  {
    name: 'Veterinary Science',
    initial: 'VS',
    code: 'VET-02',
    description: 'Department of Veterinary Science under Veterinary Medicine Faculty.',
    headOfDepartment: 'Dr. Richard Evans',
    email: 'vs@university.edu',
    phone: '+123456834',
    officeLocation: 'Block AJ, Room 3520',
    website: 'https://university.edu/departments/vs',
    facultyInitial: 'VET'
  },
  // THM Faculty Departments
  {
    name: 'Tourism Management',
    initial: 'TM',
    code: 'THM-01',
    description: 'Department of Tourism Management under Tourism and Hospitality Faculty.',
    headOfDepartment: 'Dr. Barbara King',
    email: 'tm@university.edu',
    phone: '+123456835',
    officeLocation: 'Block AK, Room 3610',
    website: 'https://university.edu/departments/tm',
    facultyInitial: 'THM'
  },
  {
    name: 'Hospitality Management',
    initial: 'HM',
    code: 'THM-02',
    description: 'Department of Hospitality Management under Tourism and Hospitality Faculty.',
    headOfDepartment: 'Dr. Peter Mensah',
    email: 'hm@university.edu',
    phone: '+123456836',
    officeLocation: 'Block AK, Room 3620',
    website: 'https://university.edu/departments/hm',
    facultyInitial: 'THM'
  },
  // LSCM Faculty Departments
  {
    name: 'Logistics',
    initial: 'LOG',
    code: 'LSCM-01',
    description: 'Department of Logistics under Logistics and Supply Chain Management Faculty.',
    headOfDepartment: 'Dr. Isabella Rossi',
    email: 'log@university.edu',
    phone: '+123456837',
    officeLocation: 'Block AL, Room 3710',
    website: 'https://university.edu/departments/log',
    facultyInitial: 'LSCM'
  },
  {
    name: 'Supply Chain Management',
    initial: 'SCM',
    code: 'LSCM-02',
    description: 'Department of Supply Chain Management under Logistics and Supply Chain Management Faculty.',
    headOfDepartment: 'Dr. Grace Lee',
    email: 'scm@university.edu',
    phone: '+123456838',
    officeLocation: 'Block AL, Room 3720',
    website: 'https://university.edu/departments/scm',
    facultyInitial: 'LSCM'
  },
  // Add more sample departments for demonstration
  {
    name: 'Data Science',
    initial: 'DS',
    code: 'IT-03',
    description: 'Department of Data Science under IT Faculty.',
    headOfDepartment: 'Dr. Ayesha Siddiqui',
    email: 'ds@university.edu',
    phone: '+123456839',
    officeLocation: 'Block B, Room 130',
    website: 'https://university.edu/departments/ds',
    facultyInitial: 'IT'
  },
  {
    name: 'Robotics',
    initial: 'ROB',
    code: 'ME-03',
    description: 'Department of Robotics under ME Faculty.',
    headOfDepartment: 'Dr. Viktor Ivanov',
    email: 'rob@university.edu',
    phone: '+123456840',
    officeLocation: 'Block D, Room 330',
    website: 'https://university.edu/departments/rob',
    facultyInitial: 'ME'
  },
  {
    name: 'Biomedical Engineering',
    initial: 'BME',
    code: 'SCI-03',
    description: 'Department of Biomedical Engineering under Science Faculty.',
    headOfDepartment: 'Dr. Fatima Noor',
    email: 'bme@university.edu',
    phone: '+123456841',
    officeLocation: 'Block L, Room 1130',
    website: 'https://university.edu/departments/bme',
    facultyInitial: 'SCI'
  },
  {
    name: 'Environmental Biotechnology',
    initial: 'ENVB',
    code: 'ENV-03',
    description: 'Department of Environmental Biotechnology under Environmental Sciences Faculty.',
    headOfDepartment: 'Dr. Kenji Sato',
    email: 'envb@university.edu',
    phone: '+123456842',
    officeLocation: 'Block AB, Room 2730',
    website: 'https://university.edu/departments/envb',
    facultyInitial: 'ENV'
  },
  {
    name: 'Digital Media',
    initial: 'DM',
    code: 'CMS-03',
    description: 'Department of Digital Media under Communication and Media Studies Faculty.',
    headOfDepartment: 'Dr. Laura Chen',
    email: 'dm@university.edu',
    phone: '+123456843',
    officeLocation: 'Block AE, Room 3030',
    website: 'https://university.edu/departments/dm',
    facultyInitial: 'CMS'
  },
  {
    name: 'Food Science',
    initial: 'FSCI',
    code: 'AG-03',
    description: 'Department of Food Science under Agriculture Faculty.',
    headOfDepartment: 'Dr. Carlos Mendes',
    email: 'fsci@university.edu',
    phone: '+123456844',
    officeLocation: 'Block P, Room 1530',
    website: 'https://university.edu/departments/fsci',
    facultyInitial: 'AG'
  },
  {
    name: 'Marine Biology',
    initial: 'MB',
    code: 'SCI-04',
    description: 'Department of Marine Biology under Science Faculty.',
    headOfDepartment: 'Dr. Ingrid Olsen',
    email: 'mb@university.edu',
    phone: '+123456845',
    officeLocation: 'Block L, Room 1140',
    website: 'https://university.edu/departments/mb',
    facultyInitial: 'SCI'
  },
  {
    name: 'Cybersecurity',
    initial: 'CYB',
    code: 'IT-04',
    description: 'Department of Cybersecurity under IT Faculty.',
    headOfDepartment: 'Dr. Marcus Lee',
    email: 'cyb@university.edu',
    phone: '+123456846',
    officeLocation: 'Block B, Room 140',
    website: 'https://university.edu/departments/cyb',
    facultyInitial: 'IT'
  },
  {
    name: 'Renewable Energy',
    initial: 'RE',
    code: 'EE-03',
    description: 'Department of Renewable Energy under EE Faculty.',
    headOfDepartment: 'Dr. Sara Elbaz',
    email: 're@university.edu',
    phone: '+123456847',
    officeLocation: 'Block C, Room 230',
    website: 'https://university.edu/departments/re',
    facultyInitial: 'EE'
  },
  {
    name: 'Sports Management',
    initial: 'SM',
    code: 'SSPE-03',
    description: 'Department of Sports Management under Sports Science and Physical Education Faculty.',
    headOfDepartment: 'Dr. Tomislav Novak',
    email: 'sm@university.edu',
    phone: '+123456848',
    officeLocation: 'Block AH, Room 3330',
    website: 'https://university.edu/departments/sm',
    facultyInitial: 'SSPE'
  }
]
