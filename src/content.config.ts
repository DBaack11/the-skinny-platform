import { file } from "astro/loaders";
import { defineCollection, z } from "astro:content";

const skinnyBookSchema = z.object({
  id: z.string(),
  title: z.string(),
  author: z.string(),
  description: z.string(),
  link: z.string().url(),
});

const skinnyBooks = defineCollection({
  loader: file("src/content/skinnyBooks.json"),
  schema: skinnyBookSchema,
});

export type Book = z.infer<typeof skinnyBookSchema>;

export const collections = { skinnyBooks };
