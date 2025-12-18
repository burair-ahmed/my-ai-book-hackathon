import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Physical AI & Humanoid Robotics',
  tagline: 'From Digital Intelligence to Embodied Systems',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://your-username.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/my-ai-book-hackathon/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'your-username', // Usually your GitHub org/user name.
  projectName: 'my-ai-book-hackathon', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: 'Physical AI & Humanoid Robotics',
      logo: {
        alt: 'Physical AI Book Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Book',
        },
        {
          href: 'https://github.com/facebook/docusaurus',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    // KaTeX configuration for robotics mathematics
    katex: {
      macros: {
        // Robotics-specific macros
        "\\R": "\\mathbb{R}",  // Real numbers
        "\\SE": "\\mathrm{SE}", // Special Euclidean group
        "\\SO": "\\mathrm{SO}", // Special Orthogonal group
        "\\q": "\\mathbf{q}",  // Joint angles vector
        "\\dq": "\\dot{\\mathbf{q}}", // Joint velocities
        "\\ddq": "\\ddot{\\mathbf{q}}", // Joint accelerations
        "\\tau": "\\boldsymbol{\\tau}", // Torques
        "\\J": "\\mathbf{J}", // Jacobian matrix
        "\\T": "\\mathbf{T}", // Transformation matrix
        "\\p": "\\mathbf{p}", // Position vector
        "\\Rmat": "\\mathbf{R}", // Rotation matrix
        "\\I": "\\mathbf{I}", // Inertia matrix
        "\\M": "\\mathbf{M}", // Mass matrix
        "\\C": "\\mathbf{C}", // Coriolis matrix
        "\\G": "\\mathbf{G}", // Gravity vector
        "\\x": "\\mathbf{x}", // State vector
        "\\u": "\\mathbf{u}", // Input vector
        "\\y": "\\mathbf{y}", // Output vector
        "\\K": "\\mathbf{K}", // Gain matrix
        "\\A": "\\mathbf{A}", // System matrix
        "\\B": "\\mathbf{B}", // Input matrix
        "\\Cmat": "\\mathbf{C}", // Output matrix
        "\\D": "\\mathbf{D}", // Feedthrough matrix
        "\\Q": "\\mathbf{Q}", // State covariance
        "\\Rmat": "\\mathbf{R}", // Measurement covariance
        "\\P": "\\mathbf{P}", // Error covariance
        "\\Kmat": "\\mathbf{K}", // Kalman gain
        "\\z": "\\mathbf{z}", // Measurement vector
      },
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Book Chapters',
          items: [
            {
              label: 'Chapter 1: Foundations',
              to: '/docs/category/chapter-1-foundations',
            },
            {
              label: 'Chapter 2: ROS 2',
              to: '/docs/category/chapter-2-ros-2',
            },
            {
              label: 'Chapter 3: Simulation',
              to: '/docs/category/chapter-3-simulation',
            },
          ],
        },
        {
          title: 'Advanced Topics',
          items: [
            {
              label: 'Chapter 4: NVIDIA Isaac',
              to: '/docs/category/chapter-4-nvidia-isaac',
            },
            {
              label: 'Chapter 5: Autonomous Systems',
              to: '/docs/category/chapter-5-autonomous-systems',
            },
          ],
        },
        {
          title: 'Resources',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/your-username/my-ai-book-hackathon',
            },
            {
              label: 'ROS 2',
              href: 'https://docs.ros.org/en/humble/',
            },
            {
              label: 'NVIDIA Isaac',
              href: 'https://docs.omniverse.nvidia.com/',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Physical AI Book Project. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['python', 'bash', 'yaml', 'cpp'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
