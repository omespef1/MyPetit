export const DynamicAsideMenuConfig = {
  items: [
    {
      title: 'Dashboard',
      root: true,
      icon: 'flaticon2-architecture-and-city',
      svg: './assets/media/svg/icons/Menu/Chart2.svg',
      page: '/dashboard',
      translate: 'MENU.DASHBOARD',
      bullet: 'dot',
    },
    // {
    //   title: 'Layout Builder',
    //   root: true,
    //   icon: 'flaticon2-expand',
    //   page: '/builder',
    //   svg: './assets/media/svg/icons/Home/Library.svg'
    // },
    { section: 'Configuration' },
    {
      title: 'User Management',
      translate: 'MENU.USER_MANAGEMENT',
      root: true,
      bullet: 'dot',
      icon: 'flaticon2-user-outline-symbol',
      svg: './assets/media/svg/icons/Menu/User2.svg',
      page: '/user-management',
      submenu: [
        {
          title: 'Users',
          translate: 'MENU.USERS',
          page: '/user-management/users'
        },
        {
          title: 'Roles',
          translate: 'MENU.ROLES',
          page: '/user-management/roles'
        }
      ]
    },
    {
      title: 'Pet Management',
      translate: 'MENU.PET_MANAGEMENT',
      root: true,
      bullet: 'dot',
      icon: 'flaticon2-correct',
      svg: './assets/media/svg/icons/Menu/Pet.svg',
      page: '/pet-management',
      submenu: [
        {
          title: 'Types',
          translate: 'MENU.PET_TYPES',
          page: '/pet-management/types'
        },
        {
          title: 'Tags',
          translate: 'MENU.TAGS',
          page: '/pet-management/tags'
        },
        {
          title: 'Hairs Lengths',
          translate: 'MENU.HAIR_LENGTHS',
          page: '/pet-management/hair-lengths'
        }
      ]
    },
    {
      title: 'Owners',
      root: true,
      icon: 'flaticon2-architecture-and-city',
      svg: './assets/media/svg/icons/Menu/Person.svg',
      page: '/owners',
      translate: 'MENU.OWNERS',
      bullet: 'dot',
    },
    // {
    //   title: 'User Profile',
    //   root: true,
    //   bullet: 'dot',
    //   icon: 'flaticon2-user-outline-symbol',
    //   svg: './assets/media/svg/icons/Communication/Add-user.svg',
    //   page: '/user-profile',
    // },
    // { section: 'Custom' },
    // {
    //   title: 'Wizards',
    //   root: true,
    //   bullet: 'dot',
    //   icon: 'flaticon2-mail-1',
    //   svg: './assets/media/svg/icons/Shopping/Box1.svg',
    //   page: '/wizards',
    //   submenu: [
    //     {
    //       title: 'Wizard 1',
    //       page: '/wizards/wizard-1'
    //     },
    //     {
    //       title: 'Wizard 2',
    //       page: '/wizards/wizard-2'
    //     },
    //     {
    //       title: 'Wizard 3',
    //       page: '/wizards/wizard-3'
    //     },
    //     {
    //       title: 'Wizard 4',
    //       page: '/wizards/wizard-4'
    //     },
    //   ]
    // },
    // {
    //   title: 'Error Pages',
    //   root: true,
    //   bullet: 'dot',
    //   icon: 'flaticon2-list-2',
    //   svg: './assets/media/svg/icons/Code/Warning-2.svg',
    //   page: '/error',
    //   submenu: [
    //     {
    //       title: 'Error 1',
    //       page: '/error/error-1'
    //     },
    //     {
    //       title: 'Error 2',
    //       page: '/error/error-2'
    //     },
    //     {
    //       title: 'Error 3',
    //       page: '/error/error-3'
    //     },
    //     {
    //       title: 'Error 4',
    //       page: '/error/error-4'
    //     },
    //     {
    //       title: 'Error 5',
    //       page: '/error/error-5'
    //     },
    //     {
    //       title: 'Error 6',
    //       page: '/error/error-6'
    //     },
    //   ]
    // },
  ]
};
