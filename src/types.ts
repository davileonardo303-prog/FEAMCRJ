export interface MartialArt {
  id: string;
  name: string;
  description: string;
  category: 'Percussão' | 'Grappling' | 'Mista' | 'Tradicional';
  origin: string;
  icon: string; // Icon identifier
  departmentHead: string;
  majorCompetitions: string[];
}

export interface Tournament {
  id: string;
  title: string;
  date: string;
  location: string;
  city: string;
  registrationDeadline: string;
  entryFee: number;
  status: 'open' | 'closed' | 'upcoming';
  modalities: string[];
  registeredCount: number;
  description: string;
  image: string;
}

export interface Athlete {
  id: string;
  name: string;
  cpf: string;
  dateOfBirth: string;
  gender: 'M' | 'F';
  email: string;
  phone: string;
  rank: string; // e.g., 'Faixa Preta 1º Dan', 'Graduado'
  modality: string;
  academyName: string;
  registrationNumber: string; // e.g., RJ-2026-081
  status: 'active' | 'suspended' | 'pending';
  affiliationDate: string;
}

export interface Academy {
  id: string;
  name: string;
  headInstructor: string;
  address: string;
  neighborhood: string;
  city: string;
  phone: string;
  email: string;
  modalities: string[];
  certifiedUntil: string;
  status: 'active' | 'expired';
}

export interface News {
  id: string;
  title: string;
  category: 'Campeonato' | 'Filiação' | 'Curso' | 'Comunicado';
  date: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
}

export interface Document {
  id: string;
  title: string;
  category: 'Regulamento' | 'Taxas' | 'Manual' | 'Formulário';
  uploadDate: string;
  size: string;
  format: 'PDF' | 'DOCX';
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  date: string;
}
