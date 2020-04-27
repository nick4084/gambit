export default {
  items: [
    {
      title: true,
      name: 'Crypto',
      wrapper: {            // optional wrapper object
        element: '',        // required valid HTML5 element tag
        attributes: {}        // optional valid JS object with JS API naming ex: { className: "my-class", style: { fontFamily: "Verdana" }, id: "my-id"}
      },
      class: ''             // optional class names space delimited list for title item ex: "text-center"
    },
    {
      name: 'Dashboard',
      icon: 'cui-dollar',
      url: '/crypto/dashboard',
      badge: {
        variant: 'info',
        text: 'NEW',
      },
    },
    {
      name: 'Candle Analysis',
      icon: 'cui-graph',
      url: '/crypto/candle-analysis',
    },
    {
      name: 'Trading',
      icon: 'fa fa-handshake-o',
      url: '/crypto/trading',
    },
    {
      title: true,
      name: 'Lottery',
      wrapper: {            // optional wrapper object
        element: '',        // required valid HTML5 element tag
        attributes: {}        // optional valid JS object with JS API naming ex: { className: "my-class", style: { fontFamily: "Verdana" }, id: "my-id"}
      },
      class: ''             // optional class names space delimited list for title item ex: "text-center"
    },
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