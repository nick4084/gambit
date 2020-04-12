export default {
  items: [
    {
      name: 'Crypto',
      url: '/crypto',
      icon: 'cui-dollar',
      badge: {
        variant: 'info',
        text: 'NEW',
      },
    },
    // {
    //   title: true,
    //   name: 'Gamble',
    //   wrapper: {            // optional wrapper object
    //     element: '',        // required valid HTML5 element tag
    //     attributes: {}        // optional valid JS object with JS API naming ex: { className: "my-class", style: { fontFamily: "Verdana" }, id: "my-id"}
    //   },
    //   class: ''             // optional class names space delimited list for title item ex: "text-center"
    // },
    {
      name: '4D',
      url: '/4d',
      icon: 'cui-briefcase',
      badge: {
        variant: 'warning',
        text: 'Beta',
      },
    },
    {
      name: 'ToTo',
      url: '/toto',
      icon: 'icon-globe',
      badge: {
        variant: 'danger',
        text: 'U/C',
      },
    },

  ]
};
