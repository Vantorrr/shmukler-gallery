import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'announcement',
  title: 'Анонсы',
  type: 'document',
  icon: () => '📢',
  fields: [
    defineField({
      name: 'title',
      title: 'Заголовок анонса',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'text',
      title: 'Текст',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'link',
      title: 'Ссылка (куда ведёт кнопка)',
      type: 'url',
    }),
    defineField({
      name: 'linkLabel',
      title: 'Текст кнопки',
      type: 'string',
      placeholder: 'Подробнее',
    }),
    defineField({
      name: 'isActive',
      title: 'Показывать на сайте',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'expiresAt',
      title: 'Показывать до (дата)',
      type: 'date',
      description: 'После этой даты анонс автоматически скрывается',
      options: { dateFormat: 'DD.MM.YYYY' },
    }),
    defineField({
      name: 'type',
      title: 'Тип',
      type: 'string',
      options: {
        list: [
          { title: '📢 Объявление', value: 'info' },
          { title: '🎉 Событие',    value: 'event' },
          { title: '🔥 Акция',      value: 'promo' },
        ],
        layout: 'radio',
      },
      initialValue: 'info',
    }),
  ],
  preview: {
    select: { title: 'title', isActive: 'isActive', type: 'type' },
    prepare({ title, isActive, type }) {
      const typeEmoji = type === 'event' ? '🎉' : type === 'promo' ? '🔥' : '📢'
      return { title: `${typeEmoji} ${title}`, subtitle: isActive ? '✅ Активен' : '⏸ Скрыт' }
    },
  },
})
