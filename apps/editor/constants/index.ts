export const ELEMENT_DATA_ATTRIBUTE_ID = 'data-naija-spell-checker-element-id';
export const HIGHLIGHT_DATA_ATTRIBUTE_ID =
  'data-naija-spell-checker-highlight-id';
export const SAMPLE_TEXT = `Make I tell you, life na journey wey no get one road. Sometimes,
              you go waka for <b>smooth road</b>, everything go dey jolly, but other
              times, e fit be say na wahala full the road. Na why dem talk say,
              no matter how e be, you gatz hold strong, no give up. As you dey
              hustle, you go see say no be every day go soft, but na the ginger
              wey you carry for mind go make the wahala no too heavy. Even if
              rain fall or sun shine, you gatz waka your waka because na
              persistence dey bring beta result. Last last, e no matter how slow
              or fast you dey go, as long as you no sidon dey look, you go reach
              where you wan reach.`;

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
        url: '#',
      },
      {
        label: 'Translator',
        url: 'https://translate.naija.guru',
      },
      {
        label: 'Grammar guide',
        url: `${MAIN_WEBSITE_DOMAIN}/grammar`,
      },
    ],
  },
  {
    label: 'Content',
    routes: [
      {
        label: 'Stories',
        url: `${MAIN_WEBSITE_DOMAIN}/content/stories`,
      },
      {
        label: ' LingQ Mini Stories',
        url: `${MAIN_WEBSITE_DOMAIN}/content/mini-stories`,
      },
      {
        label: 'Poems',
        url: `${MAIN_WEBSITE_DOMAIN}/content/poems`,
      },
    ],
  },
  {
    label: 'Community',
    url: 'https://community.naija.guru',
  },
];
