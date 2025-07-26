const MAIN_WEBSITE_DOMAIN = 'https://naija.guru';

export const HEADER_ROUTES = [
  {
    label: 'Home',
    url: MAIN_WEBSITE_DOMAIN,
  },
  {
    label: 'Tools',
    routes: [
      {
        label: 'Dictionary',
        url: `${MAIN_WEBSITE_DOMAIN}/dictionary`,
      },
      {
        label: 'Spell Checker',
        url: 'https://spellchecker.naija.guru',
      },
      {
        label: 'Translator',
        url: 'https://translate.naija.guru',
      },
      {
        label: 'Grammar Guide',
        url: `${MAIN_WEBSITE_DOMAIN}/grammar`,
      },
    ],
  },
  {
    label: 'Literature',
    routes: [
      {
        label: 'Stories',
        url: `${MAIN_WEBSITE_DOMAIN}/literature/stories`,
      },
      {
        label: 'Mini Stories (LingQ)',
        url: `${MAIN_WEBSITE_DOMAIN}/literature/mini-stories`,
      },
      {
        label: 'Poems',
        url: `${MAIN_WEBSITE_DOMAIN}/literature/poems`,
      },
    ],
  },
  {
    label: 'Community',
    url: 'https://community.naija.guru',
  },
];
