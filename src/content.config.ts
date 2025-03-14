import { file } from "astro/loaders";
import { defineCollection, z } from "astro:content";

// Schema Definitions 
const skinnyBookSchema = z.object({
  id: z.string(),
  title: z.string(),
  author: z.string(),
  description: z.string(),
  link: z.string().url(),
});

const collaboratorSchema = z.object({
  id: z.string(),
  name: z.string(),
  title: z.string(),
  description: z.string(),
  bookTitle: z.string(),
  bookUrl: z.string(),
  linkedin: z.string().url(),
});

// Collection Definitions
const skinnyBooks = defineCollection({
  loader: file("src/content/skinnyBooks.json"),
  schema: skinnyBookSchema,
});

const collaborators = defineCollection({
  loader: file("src/content/collaborators.json"),
  schema: collaboratorSchema,
});


// Export inferred types of collection schemas
export type Book = z.infer<typeof skinnyBookSchema>;
export type Collaborator = z.infer<typeof collaboratorSchema>;


// Export Collections
export const collections = { skinnyBooks, collaborators };
