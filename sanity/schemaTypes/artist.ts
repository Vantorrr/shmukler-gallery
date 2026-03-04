import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'artist',
  title: 'Художники',
  type: 'document',
  icon: () => '👤',
  fields: [
    defineField({
      name: 'name',
      title: 'Имя художника',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL (slug)',
      type: 'slug',
      description: 'Генерируется автоматически из имени',
      options: { source: 'name', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'portrait',
      title: 'Портрет / фото',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'bio',
      title: 'Биография',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'birthYear',
      title: 'Год рождения',
      type: 'number',
    }),
    defineField({
      name: 'city',
      title: 'Город',
      type: 'string',
    }),
    defineField({
      name: 'specialization',
      title: 'Специализация (например: Живопись, акрил)',
      type: 'string',
    }),
    defineField({
      name: 'cv',
      title: 'CV / Выставки',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'instagram',
      title: 'Instagram (ссылка)',
      type: 'url',
    }),
    defineField({
      name: 'isResident',
      title: 'Резидент галереи',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'specialization',
      media: 'portrait',
      isResident: 'isResident',
    },
    prepare({ title, subtitle, media, isResident }) {
      return { title: (isResident ? '⭐ ' : '') + title, subtitle, media }
    },
  },
})
