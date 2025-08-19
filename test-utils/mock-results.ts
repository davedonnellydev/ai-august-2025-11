import { AxeResults } from 'axe-core';

export const sampleResults: AxeResults = {
  testEngine: {
    name: 'axe-core',
    version: '4.8.3',
  },
  testRunner: {
    name: 'axe',
  },
  testEnvironment: {
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:141.0) Gecko/20100101 Firefox/141.0',
    windowWidth: 920,
    windowHeight: 788,
    orientationAngle: 0,
    orientationType: 'landscape-primary',
  },
  timestamp: '2025-08-19T02:39:25.289Z',
  url: 'https://davedonnelly.dev/',
  toolOptions: {
    reporter: 'v1',
  },
  inapplicable: [],
  passes: [
    {
      id: 'aria-allowed-role',
      impact: null,
      tags: ['cat.aria', 'best-practice'],
      description:
        'Ensures role attribute has an appropriate value for the element',
      help: 'ARIA role should be appropriate for the element',
      helpUrl:
        'https://dequeuniversity.com/rules/axe/4.8/aria-allowed-role?application=axeAPI',
      nodes: [
        {
          any: [],
          all: [],
          none: [],
          impact: null,
          html: '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="file-arrow-down" class="svg-inline--fa fa-file-arrow-down " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">',
          target: ['.fa-file-arrow-down'],
        },
        {
          any: [],
          all: [],
          none: [],
          impact: null,
          html: '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="bars" class="svg-inline--fa fa-bars " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">',
          target: ['.fa-bars'],
        },
        {
          any: [],
          all: [],
          none: [],
          impact: null,
          html: '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="xmark" class="svg-inline--fa fa-xmark " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">',
          target: ['.fa-xmark'],
        },
        {
          any: [],
          all: [],
          none: [],
          impact: null,
          html: '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="link" class="svg-inline--fa fa-link " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">',
          target: [
            '.all-projects-project:nth-child(1) > .project > a[rel="noopener noreferrer"][target="_blank"] > .project-container > .project-link > .project-link-icon > .fa-link[data-icon="link"][viewBox="0 0 640 512"]',
          ],
        },
        {
          any: [
            {
              id: 'aria-allowed-role',
              data: null,
              relatedNodes: [],
              impact: 'minor',
              message: 'ARIA role is allowed for given element',
            },
          ],
          all: [],
          none: [],
          impact: null,
          html: '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="link" class="svg-inline--fa fa-link " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">',
          target: [
            '.all-projects-project:nth-child(2) > .project > a[rel="noopener noreferrer"][target="_blank"] > .project-container > .project-link > .project-link-icon > .fa-link[data-icon="link"][viewBox="0 0 640 512"]',
          ],
        },
      ],
    },
    {
      id: 'aria-hidden-body',
      impact: null,
      tags: ['cat.aria', 'wcag2a', 'wcag412', 'EN-301-549', 'EN-9.4.1.2'],
      description:
        'Ensures aria-hidden="true" is not present on the document body.',
      help: 'aria-hidden="true" must not be present on the document body',
      helpUrl:
        'https://dequeuniversity.com/rules/axe/4.8/aria-hidden-body?application=axeAPI',
      nodes: [
        {
          any: [],
          all: [],
          none: [],
          impact: null,
          html: '<body>',
          target: ['body'],
        },
      ],
    },
    {
      id: 'aria-hidden-focus',
      impact: null,
      tags: [
        'cat.name-role-value',
        'wcag2a',
        'wcag412',
        'TTv5',
        'TT6.a',
        'EN-301-549',
        'EN-9.4.1.2',
      ],
      description:
        'Ensures aria-hidden elements are not focusable nor contain focusable elements',
      help: 'ARIA hidden element must not be focusable or contain focusable elements',
      helpUrl:
        'https://dequeuniversity.com/rules/axe/4.8/aria-hidden-focus?application=axeAPI',
      nodes: [
        {
          any: [],
          all: [],
          none: [],
          impact: null,
          html: '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="file-arrow-down" class="svg-inline--fa fa-file-arrow-down " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">',
          target: ['.fa-file-arrow-down'],
        },
        {
          any: [],
          all: [],
          none: [],
          impact: null,
          html: '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="bars" class="svg-inline--fa fa-bars " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">',
          target: ['.fa-bars'],
        },
        {
          any: [],
          all: [],
          none: [],
          impact: null,
          html: '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="xmark" class="svg-inline--fa fa-xmark " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">',
          target: ['.fa-xmark'],
        },
      ],
    },
  ],
  incomplete: [],
  violations: [
    {
      id: 'button-name',
      impact: 'critical',
      tags: [
        'cat.name-role-value',
        'wcag2a',
        'wcag412',
        'section508',
        'section508.22.a',
        'TTv5',
        'TT6.a',
        'EN-301-549',
        'EN-9.4.1.2',
        'ACT',
      ],
      description: 'Ensures buttons have discernible text',
      help: 'Buttons must have discernible text',
      helpUrl:
        'https://dequeuniversity.com/rules/axe/4.8/button-name?application=axeAPI',
      nodes: [
        {
          any: [],
          all: [],
          none: [],
          impact: 'critical',
          html: '<button id="flylighter-previous-capture-close"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m7 7l10 10M7 17L17 7"></path></svg></button>',
          target: ['#flylighter-previous-capture-close'],
          failureSummary:
            'Fix any of the following:\n  Element does not have inner text that is visible to screen readers\n  aria-label attribute does not exist or is empty\n  aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty\n  Element has no title attribute\n  Element\'s default semantics were not overridden with role="none" or role="presentation"',
        },
      ],
    },
    {
      id: 'color-contrast',
      impact: 'serious',
      tags: [
        'cat.color',
        'wcag2aa',
        'wcag143',
        'TTv5',
        'TT13.c',
        'EN-301-549',
        'EN-9.1.4.3',
        'ACT',
      ],
      description:
        'Ensures the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds',
      help: 'Elements must meet minimum color contrast ratio thresholds',
      helpUrl:
        'https://dequeuniversity.com/rules/axe/4.8/color-contrast?application=axeAPI',
      nodes: [
        {
          any: [],
          all: [],
          none: [],
          impact: 'serious',
          html: '<a href="/about">About</a>',
          target: ['.nav-item:nth-child(2) > a[href$="about"]'],
          failureSummary:
            'Fix any of the following:\n  Element has insufficient color contrast of 3.04 (foreground color: #06a694, background color: #ffffff, font size: 10.8pt (14.4px), font weight: bold). Expected contrast ratio of 4.5:1',
        },
      ],
    },
    {
      id: 'region',
      impact: 'moderate',
      tags: ['cat.keyboard', 'best-practice'],
      description: 'Ensures all page content is contained by landmarks',
      help: 'All page content should be contained by landmarks',
      helpUrl:
        'https://dequeuniversity.com/rules/axe/4.8/region?application=axeAPI',
      nodes: [
        {
          any: [],
          all: [],
          none: [],
          impact: 'moderate',
          html: '<div style="margin-bottom: 1px; padding-left: 0.1875rem;">Previously captured</div>',
          target: ['#flylighter-previous-capture > div'],
          failureSummary:
            'Fix any of the following:\n  Some page content is not contained by landmarks',
        },
      ],
    },
  ],
};

