/**
 * Types for the curated course library in `/content`.
 *
 * IMPORTANT — this is NOT the same thing as Agent 1's `Concept` model.
 *   - Agent 1's concepts are PER-STUDENT and extracted from that student's own uploads,
 *     carrying `confidence` and `evidence` because they are machine-derived claims.
 *   - These are a GLOBAL, editorially curated reference skeleton taken from published
 *     curricula (HEC/NCEAC/PEC/PMDC/ACCA), with a cited `source`.
 * They meet at `course_key`. The UI labels them separately so a student never mistakes a
 * reference syllabus for a measurement of their own material.
 */

export type BloomLevel = 'remember' | 'understand' | 'apply' | 'analyze' | 'evaluate' | 'create';
export type PrerequisiteStrength = 'hard' | 'soft';
export type AssessmentStyle = 'mcq' | 'short_answer' | 'numerical' | 'practical' | 'essay' | 'case_study';

export interface ContentPrerequisite {
  id: string;
  strength: PrerequisiteStrength;
}

export interface ContentConcept {
  /** Globally unique, namespaced `{field}.{course}.{concept}`. */
  id: string;
  name: string;
  name_ur?: string;
  summary: string;
  bloom: BloomLevel;
  /** 1 (introductory) … 5 (advanced). */
  difficulty: 1 | 2 | 3 | 4 | 5;
  estimated_minutes: number;
  prerequisites: ContentPrerequisite[];
  assessment: AssessmentStyle;
  keywords: string[];
}

export interface ContentSource {
  name: string;
  url?: string;
  retrieved: string;
}

export interface ContentAuthoring {
  /** `curated` = written from cited curricula. `ai_generated` = produced by the generator script. */
  method: 'curated' | 'ai_generated';
  by: string;
  date: string;
  model?: string | null;
  reviewed?: boolean;
}

export interface ContentCourse {
  schema_version: string;
  course_id: string;
  field: string;
  category: string;
  title: string;
  title_ur?: string;
  description: string;
  level: 'foundation' | 'undergraduate' | 'postgraduate' | 'professional';
  credit_hours?: { total: number; theory: number; lab: number };
  estimated_hours: number;
  accreditation: string;
  source: ContentSource;
  authoring: ContentAuthoring;
  outcomes: string[];
  concepts: ContentConcept[];
}

export interface TaxonomyCategory {
  id: string;
  name: string;
  name_ur?: string;
  courses: string[];
}

export interface TaxonomyField {
  id: string;
  name: string;
  name_ur?: string;
  description: string;
  categories: TaxonomyCategory[];
}

export interface Taxonomy {
  schema_version: string;
  generated_at: string;
  fields: TaxonomyField[];
}

export interface LibraryIndexEntry {
  course_id: string;
  field: string;
  category: string;
  title: string;
  title_ur?: string;
  level: string;
  concept_count: number;
  estimated_hours: number;
  accreditation: string;
  authoring_method: string;
  path: string;
}

export interface LibraryIndex {
  schema_version: string;
  generated_at: string;
  field_count: number;
  category_count: number;
  course_count: number;
  concept_count: number;
  courses: LibraryIndexEntry[];
}