export const sampleResultsNoViolations: AxeResults = {
  testEngine: {
    name: 'axe-core',
    version: '4.8.3',
  },
  testRunner: {
    name: 'axe',
  },
  testEnvironment: {
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:141.0) Gecko/20100101 Firefox/141.0',
    windowWidth: 920,
    windowHeight: 788,
    orientationAngle: 0,
    orientationType: 'landscape-primary',
  },
  timestamp: '2025-08-19T02:39:25.289Z',
  url: 'https://davedonnelly.dev/',
  toolOptions: {
    reporter: 'v1',
  },
  inapplicable: [],
  passes: [
    {
      id: 'aria-allowed-role',
      impact: null,
      tags: ['cat.aria', 'best-practice'],
      description:
        'Ensures role attribute has an appropriate value for the element',
      help: 'ARIA role should be appropriate for the element',
      helpUrl:
        'https://dequeuniversity.com/rules/axe/4.8/aria-allowed-role?application=axeAPI',
      nodes: [
        {
          any: [],
          all: [],
          none: [],
          impact: null,
          html: '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="file-arrow-down" class="svg-inline--fa fa-file-arrow-down " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">',
          target: ['.fa-file-arrow-down'],
        },
        {
          any: [],
          all: [],
          none: [],
          impact: null,
          html: '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="bars" class="svg-inline--fa fa-bars " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">',
          target: ['.fa-bars'],
        },
        {
          any: [],
          all: [],
          none: [],
          impact: null,
          html: '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="xmark" class="svg-inline--fa fa-xmark " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">',
          target: ['.fa-xmark'],
        },
        {
          any: [],
          all: [],
          none: [],
          impact: null,
          html: '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="link" class="svg-inline--fa fa-link " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">',
          target: [
            '.all-projects-project:nth-child(1) > .project > a[rel="noopener noreferrer"][target="_blank"] > .project-container > .project-link > .project-link-icon > .fa-link[data-icon="link"][viewBox="0 0 640 512"]',
          ],
        },
        {
          any: [
            {
              id: 'aria-allowed-role',
              data: null,
              relatedNodes: [],
              impact: 'minor',
              message: 'ARIA role is allowed for given element',
            },
          ],
          all: [],
          none: [],
          impact: null,
          html: '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="link" class="svg-inline--fa fa-link " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">',
          target: [
            '.all-projects-project:nth-child(2) > .project > a[rel="noopener noreferrer"][target="_blank"] > .project-container > .project-link > .project-link-icon > .fa-link[data-icon="link"][viewBox="0 0 640 512"]',
          ],
        },
      ],
    },
    {
      id: 'aria-hidden-body',
      impact: null,
      tags: ['cat.aria', 'wcag2a', 'wcag412', 'EN-301-549', 'EN-9.4.1.2'],
      description:
        'Ensures aria-hidden="true" is not present on the document body.',
      help: 'aria-hidden="true" must not be present on the document body',
      helpUrl:
        'https://dequeuniversity.com/rules/axe/4.8/aria-hidden-body?application=axeAPI',
      nodes: [
        {
          any: [],
          all: [],
          none: [],
          impact: null,
          html: '<body>',
          target: ['body'],
        },
      ],
    },
    {
      id: 'aria-hidden-focus',
      impact: null,
      tags: [
        'cat.name-role-value',
        'wcag2a',
        'wcag412',
        'TTv5',
        'TT6.a',
        'EN-301-549',
        'EN-9.4.1.2',
      ],
      description:
        'Ensures aria-hidden elements are not focusable nor contain focusable elements',
      help: 'ARIA hidden element must not be focusable or contain focusable elements',
      helpUrl:
        'https://dequeuniversity.com/rules/axe/4.8/aria-hidden-focus?application=axeAPI',
      nodes: [
        {
          any: [],
          all: [],
          none: [],
          impact: null,
          html: '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="file-arrow-down" class="svg-inline--fa fa-file-arrow-down " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">',
          target: ['.fa-file-arrow-down'],
        },
        {
          any: [],
          all: [],
          none: [],
          impact: null,
          html: '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="bars" class="svg-inline--fa fa-bars " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">',
          target: ['.fa-bars'],
        },
        {
          any: [],
          all: [],
          none: [],
          impact: null,
          html: '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="xmark" class="svg-inline--fa fa-xmark " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">',
          target: ['.fa-xmark'],
        },
      ],
    },
  ],
  incomplete: [],
  violations: [],
};
